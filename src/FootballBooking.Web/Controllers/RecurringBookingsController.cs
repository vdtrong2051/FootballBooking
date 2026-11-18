using System.Globalization;
using System.Security.Claims;
using FootballBooking.Application.Bookings;
using FootballBooking.Application.Common.Security;
using FootballBooking.Application.Fields;
using FootballBooking.Infrastructure.Identity;
using FootballBooking.Web.ViewModels.Bookings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace FootballBooking.Web.Controllers;

[Route("account/recurring")]
[Authorize(Roles = ApplicationRoles.Customer)]
public sealed class RecurringBookingsController(ICustomerBookingManagementService management,
    IFieldService fields, UserManager<ApplicationUser> users) : Controller
{
    [HttpGet("")]
    public async Task<IActionResult> Index(CancellationToken ct)
    {
        var userId = CurrentUserId();
        if (userId is null) return Forbid();
        return View(await management.ListSeriesAsync(userId.Value, ct));
    }

    [HttpGet("create")]
    public async Task<IActionResult> Create(CancellationToken ct)
    {
        if (!await VerifiedCustomerAsync()) return Forbid();
        var today = DateOnly.FromDateTime(DateTimeOffset.UtcNow.ToOffset(TimeSpan.FromHours(7)).DateTime);
        return View(new RecurringCreateViewModel {
            FirstDateText = today.AddDays(7).ToString("dd/MM/yyyy"),
            Fields = await fields.ListPublicFieldsAsync(ct)
        });
    }

    [HttpPost("create")]
    [EnableRateLimiting("sensitive-booking")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(RecurringCreateViewModel model, CancellationToken ct)
    {
        model.Fields = await fields.ListPublicFieldsAsync(ct);
        if (!ModelState.IsValid || !DateOnly.TryParseExact(model.FirstDateText, "dd/MM/yyyy",
            CultureInfo.InvariantCulture, DateTimeStyles.None, out var firstDate) ||
            !model.Fields.Any(x => x.Id == model.FieldId))
        {
            ModelState.AddModelError(string.Empty, "Vui lòng kiểm tra sân, ngày bắt đầu và xác nhận chính sách.");
            return View(model);
        }
        if (!await VerifiedCustomerAsync()) return Forbid();
        var user = await users.GetUserAsync(User);
        var userId = CurrentUserId();
        if (user is null || userId is null || string.IsNullOrWhiteSpace(user.PhoneNumber)) return Forbid();
        var created = await management.CreateRecurringAsync(new RecurringRequest(
            model.SeriesId, userId.Value, model.FieldId, firstDate,
            model.StartMinute, model.DurationMinutes, model.Weeks,
            user.FullName, user.PhoneNumber, user.Email), ct);
        if (!created.Succeeded)
        {
            foreach (var error in created.Errors) ModelState.AddModelError(string.Empty, error);
            return View(model);
        }
        return RedirectToAction(nameof(Details), new { id = created.SeriesId });
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Details(Guid id, CancellationToken ct)
    {
        var userId = CurrentUserId();
        if (userId is null) return Forbid();
        var series = await management.GetSeriesAsync(id, userId.Value, ct);
        return series is null ? NotFound() : View(series);
    }

    private Guid? CurrentUserId()
        => Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) && id != Guid.Empty ? id : null;
    private async Task<bool> VerifiedCustomerAsync()
    {
        var user = await users.GetUserAsync(User);
        if (user is null || !user.PhoneNumberConfirmed) return false;
        var phone = VietnamPhone.Normalize(user.PhoneNumber);
        var reserved = phone is null ? null : await users.FindByLoginAsync("FootballBooking.Phone", phone);
        return reserved?.Id == user.Id;
    }
}
