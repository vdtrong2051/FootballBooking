using System.Globalization;
using System.Linq;
using System.Security.Claims;
using FootballBooking.Application.Bookings;
using FootballBooking.Application.Common.Security;
using FootballBooking.Domain.Bookings;
using FootballBooking.Infrastructure.Identity;
using FootballBooking.Web.ViewModels.Bookings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace FootballBooking.Web.Controllers;

[Route("booking/manage")]
public sealed class BookingManageController(
    IBookingService bookings, ICustomerBookingManagementService manager,
    GuestBookingOtpService otp, IDataProtectionProvider provider) : Controller
{
    private const string GuestCookie = "fb_gd5d_guest";
    private IDataProtector Protector => provider.CreateProtector("FootballBooking.GD5D.GuestCookie.v1");
    private IDataProtector PreviewProtector => provider.CreateProtector("FootballBooking.GD5D.ReschedulePreview.v1");

    [HttpGet("customer/{id:guid}/reschedule")]
    [Authorize(Roles = ApplicationRoles.Customer)]
    public async Task<IActionResult> CustomerReschedule(Guid id, CancellationToken ct)
    {
        var current = await OwnedCustomerAsync(id, ct);
        if (current is null) return NotFound();
        return View("Reschedule", FormFor(current, false));
    }

    [HttpPost("customer/{id:guid}/reschedule")]
    [Authorize(Roles = ApplicationRoles.Customer)]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CustomerReschedule(Guid id, RescheduleFormViewModel form,
        string action, CancellationToken ct)
    {
        var current = await OwnedCustomerAsync(id, ct);
        if (current is null) return NotFound();
        return await ProcessAsync(current, form, action, CurrentUserId(), false, ct);
    }

    [HttpGet("guest/{code}")]
    [AllowAnonymous]
    public IActionResult GuestVerify(string code)
    {
        Response.Headers.CacheControl = "no-store";
        return View("GuestOtp", new GuestOtpFormViewModel { BookingCode = code });
    }

    [HttpPost("guest/{code}/otp/send")]
    [AllowAnonymous, EnableRateLimiting("phone-otp"), ValidateAntiForgeryToken]
    public async Task<IActionResult> GuestSend(string code, string phone, CancellationToken ct)
    {
        var sent = await otp.SendAsync(code, phone, ct);
        TempData[sent.Ok ? "SuccessMessage" : "ErrorMessage"] = sent.Message;
        return RedirectToAction(nameof(GuestVerify), new { code });
    }

    [HttpPost("guest/{code}/otp/verify")]
    [AllowAnonymous, EnableRateLimiting("phone-otp"), ValidateAntiForgeryToken]
    public async Task<IActionResult> GuestVerifyOtp(string code, string phone, string challengeCode, CancellationToken ct)
    {
        var bookingId = await otp.VerifyAsync(code, phone, challengeCode, ct);
        if (bookingId is null)
        {
            TempData["ErrorMessage"] = "OTP không hợp lệ, hết hạn hoặc đã vượt số lần thử.";
            return RedirectToAction(nameof(GuestVerify), new { code });
        }
        var expiry = DateTimeOffset.UtcNow.AddMinutes(5).ToUnixTimeSeconds();
        var proof = Protector.Protect($"{bookingId.Value:N}|{expiry}");
        Response.Cookies.Append(GuestCookie, proof, new CookieOptions {
            HttpOnly = true, Secure = Request.IsHttps, SameSite = SameSiteMode.Strict,
            IsEssential = true, MaxAge = TimeSpan.FromMinutes(5), Path = "/booking/manage/guest"
        });
        return RedirectToAction(nameof(GuestReschedule), new { code });
    }

    [HttpGet("guest/{code}/reschedule")]
    [AllowAnonymous]
    public async Task<IActionResult> GuestReschedule(string code, CancellationToken ct)
    {
        var booking = await VerifiedGuestAsync(code, ct);
        if (booking is null) return RedirectToAction(nameof(GuestVerify), new { code });
        return View("Reschedule", FormFor(booking, true));
    }

    [HttpPost("guest/{code}/reschedule")]
    [AllowAnonymous, EnableRateLimiting("sensitive-booking"), ValidateAntiForgeryToken]
    public async Task<IActionResult> GuestReschedule(string code, RescheduleFormViewModel form,
        string action, CancellationToken ct)
    {
        var booking = await VerifiedGuestAsync(code, ct);
        if (booking is null) return Forbid();
        return await ProcessAsync(booking, form, action, null, true, ct);
    }

    private async Task<IActionResult> ProcessAsync(BookingDetailDto booking, RescheduleFormViewModel form,
        string action, Guid? customerId, bool guest, CancellationToken ct)
    {
        Response.Headers.CacheControl = "no-store";
        form.Booking = booking; form.BookingId = booking.Id; form.BookingCode = booking.BookingCode;
        form.IsGuest = guest;
        if (!DateOnly.TryParseExact(form.TargetDateText, "dd/MM/yyyy", CultureInfo.InvariantCulture,
            DateTimeStyles.None, out var date) || form.TargetStartMinute < 0 || form.DurationMinutes != booking.EndMinute - booking.StartMinute)
        {
            ModelState.AddModelError(string.Empty, "Ngày, giờ hoặc thời lượng đổi lịch chưa hợp lệ.");
            return View("Reschedule", form);
        }
        var request = new RescheduleRequest(booking.Id, customerId, guest,
            date, form.TargetStartMinute, form.DurationMinutes, form.ExpectedNewTotalAmount);
        if (!string.Equals(action, "confirm", StringComparison.Ordinal))
        {
            form.Preview = await manager.PreviewAsync(request, ct);
            if (form.Preview.Succeeded)
                form.PreviewToken = PreviewProtector.Protect(
                    $"{booking.Id:N}|{date:yyyyMMdd}|{form.TargetStartMinute}|{form.DurationMinutes}|{form.Preview.NewTotal}|{DateTimeOffset.UtcNow.AddMinutes(5).ToUnixTimeSeconds()}");
            return View("Reschedule", form);
        }
        if (form.ExpectedNewTotalAmount is null || string.IsNullOrWhiteSpace(form.PreviewToken))
        {
            ModelState.AddModelError(string.Empty, "Cần xem báo giá trước khi xác nhận.");
            return View("Reschedule", form);
        }
        try
        {
            var original = PreviewProtector.Unprotect(form.PreviewToken);
            var expected = $"{booking.Id:N}|{date:yyyyMMdd}|{form.TargetStartMinute}|{form.DurationMinutes}|{form.ExpectedNewTotalAmount.Value}";
            var parts = original.Split('|');
            if (parts.Length != 6 || !string.Equals(string.Join("|", parts.Take(5)), expected, StringComparison.Ordinal)
                || !long.TryParse(parts[5], out var expires) || DateTimeOffset.UtcNow.ToUnixTimeSeconds() >= expires)
            {
                ModelState.AddModelError(string.Empty, "Báo giá không khớp hoặc đã hết hạn. Vui lòng xem báo giá lại.");
                return View("Reschedule", form);
            }
        }
        catch
        {
            ModelState.AddModelError(string.Empty, "Báo giá không hợp lệ. Vui lòng xem báo giá lại.");
            return View("Reschedule", form);
        }
        var result = await manager.RescheduleAsync(request, ct);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors) ModelState.AddModelError(string.Empty, error);
            form.ExpectedNewTotalAmount = null;
            return View("Reschedule", form);
        }
        TempData["SuccessMessage"] = "Đã đổi lịch. Lịch cũ và chênh lệch giá đã được ghi nhật ký.";
        if (guest)
        {
            Response.Cookies.Delete(GuestCookie, new CookieOptions { Path = "/booking/manage/guest" });
            return RedirectToAction(nameof(GuestVerify), new { code = booking.BookingCode });
        }
        return Redirect("/account/bookings");
    }

    private async Task<BookingDetailDto?> OwnedCustomerAsync(Guid id, CancellationToken ct)
    {
        var userId = CurrentUserId();
        if (userId is null) return null;
        var booking = await bookings.GetAdminBookingAsync(id, ct);
        return booking?.CustomerUserId == userId ? booking : null;
    }
    private async Task<BookingDetailDto?> VerifiedGuestAsync(string code, CancellationToken ct)
    {
        if (!Request.Cookies.TryGetValue(GuestCookie, out var cookie)) return null;
        string value;
        try { value = Protector.Unprotect(cookie); }
        catch { return null; }
        var parts = value.Split('|');
        if (parts.Length != 2 || !Guid.TryParseExact(parts[0], "N", out var bookingId) ||
            !long.TryParse(parts[1], out var expires) || expires <= DateTimeOffset.UtcNow.ToUnixTimeSeconds())
            return null;
        var booking = await bookings.GetBookingByCodeAsync(code, ct);
        return booking?.Id == bookingId && booking.Source == BookingSource.GuestWeb &&
            booking.CustomerUserId is null && booking.Status == BookingStatus.Confirmed ? booking : null;
    }
    private Guid? CurrentUserId()
        => Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) && id != Guid.Empty ? id : null;

    private static RescheduleFormViewModel FormFor(BookingDetailDto booking, bool guest)
        => new() { BookingId = booking.Id, BookingCode = booking.BookingCode, IsGuest = guest,
            Booking = booking, DurationMinutes = booking.EndMinute - booking.StartMinute,
            TargetDateText = booking.BookingDate.AddDays(7).ToString("dd/MM/yyyy"),
            TargetStartMinute = booking.StartMinute };
}
