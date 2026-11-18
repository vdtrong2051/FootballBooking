using System.ComponentModel.DataAnnotations;
using FootballBooking.Application.Bookings;

namespace FootballBooking.Web.ViewModels.Bookings;

public sealed class RescheduleFormViewModel
{
    public Guid BookingId { get; set; }
    public string? BookingCode { get; set; }
    public bool IsGuest { get; set; }
    [Required(ErrorMessage = "Vui lòng chọn ngày mới.")]
    public string TargetDateText { get; set; } = string.Empty;
    [Range(0, 1439)]
    public int TargetStartMinute { get; set; }
    [Range(60, 120)]
    public int DurationMinutes { get; set; }
    public long? ExpectedNewTotalAmount { get; set; }
    public string? PreviewToken { get; set; }
    public BookingDetailDto? Booking { get; set; }
    public ReschedulePreview? Preview { get; set; }
    public string? Message { get; set; }
}

public sealed class GuestOtpFormViewModel
{
    public required string BookingCode { get; init; }
    [Required]
    public string Phone { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
}

public sealed class RecurringCreateViewModel
{
    public Guid SeriesId { get; set; } = Guid.NewGuid();
    [Required]
    public Guid FieldId { get; set; }
    [Required]
    public string FirstDateText { get; set; } = string.Empty;
    [Range(0, 1439)]
    public int StartMinute { get; set; } = 1080;
    [Range(60, 120)]
    public int DurationMinutes { get; set; } = 60;
    [Range(2, 12)]
    public int Weeks { get; set; } = 4;
    [Range(typeof(bool), "true", "true", ErrorMessage = "Vui lòng xác nhận chính sách giữ chỗ và thanh toán.")]
    public bool AcceptIndependentPayments { get; set; }
    public IReadOnlyList<FootballBooking.Application.Fields.FieldSummaryDto> Fields { get; set; } = [];
}
