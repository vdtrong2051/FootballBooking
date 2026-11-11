using FootballBooking.Application.Fields;
using FootballBooking.Application.Bookings;
using FootballBooking.Web.ViewModels.Fields;
using Microsoft.AspNetCore.Mvc;

namespace FootballBooking.Web.Controllers;

public sealed class FieldsController(IFieldService fieldService, IBookingService bookingService) : Controller
{
    [HttpGet("/fields")]
    public async Task<IActionResult> Index(CancellationToken cancellationToken)
    {
        var fields = await fieldService.ListPublicFieldsAsync(cancellationToken);
        return View(new FieldListPageViewModel(fields));
    }

    [HttpGet("/fields/{slug}")]
    public async Task<IActionResult> Details(string slug, CancellationToken cancellationToken)
    {
        var field = await fieldService.GetFieldDetailBySlugAsync(slug, cancellationToken);
        if (field is null)
        {
            return NotFound();
        }

        return View(new FieldDetailPageViewModel(field));
    }

    [HttpGet("/fields/{id:guid}/availability")]
    public async Task<IActionResult> Availability(Guid id, string date, int? durationMinutes, CancellationToken cancellationToken)
    {
        if (!DateOnly.TryParseExact(date, "dd/MM/yyyy", null, System.Globalization.DateTimeStyles.None, out var bookingDate))
        {
            return BadRequest(new { message = "Ngày cần theo định dạng dd/MM/yyyy." });
        }

        if (durationMinutes is null)
        {
            // Preserve the legacy response shape for existing consumers.
            var existingSlots = await bookingService.GetAvailabilityAsync(id, bookingDate, cancellationToken);
            Response.Headers.CacheControl = "no-store";
            return Json(existingSlots);
        }

        if (durationMinutes is not (60 or 90 or 120))
            return BadRequest(new { message = "Thời lượng phải là 60, 90 hoặc 120 phút." });

        var slots = await bookingService.GetAvailabilityAsync(id, bookingDate, durationMinutes.Value, cancellationToken);
        Response.Headers.CacheControl = "no-store";
        return Json(new { fieldId = id, date = bookingDate.ToString("yyyy-MM-dd"), durationMinutes, slots });
    }
}
