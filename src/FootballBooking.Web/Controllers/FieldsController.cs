using FootballBooking.Application.Fields;
using FootballBooking.Application.Bookings;
using FootballBooking.Web.ViewModels.Fields;
using Microsoft.AspNetCore.Mvc;

namespace FootballBooking.Web.Controllers;

public sealed class FieldsController(IFieldService fieldService, IBookingService bookingService, IFieldZoneService? zoneService = null) : Controller
{
    [HttpGet("/fields")]
    public async Task<IActionResult> Index(CancellationToken cancellationToken,
        Guid? zoneId = null, string? fieldType = null, string? date = null,
        string? time = null, int durationMinutes = 60)
    {
        Response.Headers.CacheControl = "no-store";
        var all = await fieldService.ListPublicFieldsAsync(cancellationToken);
        IReadOnlyList<FieldZoneDto> zones = zoneService is null ? [] : await zoneService.ListAsync(false, cancellationToken);
        var typesFiltered = all.Where(x => string.IsNullOrWhiteSpace(fieldType)
            || string.Equals(x.FieldType, fieldType, StringComparison.OrdinalIgnoreCase)).ToArray();
        HashSet<Guid>? free = null;
        if (durationMinutes is 60 or 90 or 120
            && DateOnly.TryParseExact(date, "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture,
                System.Globalization.DateTimeStyles.None, out var chosenDate)
            && TimeOnly.TryParseExact(time, "HH:mm", System.Globalization.CultureInfo.InvariantCulture,
                System.Globalization.DateTimeStyles.None, out var chosenTime))
        {
            var minute = chosenTime.Hour * 60 + chosenTime.Minute;
            free = [];
            foreach (var field in typesFiltered)
            {
                var slots = await bookingService.GetAvailabilityAsync(field.Id, chosenDate,
                    durationMinutes, cancellationToken);
                if (slots.Any(x => x.StartMinute == minute && x.IsAvailable)) free.Add(field.Id);
            }
        }
        var counts = zones.Select(z => new ZoneAvailableCountDto(z.Id,
            typesFiltered.Count(x => x.ZoneId == z.Id),
            typesFiltered.Count(x => x.ZoneId == z.Id && (free is null || free.Contains(x.Id))))).ToArray();
        var shown = typesFiltered.Where(x => (zoneId is null || x.ZoneId == zoneId)
            && (free is null || free.Contains(x.Id))).ToArray();
        return View(new FieldListPageViewModel(shown)
        {
            Zones = zones, ZoneId = zoneId, FieldType = fieldType, Date = date,
            Time = time, DurationMinutes = durationMinutes, ZoneCounts = counts
        });
    }

    [HttpGet("/fields/{slug}")]
    public async Task<IActionResult> Details(string slug, CancellationToken cancellationToken)
    {
        var field = await fieldService.GetFieldDetailBySlugAsync(slug, cancellationToken);
        if (field is null || field.Status != FootballBooking.Domain.Fields.FieldStatus.Active
            || (field.ZoneId != null && zoneService is not null
                && !await zoneService.IsActiveAsync(field.ZoneId.Value, cancellationToken)))
            return NotFound();
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
