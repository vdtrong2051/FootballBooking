using System.Security.Claims;
using FootballBooking.Application.Bookings;
using FootballBooking.Application.Fields;
using FootballBooking.Domain.Bookings;
using FootballBooking.Infrastructure.Identity;
using FootballBooking.Web.ViewModels.Bookings;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace FootballBooking.Web.Controllers;

[Route("booking")]
public sealed class BookingController(
    IBookingService bookingService,
    IFieldService fieldService,
    UserManager<ApplicationUser> userManager) : Controller
{
    [HttpGet("")]
    public async Task<IActionResult> Create(Guid? fieldId, string? date, int? startMinute, int? durationMinutes, CancellationToken cancellationToken)
    {
        var model = new BookingCreateViewModel();
        await PopulateCreateModelAsync(model, cancellationToken);
        await PopulateAuthenticatedCustomerAsync(model);
        if (fieldId is not null)
        {
            model.FieldId = fieldId.Value;
        }

        if (!string.IsNullOrWhiteSpace(date))
        {
            model.BookingDateText = date;
        }

        if (durationMinutes is 60 or 90 or 120)
            model.DurationMinutes = durationMinutes.Value;

        if (startMinute is >= 0)
            model.StartMinute = startMinute.Value;

        await PopulateAvailabilityAndQuoteAsync(model, cancellationToken, selectFirstAvailable: true);
        return View(model);
    }

    [HttpPost("")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(BookingCreateViewModel model, CancellationToken cancellationToken)
    {
        await PopulateCreateModelAsync(model, cancellationToken);
        if (model.DurationMinutes is not (60 or 90 or 120))
            ModelState.AddModelError(nameof(model.DurationMinutes), "Thời lượng phải là 60, 90 hoặc 120 phút.");
        if (model.StartMinute < 0)
            ModelState.AddModelError(nameof(model.StartMinute), "Vui lòng chọn khung giờ trống.");
        var bookingDate = model.ParseBookingDate();
        if (bookingDate is null)
        {
            ModelState.AddModelError(nameof(model.BookingDateText), "Ngày đặt sân cần nhập theo định dạng dd/MM/yyyy.");
        }

        if (!ModelState.IsValid || bookingDate is null)
        {
            await PopulateAvailabilityAndQuoteAsync(model, cancellationToken);
            return View(model);
        }

        Guid? customerUserId = null;
        var source = BookingSource.GuestWeb;
        if (User.Identity?.IsAuthenticated == true
            && Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var parsedUserId))
        {
            customerUserId = parsedUserId;
            source = BookingSource.CustomerAccount;
        }

        var result = await bookingService.CreateBookingAsync(
            new BookingCreateCommand(
                model.FieldId,
                bookingDate.Value,
                model.StartMinute,
                model.EndMinute,
                model.CustomerName,
                model.CustomerPhone,
                model.CustomerEmail,
                model.Note,
                source,
                 null,
                SelectedServices(model),
                model.PromotionCode,
                customerUserId,
                model.PreferredPaymentMethod),
            cancellationToken);

        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error);
            }

            await PopulateAvailabilityAndQuoteAsync(model, cancellationToken);
            return View(model);
        }

        // TempData is protected by the ASP.NET cookie provider. No phone number in URLs.
        TempData["NewBookingCode"] = result.BookingCode;
        return RedirectToAction(nameof(Success), new { code = result.BookingCode });
    }

    [HttpPost("quote")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Quote([FromBody] BookingQuoteRequestViewModel model, CancellationToken cancellationToken)
    {
        if (model is null || model.FieldId == Guid.Empty || model.StartMinute < 0 || model.StartMinute >= 1440
            || model.DurationMinutes is not (60 or 90 or 120)
            || string.IsNullOrWhiteSpace(model.BookingDateText)
            || !DateOnly.TryParseExact(model.BookingDateText, "dd/MM/yyyy", System.Globalization.CultureInfo.InvariantCulture,
                System.Globalization.DateTimeStyles.None, out var bookingDate))
            return BadRequest(new { message = "Sân, ngày, giờ hoặc thời lượng không hợp lệ." });

        var items = model.Services ?? [];
        if (items.Count > 30 || items.Any(item => item.ServiceId == Guid.Empty || item.Quantity < 0 || item.Quantity > 20))
            return BadRequest(new { message = "Dịch vụ hoặc số lượng không hợp lệ." });

        var quote = await bookingService.GetBookingQuoteAsync(new BookingQuoteQuery(
            model.FieldId, bookingDate, model.StartMinute, model.StartMinute + model.DurationMinutes,
            model.CustomerPhone, items.Where(item => item.Quantity > 0)
                .Select(item => new BookingServiceSelectionCommand(item.ServiceId, item.Quantity)).ToArray(),
            model.PromotionCode), cancellationToken);
        Response.Headers.CacheControl = "no-store";
        return Json(quote);
    }

    [HttpGet("success/{code}")]
    public async Task<IActionResult> Success(string code, CancellationToken cancellationToken)
    {
        var booking = await bookingService.GetBookingByCodeAsync(code, cancellationToken);
        if (booking is null) return NotFound();
        var loggedInOwner = User.Identity?.IsAuthenticated == true
            && Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var viewerId)
            && booking.CustomerUserId == viewerId;
        var sameBrowserNewBooking = string.Equals(TempData.Peek("NewBookingCode") as string,
            booking.BookingCode, StringComparison.Ordinal);
        if (!loggedInOwner && !sameBrowserNewBooking)
            return RedirectToAction("Index", "BookingLookup");
        Response.Headers.CacheControl = "no-store";
        return View(new BookingSuccessViewModel { Booking = booking });
    }

    [HttpPost("{code}/cancel")]
    [ValidateAntiForgeryToken]
    [Microsoft.AspNetCore.RateLimiting.EnableRateLimiting("sensitive-booking")]
    public async Task<IActionResult> Cancel(string code, string customerPhone, string? cancellationReason, CancellationToken cancellationToken)
    {
        // Fail closed for guest cancellation until a verified guest-OTP cancellation flow is available.
        if (User.Identity?.IsAuthenticated != true
            || !Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var viewerId))
            return Forbid();
        var ownedBooking = await bookingService.GetBookingByCodeAsync(code, cancellationToken);
        if (ownedBooking is null || ownedBooking.CustomerUserId != viewerId)
            return NotFound();
        var result = await bookingService.CancelPublicBookingAsync(new PublicBookingCancellationCommand(code, customerPhone, cancellationReason), cancellationToken);
        TempData[result.Succeeded ? "SuccessMessage" : "ErrorMessage"] = result.Succeeded
            ? "Đã hủy booking theo yêu cầu của bạn."
            : string.Join(" ", result.Errors);

        return RedirectToAction("Index", "BookingLookup");
    }

    private async Task PopulateAuthenticatedCustomerAsync(BookingCreateViewModel model)
    {
        if (User.Identity?.IsAuthenticated != true
            || !Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId))
        {
            return;
        }

        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
        {
            return;
        }

        if (string.IsNullOrWhiteSpace(model.CustomerName))
        {
            model.CustomerName = user.FullName;
        }

        if (string.IsNullOrWhiteSpace(model.CustomerPhone) && !string.IsNullOrWhiteSpace(user.PhoneNumber))
        {
            model.CustomerPhone = user.PhoneNumber;
        }

        if (string.IsNullOrWhiteSpace(model.CustomerEmail) && !string.IsNullOrWhiteSpace(user.Email))
        {
            model.CustomerEmail = user.Email;
        }
    }

    private async Task PopulateCreateModelAsync(BookingCreateViewModel model, CancellationToken cancellationToken)
    {
        model.Fields = await fieldService.ListPublicFieldsAsync(cancellationToken);
        await PopulateServicesAsync(model, cancellationToken);
        if (model.FieldId == Guid.Empty && model.Fields.Count > 0)
        {
            model.FieldId = model.Fields[0].Id;
        }
    }

    private async Task PopulateAvailabilityAndQuoteAsync(BookingCreateViewModel model, CancellationToken cancellationToken, bool selectFirstAvailable = false)
    {
        var bookingDate = model.ParseBookingDate();
        if (model.FieldId == Guid.Empty || bookingDate is null || model.DurationMinutes is not (60 or 90 or 120))
            return;

        model.Slots = await bookingService.GetAvailabilityAsync(model.FieldId, bookingDate.Value, model.DurationMinutes, cancellationToken);
        if (selectFirstAvailable && !model.Slots.Any(slot => slot.StartMinute == model.StartMinute && slot.IsAvailable))
            model.StartMinute = model.Slots.FirstOrDefault(slot => slot.IsAvailable)?.StartMinute ?? -1;

        if (model.StartMinute < 0)
            return;
        model.QuotePreview = await bookingService.GetBookingQuoteAsync(new BookingQuoteQuery(
            model.FieldId, bookingDate.Value, model.StartMinute, model.EndMinute,
            model.CustomerPhone, SelectedServices(model), model.PromotionCode), cancellationToken);
    }

    private async Task PopulateServicesAsync(BookingCreateViewModel model, CancellationToken cancellationToken)
    {
        var currentQuantities = model.Services.ToDictionary(service => service.ServiceId, service => Math.Max(0, service.Quantity));
        var services = await bookingService.ListActiveServicesAsync(cancellationToken);
        model.Services = services
            .Select(service => new BookingServiceSelectionViewModel
            {
                ServiceId = service.Id,
                Name = service.Name,
                Description = service.Description,
                UnitName = service.UnitName,
                UnitPrice = service.UnitPrice,
                Quantity = currentQuantities.TryGetValue(service.Id, out var quantity) ? quantity : 0
            })
            .ToList();
    }

    private static IReadOnlyList<BookingServiceSelectionCommand> SelectedServices(BookingCreateViewModel model)
        => model.Services
            .Where(service => service.Quantity > 0)
            .Select(service => new BookingServiceSelectionCommand(service.ServiceId, service.Quantity))
            .ToArray();
}
