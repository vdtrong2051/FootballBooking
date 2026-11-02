using System.Globalization;
using FootballBooking.Application.Bookings;
using FootballBooking.Application.Fields;
using FootballBooking.Domain.Bookings;
using FootballBooking.Web.ViewModels.Bookings;
using FootballBooking.Web.ViewModels.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FootballBooking.Web.Areas.Admin.Controllers;

[Area("Admin")]
[Route("admin/schedule")]
[Authorize(Policy = "InternalUser")]
public sealed class ScheduleController(IBookingService bookingService, IFieldService fieldService) : Controller
{
    [HttpGet("")]
    public async Task<IActionResult> Index(
        Guid? fieldId = null,
        BookingStatus? status = null,
        string? date = null,
        CancellationToken cancellationToken = default)
    {
        ViewData["Title"] = "Lịch sân";
        ViewData["Breadcrumbs"] = new List<BreadcrumbItemViewModel>
        {
            new("Quản trị", "/admin/dashboard"),
            new("Lịch sân")
        };

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var selectedDate = ParseIsoDate(date) ?? today;
        var recentBookings = await bookingService.ListAdminBookingsAsync(null, fieldId, status, cancellationToken);
        return View(new AdminScheduleViewModel
        {
            FieldId = fieldId,
            Status = status,
            InitialDateText = selectedDate.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
            Fields = await fieldService.ListAdminFieldsAsync(cancellationToken),
            WorkItems = BuildWorkItems(recentBookings, today)
        });
    }

    [HttpGet("/admin/api/schedule/events")]
    public async Task<IActionResult> Events(
        string? start,
        string? end,
        Guid? fieldId = null,
        BookingStatus? status = null,
        CancellationToken cancellationToken = default)
    {
        var startDate = ParseIsoDate(start) ?? DateOnly.FromDateTime(DateTime.UtcNow.Date);
        var endDate = ParseIsoDate(end) ?? startDate.AddDays(7);
        var events = await bookingService.ListScheduleEventsAsync(startDate, endDate, fieldId, status, cancellationToken);

        return Json(events.Select(scheduleEvent => new
        {
            id = scheduleEvent.Id,
            title = scheduleEvent.Title,
            start = ToLocalIso(scheduleEvent.EventDate, scheduleEvent.StartMinute),
            end = ToLocalIso(scheduleEvent.EventDate, scheduleEvent.EndMinute),
            url = string.IsNullOrWhiteSpace(scheduleEvent.Url) ? null : scheduleEvent.Url,
            display = scheduleEvent.IsBackground ? "background" : "auto",
            classNames = new[] { $"fb-calendar-event-{scheduleEvent.Tone}" },
            backgroundColor = scheduleEvent.IsBackground ? "#e2e8f0" : null,
            borderColor = scheduleEvent.IsBackground ? "#cbd5e1" : null,
            extendedProps = new
            {
                fieldId = scheduleEvent.FieldId,
                fieldName = scheduleEvent.FieldName,
                bookingCode = scheduleEvent.BookingCode,
                customerPhone = scheduleEvent.CustomerPhone,
                paymentStatusLabel = scheduleEvent.PaymentStatusLabel,
                status = scheduleEvent.Status is null ? null : BookingLabels.Status(scheduleEvent.Status.Value),
                description = scheduleEvent.Description
            }
        }));
    }

    private static DateOnly? ParseIsoDate(string? value)
        => DateOnly.TryParseExact(value?.Length >= 10 ? value[..10] : value, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var date)
            ? date
            : null;

    private static string ToLocalIso(DateOnly date, int minute)
        => date.ToDateTime(TimeOnly.MinValue).AddMinutes(minute).ToString("yyyy-MM-dd'T'HH:mm:ss", CultureInfo.InvariantCulture);

    private static IReadOnlyList<AdminScheduleWorkItemViewModel> BuildWorkItems(IReadOnlyList<BookingSummaryDto> bookings, DateOnly today)
    {
        var items = new List<AdminScheduleWorkItemViewModel>();

        AddGroup(
            items,
            bookings.Where(booking => booking.Status == BookingStatus.PendingPayment)
                .OrderBy(booking => booking.BookingDate)
                .ThenBy(booking => booking.StartMinute)
                .Take(3),
            "Chờ cọc",
            "Khách đã gửi yêu cầu giữ sân, cần ghi nhận cọc hoặc xác nhận giữ sân.",
            "warning");

        AddGroup(
            items,
            bookings.Where(booking =>
                (booking.Status is BookingStatus.Confirmed or BookingStatus.CheckedIn or BookingStatus.InProgress)
                && booking.PaymentStatus != PaymentStatus.Paid)
                .OrderBy(booking => booking.BookingDate)
                .ThenBy(booking => booking.StartMinute)
                .Take(3),
            "Chưa thanh toán đủ",
            "Booking còn khoản phải thu, cần theo dõi trước khi hoàn thành.",
            "info");

        AddGroup(
            items,
            bookings.Where(booking => booking.BookingDate == today && booking.Status == BookingStatus.Confirmed)
                .OrderBy(booking => booking.StartMinute)
                .Take(3),
            "Sắp bắt đầu",
            "Chuẩn bị check-in khách và dịch vụ đi kèm.",
            "active");

        return items.Take(6).ToArray();
    }

    private static void AddGroup(List<AdminScheduleWorkItemViewModel> items, IEnumerable<BookingSummaryDto> bookings, string title, string description, string tone)
    {
        foreach (var booking in bookings)
        {
            items.Add(new AdminScheduleWorkItemViewModel
            {
                Title = $"{title} · {booking.BookingCode}",
                Description = $"{booking.FieldName} · {booking.CustomerName} · {booking.BookingDate:dd/MM/yyyy} {booking.StartMinute / 60:00}:{booking.StartMinute % 60:00}",
                Tone = tone,
                Url = $"/admin/bookings/{booking.Id}"
            });
        }
    }
}
