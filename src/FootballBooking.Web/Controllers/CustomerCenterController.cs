using FootballBooking.Application.Bookings;
using FootballBooking.Application.Common.Security;
using FootballBooking.Domain.Bookings;
using FootballBooking.Domain.Users;
using FootballBooking.Infrastructure.Data;
using FootballBooking.Infrastructure.Identity;
using FootballBooking.Web.ViewModels.Account;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FootballBooking.Web.Controllers;

/// <summary>Account dashboard and self-service pages. Never accepts another user's ID.</summary>
[Authorize]
[Route("account")]
[ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
public sealed class CustomerCenterController(
    UserManager<ApplicationUser> users,
    SignInManager<ApplicationUser> signIn,
    IBookingService bookings,
    ApplicationDbContext db,
    PhoneChangeOtpService phoneChange) : Controller
{
    [HttpGet("")]
    public async Task<IActionResult> Index(CancellationToken ct)
    {
        var user = await CurrentUserAsync();
        if (user is null) return Unauthorized();
        var list = await bookings.ListCustomerBookingsAsync(user.Id, null, ct);
        return View(new CustomerAccountHomeViewModel
        {
            FullName = user.FullName,
            Email = user.Email,
            PhoneConfirmed = user.PhoneNumberConfirmed,
            RecentBookings = list.Take(4).ToArray(),
            UpcomingCount = list.Count(x => x.Status is BookingStatus.PendingPayment or BookingStatus.Confirmed
                or BookingStatus.CheckedIn or BookingStatus.InProgress),
            CompletedCount = list.Count(x => x.Status == BookingStatus.Completed),
            OtherCount = list.Count(x => x.Status is BookingStatus.Cancelled or BookingStatus.Expired or BookingStatus.NoShow)
        });
    }

    [HttpGet("profile")]
    public async Task<IActionResult> Profile()
    {
        var user = await CurrentUserAsync();
        if (user is null) return Unauthorized();
        return View(ProfileModel(user));
    }

    [HttpPost("profile")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Profile(CustomerProfileEditViewModel model)
    {
        var user = await CurrentUserAsync();
        if (user is null) return Unauthorized();
        model.Email = user.Email;
        model.PhoneNumber = user.PhoneNumber;
        model.PhoneConfirmed = user.PhoneNumberConfirmed;
        model.FullName = model.FullName?.Trim() ?? string.Empty;
        if (!ModelState.IsValid) return View(model);
        user.FullName = model.FullName;
        user.UpdatedAtUtc = DateTimeOffset.UtcNow;
        var result = await users.UpdateAsync(user);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors) ModelState.AddModelError(string.Empty, error.Description);
            return View(model);
        }
        await signIn.RefreshSignInAsync(user);
        TempData["SuccessMessage"] = "Đã cập nhật họ tên hiển thị.";
        return RedirectToAction(nameof(Profile));
    }

    [HttpGet("security")]
    public IActionResult Security() => View(new CustomerPasswordViewModel());

    [HttpPost("security")]
    [ValidateAntiForgeryToken]
    [Microsoft.AspNetCore.RateLimiting.EnableRateLimiting("sensitive-booking")]
    public async Task<IActionResult> Security(CustomerPasswordViewModel model)
    {
        if (!ModelState.IsValid) return View(model);
        if (string.Equals(model.CurrentPassword, model.NewPassword, StringComparison.Ordinal))
        {
            ModelState.AddModelError(nameof(model.NewPassword), "Mật khẩu mới cần khác mật khẩu cũ.");
            return View(model);
        }
        var user = await CurrentUserAsync();
        if (user is null) return Unauthorized();
        var result = await users.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);
        if (!result.Succeeded)
        {
            ModelState.AddModelError(string.Empty, "Không đổi được mật khẩu. Kiểm tra mật khẩu hiện tại và độ mạnh của mật khẩu mới.");
            return View(model);
        }
        await signIn.RefreshSignInAsync(user);
        TempData["SuccessMessage"] = "Đã đổi mật khẩu. Vui lòng bảo mật thông tin đăng nhập.";
        return RedirectToAction(nameof(Security));
    }

    [HttpGet("change-phone")]
    public IActionResult ChangePhone() => View(new CustomerPhoneChangeViewModel());

    [HttpPost("change-phone")]
    [ValidateAntiForgeryToken]
    [Microsoft.AspNetCore.RateLimiting.EnableRateLimiting("phone-otp")]
    public async Task<IActionResult> ChangePhone(CustomerPhoneChangeViewModel model, CancellationToken ct)
    {
        if (!ModelState.IsValid) return View(model);
        var user = await CurrentUserAsync();
        if (user is null) return Unauthorized();
        if (!await users.CheckPasswordAsync(user, model.CurrentPassword))
        {
            ModelState.AddModelError(nameof(model.CurrentPassword), "Mật khẩu hiện tại không chính xác.");
            return View(model);
        }
        var started = await phoneChange.BeginAsync(user, model.NewPhone, ct);
        if (!started.Success)
        {
            ModelState.AddModelError(string.Empty, started.Error);
            return View(model);
        }
        TempData["SuccessMessage"] = "Đã gửi mã OTP đến số điện thoại mới.";
        return RedirectToAction(nameof(VerifyNewPhone));
    }

    [HttpGet("verify-new-phone")]
    public async Task<IActionResult> VerifyNewPhone()
    {
        var user = await CurrentUserAsync();
        if (user is null) return Unauthorized();
        var masked = await phoneChange.MaskedPendingPhoneAsync(user);
        if (masked is null) return RedirectToAction(nameof(ChangePhone));
        return View(new CustomerPhoneVerifyViewModel { MaskedPhone = masked });
    }

    [HttpPost("verify-new-phone")]
    [ValidateAntiForgeryToken]
    [Microsoft.AspNetCore.RateLimiting.EnableRateLimiting("phone-otp")]
    public async Task<IActionResult> VerifyNewPhone(CustomerPhoneVerifyViewModel model, CancellationToken ct)
    {
        var user = await CurrentUserAsync();
        if (user is null) return Unauthorized();
        model.MaskedPhone = await phoneChange.MaskedPendingPhoneAsync(user) ?? "******";
        if (!ModelState.IsValid) return View(model);
        var result = await phoneChange.VerifyAsync(user, model.Code, ct);
        if (!result.Success)
        {
            ModelState.AddModelError(string.Empty, result.Error);
            return View(model);
        }
        await signIn.RefreshSignInAsync(user);
        TempData["SuccessMessage"] = "Đã xác thực số điện thoại mới. Những booking cũ vẫn giữ nguyên quyền sở hữu.";
        return RedirectToAction(nameof(Profile));
    }

    [HttpGet("payments")]
    public async Task<IActionResult> Payments(CancellationToken ct)
    {
        var user = await CurrentUserAsync();
        if (user is null) return Unauthorized();
        // Important: strict CustomerUserId ownership; never associate guest bookings by phone.
        var ledger = await (
            from payment in db.Payments.AsNoTracking()
            join booking in db.Bookings.AsNoTracking() on payment.BookingId equals booking.Id
            where booking.CustomerUserId == user.Id
            orderby payment.CreatedAtUtc descending
            select new CustomerPaymentLedgerRow(booking.BookingCode, booking.Id,
                payment.PaymentType, payment.Method, payment.Amount, payment.Status,
                payment.TransactionCode, payment.CreatedAtUtc))
            .Take(80).ToListAsync(ct);
        var attempts = await (
            from attempt in db.PaymentAttempts.AsNoTracking()
            join booking in db.Bookings.AsNoTracking() on attempt.BookingId equals booking.Id
            where booking.CustomerUserId == user.Id
            orderby attempt.CreatedAtUtc descending
            select new CustomerPaymentAttemptRow(booking.BookingCode, booking.Id,
                attempt.Method, attempt.Amount, attempt.Status,
                attempt.RequestCode, attempt.CreatedAtUtc))
            .Take(80).ToListAsync(ct);
        return View(new CustomerPaymentHistoryViewModel
        {
            ReceivedPayments = ledger,
            Attempts = attempts
        });
    }

    [HttpGet("help")]
    public IActionResult Help() => View();

    private async Task<ApplicationUser?> CurrentUserAsync()
    {
        var user = await users.GetUserAsync(User);
        if (user is null || user.AccountStatus != AccountStatus.Active) return null;
        // Preserve the GĐ0 rule: a Customer must have a verified, reserved phone.
        // Authentication alone never claims a guest booking by telephone number.
        if (await users.IsInRoleAsync(user, ApplicationRoles.Customer))
        {
            var phone = VietnamPhone.Normalize(user.PhoneNumber);
            var owner = phone is null ? null : await users.FindByLoginAsync("FootballBooking.Phone", phone);
            if (!user.PhoneNumberConfirmed || owner?.Id != user.Id) return null;
        }
        return user;
    }

    private static CustomerProfileEditViewModel ProfileModel(ApplicationUser user)
        => new()
        {
            FullName = user.FullName,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            PhoneConfirmed = user.PhoneNumberConfirmed
        };
}
