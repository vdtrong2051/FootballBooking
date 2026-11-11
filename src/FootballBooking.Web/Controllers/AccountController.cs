using System.Security.Claims;
using FootballBooking.Application.Bookings;
using FootballBooking.Application.Common.Security;
using FootballBooking.Domain.Users;
using FootballBooking.Infrastructure.Identity;
using FootballBooking.Web.ViewModels.Account;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FootballBooking.Web.Controllers;

[Route("account")]
public sealed class AccountController(
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager,
    RoleManager<IdentityRole<Guid>> roleManager,
    IBookingService bookingService,
    PhoneOtpService phoneOtpService) : Controller
{
    [HttpGet("login")]
    [AllowAnonymous]
    public IActionResult Login(string? returnUrl = null)
    {
        if (User.Identity?.IsAuthenticated == true)
        {
            return RedirectToLocal(returnUrl);
        }

        return View(new CustomerLoginViewModel { ReturnUrl = returnUrl });
    }

    [HttpPost("login")]
    [AllowAnonymous]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Login(CustomerLoginViewModel model, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return View(model);
        }

        var identifier = model.Identifier.Trim();
        var user = await userManager.FindByEmailAsync(identifier)
            ?? await userManager.Users.FirstOrDefaultAsync(
                candidate => candidate.PhoneNumber == identifier || candidate.UserName == identifier,
                cancellationToken);

        if (user is null || user.AccountStatus != AccountStatus.Active)
        {
            ModelState.AddModelError(string.Empty, "Thông tin đăng nhập không đúng hoặc tài khoản chưa kích hoạt.");
            return View(model);
        }
        if (await userManager.IsInRoleAsync(user, ApplicationRoles.Customer))
        {
            var phone = VietnamPhone.Normalize(user.PhoneNumber);
            var phoneOwner = phone is null ? null : await userManager.FindByLoginAsync("FootballBooking.Phone", phone);
            if (!user.PhoneNumberConfirmed || phoneOwner?.Id != user.Id)
            {
                ModelState.AddModelError(string.Empty,
                    "Tài khoản cũ chưa có bằng chứng xác thực số điện thoại. Vui lòng liên hệ quản trị viên để xác thực lại.");
                return View(model);
            }
        }

        var result = await signInManager.PasswordSignInAsync(user, model.Password, model.RememberMe, lockoutOnFailure: true);
        if (!result.Succeeded)
        {
            ModelState.AddModelError(string.Empty, "Thông tin đăng nhập không đúng.");
            return View(model);
        }

        user.LastLoginAtUtc = DateTimeOffset.UtcNow;
        user.UpdatedAtUtc = DateTimeOffset.UtcNow;
        await userManager.UpdateAsync(user);

        TempData["SuccessMessage"] = $"Xin chào {user.FullName}!";
        return RedirectToLocal(model.ReturnUrl);
    }

    [HttpGet("register")]
    [AllowAnonymous]
    public IActionResult Register(string? returnUrl = null)
    {
        if (User.Identity?.IsAuthenticated == true)
        {
            return RedirectToLocal(returnUrl);
        }

        return View(new CustomerRegisterViewModel { ReturnUrl = returnUrl });
    }

    [HttpPost("register")]
    [AllowAnonymous]
    [Microsoft.AspNetCore.RateLimiting.EnableRateLimiting("phone-otp")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Register(CustomerRegisterViewModel model, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return View(model);
        }

        var email = model.Email.Trim();
        var phone = VietnamPhone.Normalize(model.PhoneNumber);
        if (phone is null)
        {
            ModelState.AddModelError(nameof(model.PhoneNumber), "Số điện thoại Việt Nam không hợp lệ.");
            return View(model);
        }
        if (await userManager.FindByEmailAsync(email) is not null)
        {
            ModelState.AddModelError(nameof(model.Email), "Email đã được đăng ký. Vui lòng đăng nhập.");
            return View(model);
        }
        if (await userManager.FindByLoginAsync("FootballBooking.Phone", phone) is not null
            || await userManager.Users.AnyAsync(u => u.PhoneNumber == phone, cancellationToken))
        {
            ModelState.AddModelError(nameof(model.PhoneNumber), "Số điện thoại đã được đăng ký.");
            return View(model);
        }

        if (!await roleManager.RoleExistsAsync(ApplicationRoles.Customer))
        {
            await roleManager.CreateAsync(new IdentityRole<Guid>(ApplicationRoles.Customer));
        }

        var user = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            UserName = email,
            Email = email,
            PhoneNumber = phone,
            FullName = model.FullName.Trim(),
            EmailConfirmed = false,
            PhoneNumberConfirmed = false,
            AccountStatus = AccountStatus.Inactive,
            CreatedAtUtc = DateTimeOffset.UtcNow,
            UpdatedAtUtc = DateTimeOffset.UtcNow
        };

        var createResult = await userManager.CreateAsync(user, model.Password);
        if (!createResult.Succeeded)
        {
            foreach (var error in createResult.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }

            return View(model);
        }

        // Uses AspNetUserLogins' existing UNIQUE(LoginProvider, ProviderKey) index.
        // This reserves the normalized phone without adding a schema migration.
        var reserved = await userManager.AddLoginAsync(user,
            new UserLoginInfo("FootballBooking.Phone", phone, "Phone reservation"));
        if (!reserved.Succeeded)
        {
            await userManager.DeleteAsync(user);
            ModelState.AddModelError(nameof(model.PhoneNumber), "Số điện thoại đã được đăng ký.");
            return View(model);
        }
        var roleResult = await userManager.AddToRoleAsync(user, ApplicationRoles.Customer);
        if (!roleResult.Succeeded)
        {
            await userManager.DeleteAsync(user);
            ModelState.AddModelError(string.Empty, "Không thể tạo tài khoản lúc này.");
            return View(model);
        }
        var sent = await phoneOtpService.SendAsync(user, cancellationToken);
        if (!sent.Success) TempData["ErrorMessage"] = sent.Error;
        return RedirectToAction(nameof(VerifyPhone), new { userId = user.Id, returnUrl = model.ReturnUrl });
    }

    [HttpGet("verify-phone")]
    [AllowAnonymous]
    public async Task<IActionResult> VerifyPhone(Guid userId, string? returnUrl = null)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null || user.PhoneNumberConfirmed || user.AccountStatus != AccountStatus.Inactive)
            return NotFound();
        return View(new PhoneVerificationViewModel { UserId = userId, ReturnUrl = returnUrl,
            MaskedPhone = "******" + (user.PhoneNumber?.Length >= 4 ? user.PhoneNumber[^4..] : "") });
    }

    [HttpPost("verify-phone")]
    [AllowAnonymous]
    [Microsoft.AspNetCore.RateLimiting.EnableRateLimiting("phone-otp")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> VerifyPhone(PhoneVerificationViewModel model)
    {
        var user = await userManager.FindByIdAsync(model.UserId.ToString());
        if (user is null || user.PhoneNumberConfirmed || user.AccountStatus != AccountStatus.Inactive)
            return NotFound();
        model.MaskedPhone = "******" + (user.PhoneNumber?.Length >= 4 ? user.PhoneNumber[^4..] : "");
        if (!ModelState.IsValid) return View(model);
        var result = await phoneOtpService.VerifyAsync(user, model.Code);
        if (!result.Success)
        {
            ModelState.AddModelError(nameof(model.Code), result.Error);
            return View(model);
        }
        await signInManager.SignInAsync(user, isPersistent: false);
        TempData["SuccessMessage"] = "Số điện thoại đã được xác thực. Tài khoản đã kích hoạt.";
        return RedirectToLocal(model.ReturnUrl);
    }

    [HttpPost("resend-phone-otp")]
    [AllowAnonymous]
    [Microsoft.AspNetCore.RateLimiting.EnableRateLimiting("phone-otp")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ResendPhoneOtp(Guid userId, string? returnUrl, CancellationToken cancellationToken)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null || user.PhoneNumberConfirmed || user.AccountStatus != AccountStatus.Inactive)
            return NotFound();
        var result = await phoneOtpService.SendAsync(user, cancellationToken);
        TempData[result.Success ? "SuccessMessage" : "ErrorMessage"] = result.Success
            ? "Đã gửi lại mã xác thực." : result.Error;
        return RedirectToAction(nameof(VerifyPhone), new { userId, returnUrl });
    }

    [HttpPost("logout")]
    [Authorize]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Logout()
    {
        await signInManager.SignOutAsync();
        TempData["SuccessMessage"] = "Bạn đã đăng xuất.";
        return RedirectToAction("Index", "Home");
    }

    [HttpGet("bookings")]
    [Authorize]
    public async Task<IActionResult> Bookings(CancellationToken cancellationToken)
    {
        var userIdText = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdText, out var userId))
        {
            return RedirectToAction(nameof(Login), new { returnUrl = "/account/bookings" });
        }

        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null) return Unauthorized();
        if (await userManager.IsInRoleAsync(user, ApplicationRoles.Customer))
        {
            var phone = VietnamPhone.Normalize(user.PhoneNumber);
            var phoneOwner = phone is null ? null : await userManager.FindByLoginAsync("FootballBooking.Phone", phone);
            if (!user.PhoneNumberConfirmed || phoneOwner?.Id != user.Id)
                return Forbid();
        }
        // Account history is linked ONLY by verified identity, not by a matching phone.
        var bookings = await bookingService.ListCustomerBookingsAsync(userId, null, cancellationToken);

        return View(new CustomerBookingsViewModel
        {
            CustomerName = user?.FullName ?? User.Identity?.Name ?? "Khách hàng",
            CustomerPhone = user?.PhoneNumber,
            CustomerEmail = user?.Email,
            Bookings = bookings
        });
    }

    private IActionResult RedirectToLocal(string? returnUrl)
    {
        if (!string.IsNullOrWhiteSpace(returnUrl) && Url.IsLocalUrl(returnUrl))
        {
            return Redirect(returnUrl);
        }

        if (User.IsInRole(ApplicationRoles.Owner) || User.IsInRole(ApplicationRoles.Staff))
        {
            return Redirect("/admin/dashboard");
        }

        return RedirectToAction(nameof(Bookings));
    }
}
