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
    IBookingService bookingService) : Controller
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
            ModelState.AddModelError(string.Empty, "Thông tin đăng nhập không đúng hoặc tài khoản đã tạm khóa.");
            return View(model);
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
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Register(CustomerRegisterViewModel model, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return View(model);
        }

        var email = model.Email.Trim();
        var phone = model.PhoneNumber.Trim();

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
            EmailConfirmed = true,
            PhoneNumberConfirmed = true,
            AccountStatus = AccountStatus.Active,
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

        await userManager.AddToRoleAsync(user, ApplicationRoles.Customer);
        await signInManager.SignInAsync(user, isPersistent: false);

        TempData["SuccessMessage"] = "Đăng ký tài khoản thành công!";
        return RedirectToLocal(model.ReturnUrl);
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
        var bookings = await bookingService.ListCustomerBookingsAsync(userId, user?.PhoneNumber, cancellationToken);

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

        return RedirectToAction(nameof(Bookings));
    }
}
