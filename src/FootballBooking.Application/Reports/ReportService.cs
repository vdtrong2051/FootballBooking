using System.Globalization;
using System.Text;
using FootballBooking.Application.Bookings;
using FootballBooking.Application.Common.Time;
using FootballBooking.Domain.Bookings;

namespace FootballBooking.Application.Reports;

public sealed class ReportService(IReportStore store, ISystemClock clock) : IReportService
{
    private static readonly BookingStatus[] ActiveOperationalStatuses =
    [
        BookingStatus.PendingPayment,
        BookingStatus.Confirmed,
        BookingStatus.CheckedIn,
        BookingStatus.InProgress,
        BookingStatus.Completed
    ];

    public async Task<OwnerDashboardDto> GetOwnerDashboardAsync(CancellationToken cancellationToken)
    {
        var today = GetBusinessToday();
        var range = new ReportDateRange(new DateOnly(today.Year, today.Month, 1), today);
        return await BuildOwnerReportAsync(range, cancellationToken);
    }

    public async Task<OwnerDashboardDto> GetOwnerReportAsync(DateOnly fromDate, DateOnly toDate, CancellationToken cancellationToken)
    {
        var range = NormalizeRange(fromDate, toDate);
        return await BuildOwnerReportAsync(range, cancellationToken);
    }

    private async Task<OwnerDashboardDto> BuildOwnerReportAsync(ReportDateRange range, CancellationToken cancellationToken)
    {
        var today = GetBusinessToday();
        var monthBookings = await store.ListBookingsAsync(range.FromDate, range.EndExclusive, cancellationToken);
        var fields = await store.ListFieldCapacitiesAsync(cancellationToken);
        var todayBookings = monthBookings.Where(booking => booking.BookingDate == today).ToArray();
        var activeMonthBookings = monthBookings.Where(IsOperationalHistory).ToArray();
        var completedAndActiveToday = todayBookings.Where(IsOperationalHistory).ToArray();

        var todayRevenue = completedAndActiveToday.Sum(NetPaid);
        var monthRevenue = activeMonthBookings.Sum(NetPaid);
        var outstandingAmount = activeMonthBookings.Sum(RemainingAmount);
        var cancelledCount = monthBookings.Count(booking => booking.Status == BookingStatus.Cancelled);
        var noShowCount = monthBookings.Count(booking => booking.Status == BookingStatus.NoShow);
        var totalCount = Math.Max(1, monthBookings.Count);
        var utilization = CalculateUtilization(activeMonthBookings, fields, range);
        var averageUtilization = utilization.Count == 0 ? 0 : utilization.Average(item => item.UtilizationPercent);

        var metrics = new[]
        {
            new SummaryMetricDto("Doanh thu hôm nay", FormatMoney(todayRevenue), $"{completedAndActiveToday.Length} lượt đã ghi nhận", "success"),
            new SummaryMetricDto("Doanh thu tháng", FormatMoney(monthRevenue), $"Từ {FormatDate(range.FromDate)} đến {FormatDate(range.ToDate)}", "info"),
            new SummaryMetricDto("Lượt đặt hôm nay", todayBookings.Length.ToString(CultureInfo.InvariantCulture), $"{todayBookings.Count(booking => booking.Status == BookingStatus.PendingPayment)} lượt chờ thanh toán", "active"),
            new SummaryMetricDto("Tiền còn thu", FormatMoney(outstandingAmount), $"{activeMonthBookings.Count(booking => RemainingAmount(booking) > 0)} lượt còn công nợ", "warning"),
            new SummaryMetricDto("Tỷ lệ lấp đầy", $"{averageUtilization:0.#}%", "Tính theo giờ mở cửa đã cấu hình", "info"),
            new SummaryMetricDto("Hủy và không đến", $"{(cancelledCount + noShowCount) * 100m / totalCount:0.#}%", $"{cancelledCount} hủy, {noShowCount} không đến", "danger")
        };

        return new OwnerDashboardDto(
            range,
            metrics,
            BuildDailyPoints(monthBookings, range),
            utilization,
            BuildPeakHours(activeMonthBookings),
            activeMonthBookings
                .Where(booking => booking.BookingDate >= today)
                .OrderBy(booking => booking.BookingDate)
                .ThenBy(booking => booking.StartMinute)
                .Take(6)
                .ToArray(),
            activeMonthBookings
                .Where(booking => RemainingAmount(booking) > 0)
                .OrderByDescending(RemainingAmount)
                .Take(6)
                .ToArray());
    }

    public async Task<StaffDashboardDto> GetStaffDashboardAsync(CancellationToken cancellationToken)
    {
        var today = GetBusinessToday();
        var tomorrow = today.AddDays(1);
        var todayBookings = await store.ListBookingsAsync(today, tomorrow, cancellationToken);
        var blocks = await store.ListFieldBlocksAsync(today, tomorrow, cancellationToken);
        var currentMinute = GetBusinessCurrentMinute();
        var operationalBookings = todayBookings.Where(IsOperationalHistory).ToArray();
        var upcoming = operationalBookings
            .Where(booking => booking.StartMinute >= currentMinute && booking.Status is BookingStatus.Confirmed or BookingStatus.CheckedIn)
            .OrderBy(booking => booking.StartMinute)
            .Take(6)
            .ToArray();
        var pending = todayBookings
            .Where(booking => booking.Status is BookingStatus.PendingPayment or BookingStatus.Confirmed)
            .OrderBy(booking => booking.StartMinute)
            .Take(6)
            .ToArray();
        var paymentsDue = operationalBookings
            .Where(booking => RemainingAmount(booking) > 0)
            .OrderBy(booking => booking.StartMinute)
            .Take(6)
            .ToArray();

        var metrics = new[]
        {
            new SummaryMetricDto("Lịch hôm nay", operationalBookings.Length.ToString(CultureInfo.InvariantCulture), $"{upcoming.Length} lượt sắp bắt đầu", "info"),
            new SummaryMetricDto("Đang sử dụng", operationalBookings.Count(booking => booking.Status == BookingStatus.InProgress).ToString(CultureInfo.InvariantCulture), "Theo trạng thái vận hành", "active"),
            new SummaryMetricDto("Chờ xử lý", pending.Length.ToString(CultureInfo.InvariantCulture), "Chờ thanh toán hoặc xác nhận", "warning"),
            new SummaryMetricDto("Khách còn nợ", paymentsDue.Length.ToString(CultureInfo.InvariantCulture), "Cần nhắc khi khách đến sân", "danger")
        };

        return new StaffDashboardDto(
            today,
            metrics,
            operationalBookings.OrderBy(booking => booking.StartMinute).ToArray(),
            upcoming,
            pending,
            paymentsDue,
            BuildServicePreparation(operationalBookings),
            blocks);
    }

    public async Task<ChartDataDto> GetRevenueChartAsync(DateOnly fromDate, DateOnly toDate, CancellationToken cancellationToken)
    {
        var range = NormalizeRange(fromDate, toDate);
        var bookings = await store.ListBookingsAsync(range.FromDate, range.EndExclusive, cancellationToken);
        var points = BuildDailyPoints(bookings, range);

        var filteredPoints = points.Count > 14 && points.Any(point => point.RevenueAmount != 0)
            ? points.Where(point => point.RevenueAmount != 0).ToArray()
            : points.ToArray();

        var steps = new List<WaterfallStepDto>();
        long runningTotal = 0;
        foreach (var point in filteredPoints)
        {
            var start = runningTotal;
            runningTotal += point.RevenueAmount;
            steps.Add(new WaterfallStepDto(
                FormatDate(point.Date),
                point.RevenueAmount,
                start,
                runningTotal,
                point.RevenueAmount >= 0 ? "success" : "danger",
                IsTotal: false));
        }

        steps.Add(new WaterfallStepDto(
            "Tổng thực thu",
            runningTotal,
            0,
            runningTotal,
            "info",
            IsTotal: true));

        return new ChartDataDto(
            steps.Select(step => step.Label).ToArray(),
            [
                new ChartDatasetDto(
                    "Doanh thu thác nước",
                    "waterfall",
                    steps.Select(step => step.Delta).ToArray(),
                    "success",
                    steps)
            ]);
    }

    public async Task<ChartDataDto> GetRevenueWaterfallChartAsync(DateOnly fromDate, DateOnly toDate, CancellationToken cancellationToken)
    {
        var range = NormalizeRange(fromDate, toDate);
        var bookings = await store.ListBookingsAsync(range.FromDate, range.EndExclusive, cancellationToken);
        var activeBookings = bookings.Where(IsOperationalHistory).ToArray();
        var cancelledWithFee = bookings.Where(booking => booking.Status == BookingStatus.Cancelled && booking.CancellationFeeAmount > 0).ToArray();

        var courtTotal = activeBookings.Sum(booking => booking.CourtAmount);
        var serviceTotal = activeBookings.Sum(booking => booking.ServiceAmount);
        var discountTotal = activeBookings.Sum(booking => booking.DiscountAmount);
        var cancellationFeeTotal = activeBookings.Sum(booking => booking.CancellationFeeAmount) + cancelledWithFee.Sum(booking => booking.CancellationFeeAmount);
        var refundedTotal = activeBookings.Sum(booking => booking.RefundedAmount);
        var netPaidTotal = activeBookings.Sum(NetPaid) + cancelledWithFee.Sum(NetPaid);
        var uncollectedTotal = Math.Max(0, courtTotal + serviceTotal - discountTotal + cancellationFeeTotal - refundedTotal - netPaidTotal);

        var rawDeltas = new (string Label, long Delta, string Tone)[]
        {
            ("Tiền sân", courtTotal, "success"),
            ("Dịch vụ", serviceTotal, "info"),
            ("Khuyến mãi", -discountTotal, "warning"),
            ("Phí hủy", cancellationFeeTotal, "active"),
            ("Hoàn trả", -refundedTotal, "danger"),
            ("Còn phải thu", -uncollectedTotal, "warning")
        };

        var steps = new List<WaterfallStepDto>();
        long running = 0;
        foreach (var item in rawDeltas)
        {
            var start = running;
            running += item.Delta;
            steps.Add(new WaterfallStepDto(item.Label, item.Delta, start, running, item.Tone, IsTotal: false));
        }

        steps.Add(new WaterfallStepDto("Thực thu ròng", netPaidTotal, 0, netPaidTotal, "info", IsTotal: true));

        return new ChartDataDto(
            steps.Select(step => step.Label).ToArray(),
            [
                new ChartDatasetDto(
                    "Cơ cấu doanh thu (Thác nước)",
                    "waterfall",
                    steps.Select(step => step.Delta).ToArray(),
                    "info",
                    steps)
            ]);
    }

    public async Task<ChartDataDto> GetBookingCountChartAsync(DateOnly fromDate, DateOnly toDate, CancellationToken cancellationToken)
    {
        var range = NormalizeRange(fromDate, toDate);
        var bookings = await store.ListBookingsAsync(range.FromDate, range.EndExclusive, cancellationToken);
        var points = BuildDailyPoints(bookings, range);
        return new ChartDataDto(
            points.Select(point => FormatDate(point.Date)).ToArray(),
            [new ChartDatasetDto("Lượt đặt sân", "bar", points.Select(point => (long)point.BookingCount).ToArray(), "info")]);
    }

    public async Task<ChartDataDto> GetUtilizationChartAsync(DateOnly fromDate, DateOnly toDate, CancellationToken cancellationToken)
    {
        var range = NormalizeRange(fromDate, toDate);
        var bookings = await store.ListBookingsAsync(range.FromDate, range.EndExclusive, cancellationToken);
        var fields = await store.ListFieldCapacitiesAsync(cancellationToken);
        var utilization = CalculateUtilization(bookings.Where(IsOperationalHistory), fields, range);

        return new ChartDataDto(
            utilization.Select(item => item.FieldName).ToArray(),
            [new ChartDatasetDto("Tỷ lệ lấp đầy", "bar", utilization.Select(item => (long)Math.Round(item.UtilizationPercent)).ToArray(), "active")]);
    }

    public async Task<byte[]> ExportRevenueCsvAsync(DateOnly fromDate, DateOnly toDate, CancellationToken cancellationToken)
    {
        var range = NormalizeRange(fromDate, toDate);
        var bookings = await store.ListBookingsAsync(range.FromDate, range.EndExclusive, cancellationToken);
        var builder = new StringBuilder();
        builder.AppendLine("Ngày,Mã đặt sân,Sân,Khách,Trạng thái,Thanh toán,Tiền sân,Dịch vụ,Khuyến mãi,Tổng tiền,Đã thu,Hoàn trả,Còn thu");
        foreach (var booking in bookings.OrderBy(booking => booking.BookingDate).ThenBy(booking => booking.StartMinute))
        {
            builder.AppendLine(string.Join(',', [
                EscapeCsv(FormatDate(booking.BookingDate)),
                EscapeCsv(booking.BookingCode),
                EscapeCsv(booking.FieldName),
                EscapeCsv(booking.CustomerName),
                EscapeCsv(BookingLabels.Status(booking.Status)),
                EscapeCsv(BookingLabels.PaymentStatus(booking.PaymentStatus)),
                booking.CourtAmount.ToString(CultureInfo.InvariantCulture),
                booking.ServiceAmount.ToString(CultureInfo.InvariantCulture),
                booking.DiscountAmount.ToString(CultureInfo.InvariantCulture),
                booking.TotalAmount.ToString(CultureInfo.InvariantCulture),
                booking.PaidAmount.ToString(CultureInfo.InvariantCulture),
                booking.RefundedAmount.ToString(CultureInfo.InvariantCulture),
                RemainingAmount(booking).ToString(CultureInfo.InvariantCulture)
            ]));
        }

        return Encoding.UTF8.GetPreamble().Concat(Encoding.UTF8.GetBytes(builder.ToString())).ToArray();
    }

    private DateOnly GetBusinessToday()
    {
        var timeZone = ResolveBusinessTimeZone();
        return DateOnly.FromDateTime(TimeZoneInfo.ConvertTime(clock.UtcNow, timeZone).Date);
    }

    private int GetBusinessCurrentMinute()
    {
        var timeZone = ResolveBusinessTimeZone();
        var local = TimeZoneInfo.ConvertTime(clock.UtcNow, timeZone);
        return local.Hour * 60 + local.Minute;
    }

    private static TimeZoneInfo ResolveBusinessTimeZone()
    {
        try
        {
            return TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh");
        }
        catch (TimeZoneNotFoundException)
        {
            return TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
        }
    }

    private static ReportDateRange NormalizeRange(DateOnly fromDate, DateOnly toDate)
        => fromDate <= toDate ? new ReportDateRange(fromDate, toDate) : new ReportDateRange(toDate, fromDate);

    private static IReadOnlyList<DailyReportPointDto> BuildDailyPoints(IEnumerable<ReportBookingRecordDto> bookings, ReportDateRange range)
    {
        var byDate = bookings
            .Where(IsOperationalHistory)
            .GroupBy(booking => booking.BookingDate)
            .ToDictionary(group => group.Key, group => new { Revenue = group.Sum(NetPaid), Count = group.Count() });
        var points = new List<DailyReportPointDto>();
        for (var date = range.FromDate; date <= range.ToDate; date = date.AddDays(1))
        {
            byDate.TryGetValue(date, out var value);
            points.Add(new DailyReportPointDto(date, value?.Revenue ?? 0, value?.Count ?? 0));
        }

        return points;
    }

    private static IReadOnlyList<FieldUtilizationDto> CalculateUtilization(
        IEnumerable<ReportBookingRecordDto> bookings,
        IReadOnlyList<ReportFieldCapacityDto> fieldCapacities,
        ReportDateRange range)
    {
        var usedByField = bookings
            .GroupBy(booking => booking.FieldName)
            .ToDictionary(group => group.Key, group => group.Sum(booking => booking.EndMinute - booking.StartMinute));
        var fields = fieldCapacities.GroupBy(field => field.FieldName);
        var result = new List<FieldUtilizationDto>();
        foreach (var field in fields)
        {
            var available = 0;
            for (var date = range.FromDate; date <= range.ToDate; date = date.AddDays(1))
            {
                var day = field.FirstOrDefault(item => item.DayOfWeek == (int)date.DayOfWeek);
                if (day is { IsClosed: false, OpenMinute: not null, CloseMinute: not null })
                {
                    available += Math.Max(0, day.CloseMinute.Value - day.OpenMinute.Value);
                }
            }

            usedByField.TryGetValue(field.Key, out var used);
            var percent = available == 0 ? 0 : Math.Round(used * 100m / available, 1);
            result.Add(new FieldUtilizationDto(field.Key, used, available, percent));
        }

        return result.OrderByDescending(item => item.UtilizationPercent).ThenBy(item => item.FieldName).ToArray();
    }

    private static IReadOnlyList<PeakHourDto> BuildPeakHours(IEnumerable<ReportBookingRecordDto> bookings)
        => bookings
            .GroupBy(booking => booking.StartMinute / 60 * 60)
            .Select(group => new PeakHourDto(group.Key, group.Count(), group.Sum(NetPaid)))
            .OrderByDescending(item => item.BookingCount)
            .ThenBy(item => item.StartMinute)
            .Take(6)
            .ToArray();

    private static IReadOnlyList<ServicePreparationDto> BuildServicePreparation(IEnumerable<ReportBookingRecordDto> bookings)
        => bookings
            .SelectMany(booking => booking.ServiceLines)
            .GroupBy(line => new { line.ServiceName, line.UnitName })
            .Select(group => new ServicePreparationDto(group.Key.ServiceName, group.Key.UnitName, group.Sum(line => line.Quantity)))
            .OrderByDescending(item => item.Quantity)
            .ThenBy(item => item.ServiceName)
            .ToArray();

    private static bool IsOperationalHistory(ReportBookingRecordDto booking)
        => ActiveOperationalStatuses.Contains(booking.Status);

    private static long NetPaid(ReportBookingRecordDto booking)
        => Math.Max(0, booking.PaidAmount - booking.RefundedAmount);

    private static long RemainingAmount(ReportBookingRecordDto booking)
        => Math.Max(0, booking.TotalAmount - booking.PaidAmount + booking.RefundedAmount);

    private static string FormatDate(DateOnly date)
        => date.ToString("dd/MM/yyyy", CultureInfo.InvariantCulture);

    private static string FormatMoney(long amount)
        => amount.ToString("N0", CultureInfo.InvariantCulture).Replace(",", ".") + " ₫";

    private static string EscapeCsv(string value)
    {
        if (!value.Contains(',') && !value.Contains('"') && !value.Contains('\n') && !value.Contains('\r'))
        {
            return value;
        }

        return $"\"{value.Replace("\"", "\"\"")}\"";
    }
}
