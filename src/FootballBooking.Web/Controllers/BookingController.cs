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
    public async Task<IActionResult> Create(Guid? fieldId, string? date, int? startMinute, CancellationToken cancellationToken)
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

        if (startMinute is not null)
        {
            model.StartMinute = startMinute.Value;
            model.EndMinute = startMinute.Value + 60;
        }

        await PopulateAvailabilityAndQuoteAsync(model, cancellationToken);
        return View(model);
    }

    [HttpPost("")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(BookingCreateViewModel model, CancellationToken cancellationToken)
    {
        await PopulateCreateModelAsync(model, cancellationToken);
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

        return RedirectToAction(nameof(Success), new { code = result.BookingCode });
    }

    [HttpGet("success/{code}")]
    public async Task<IActionResult> Success(string code, CancellationToken cancellationToken)
    {
        var booking = await bookingService.GetBookingByCodeAsync(code, cancellationToken);
        if (booking is null)
        {
            TempData["SuccessMessage"] = $"Đã tạo booking {code}. Vui lòng lưu mã này để tra cứu.";
            return View(new BookingSuccessViewModel
            {
                Booking = new BookingDetailDto(Guid.Empty, code, Guid.Empty, "Sân bóng", string.Empty, DateOnly.FromDateTime(DateTime.UtcNow), 0, 0, string.Empty, string.Empty, null, BookingSource.GuestWeb, BookingStatus.PendingPayment, PaymentStatus.Unpaid, 0, 0, 0, 0, 0, 0, 0, null, null, null, null, DateTimeOffset.UtcNow, [], [], [])
            });
        }

        return View(new BookingSuccessViewModel { Booking = booking });
    }

    [HttpPost("{code}/cancel")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Cancel(string code, string customerPhone, string? cancellationReason, CancellationToken cancellationToken)
    {
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

    private async Task PopulateAvailabilityAndQuoteAsync(BookingCreateViewModel model, CancellationToken cancellationToken)
    {
        var bookingDate = model.ParseBookingDate();
        if (model.FieldId == Guid.Empty || bookingDate is null)
        {
            return;
        }

        model.Slots = await bookingService.GetAvailabilityAsync(model.FieldId, bookingDate.Value, cancellationToken);
        model.Quote = await bookingService.GetPricingQuoteAsync(model.FieldId, bookingDate.Value, model.StartMinute, model.EndMinute, cancellationToken);
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
