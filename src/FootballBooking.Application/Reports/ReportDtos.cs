using FootballBooking.Domain.Bookings;

namespace FootballBooking.Application.Reports;

public sealed record ReportDateRange(DateOnly FromDate, DateOnly ToDate)
{
    public DateOnly EndExclusive => ToDate.AddDays(1);
}

public sealed record ReportBookingRecordDto(
    Guid Id,
    string BookingCode,
    string FieldName,
    DateOnly BookingDate,
    int StartMinute,
    int EndMinute,
    string CustomerName,
    BookingStatus Status,
    PaymentStatus PaymentStatus,
    long CourtAmount,
    long ServiceAmount,
    long DiscountAmount,
    long CancellationFeeAmount,
    long TotalAmount,
    long PaidAmount,
    long RefundedAmount,
    IReadOnlyList<ReportServiceLineDto> ServiceLines);

public sealed record ReportServiceLineDto(string ServiceName, string UnitName, int Quantity);

public sealed record ReportFieldCapacityDto(string FieldName, int DayOfWeek, bool IsClosed, int? OpenMinute, int? CloseMinute);

public sealed record ReportFieldBlockDto(string FieldName, DateOnly BlockDate, int StartMinute, int EndMinute, string Reason);

public sealed record SummaryMetricDto(string Label, string Value, string Note, string Tone);

public sealed record DailyReportPointDto(DateOnly Date, long RevenueAmount, int BookingCount);

public sealed record FieldUtilizationDto(string FieldName, int UsedMinutes, int AvailableMinutes, decimal UtilizationPercent);

public sealed record PeakHourDto(int StartMinute, int BookingCount, long RevenueAmount);

public sealed record ServicePreparationDto(string ServiceName, string UnitName, int Quantity);

public sealed record OwnerDashboardDto(
    ReportDateRange Range,
    IReadOnlyList<SummaryMetricDto> Metrics,
    IReadOnlyList<DailyReportPointDto> DailyPoints,
    IReadOnlyList<FieldUtilizationDto> FieldUtilization,
    IReadOnlyList<PeakHourDto> PeakHours,
    IReadOnlyList<ReportBookingRecordDto> UpcomingBookings,
    IReadOnlyList<ReportBookingRecordDto> PaymentsDue);

public sealed record StaffDashboardDto(
    DateOnly Today,
    IReadOnlyList<SummaryMetricDto> Metrics,
    IReadOnlyList<ReportBookingRecordDto> TodaySchedule,
    IReadOnlyList<ReportBookingRecordDto> UpcomingBookings,
    IReadOnlyList<ReportBookingRecordDto> PendingBookings,
    IReadOnlyList<ReportBookingRecordDto> PaymentsDue,
    IReadOnlyList<ServicePreparationDto> ServicePreparation,
    IReadOnlyList<ReportFieldBlockDto> FieldBlocks);

public sealed record WaterfallStepDto(
    string Label,
    long Delta,
    long Start,
    long End,
    string Tone,
    bool IsTotal = false);

public sealed record ChartDatasetDto(
    string Label,
    string Type,
    IReadOnlyList<long> Data,
    string Tone,
    IReadOnlyList<WaterfallStepDto>? WaterfallSteps = null);

public sealed record ChartDataDto(IReadOnlyList<string> Labels, IReadOnlyList<ChartDatasetDto> Datasets);
