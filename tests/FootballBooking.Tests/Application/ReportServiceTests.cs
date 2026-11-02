using System.Text;
using FootballBooking.Application.Common.Time;
using FootballBooking.Application.Reports;
using FootballBooking.Domain.Bookings;

namespace FootballBooking.Tests.Application;

public sealed class ReportServiceTests
{
    [Fact]
    public async Task GetOwnerDashboardAsync_WhenBookingsHaveMixedStatuses_ExcludesCancelledAndNoShowFromRevenue()
    {
        var store = new InMemoryReportStore();
        store.Bookings.Add(CreateBooking("FB-1", BookingStatus.Completed, 500000, 400000, 0));
        store.Bookings.Add(CreateBooking("FB-2", BookingStatus.Cancelled, 300000, 300000, 0));
        store.Bookings.Add(CreateBooking("FB-3", BookingStatus.NoShow, 250000, 250000, 0));
        var service = new ReportService(store, new FixedClock());

        var dashboard = await service.GetOwnerDashboardAsync(CancellationToken.None);

        Assert.Contains(dashboard.Metrics, metric => metric.Label == "Doanh thu tháng" && metric.Value == "400.000 ₫");
        Assert.Contains(dashboard.Metrics, metric => metric.Label == "Hủy và không đến" && metric.Value is "66,7%" or "66.7%");
    }

    [Fact]
    public async Task GetRevenueChartAsync_ReturnsWaterfallStepsWithRunningTotalsAndFinalSummary()
    {
        var store = new InMemoryReportStore();
        store.Bookings.Add(CreateBooking("FB-1", BookingStatus.Completed, 500000, 400000, 0));
        var service = new ReportService(store, new FixedClock());

        var chart = await service.GetRevenueChartAsync(new DateOnly(2026, 7, 25), new DateOnly(2026, 7, 26), CancellationToken.None);

        var dataset = Assert.Single(chart.Datasets);
        Assert.Equal("waterfall", dataset.Type);
        Assert.NotNull(dataset.WaterfallSteps);
        var finalStep = dataset.WaterfallSteps!.Last();
        Assert.True(finalStep.IsTotal);
        Assert.Equal("Tổng thực thu", finalStep.Label);
        Assert.Equal(400000, finalStep.End);
    }

    [Fact]
    public async Task GetRevenueWaterfallChartAsync_ReturnsFinancialBridgeSteps()
    {
        var store = new InMemoryReportStore();
        store.Bookings.Add(new ReportBookingRecordDto(
            Guid.NewGuid(),
            "FB-1",
            "Sân 5A",
            new DateOnly(2026, 7, 26),
            1080,
            1140,
            "Nguyễn Minh Tuấn",
            BookingStatus.Completed,
            PaymentStatus.PartiallyPaid,
            CourtAmount: 300000,
            ServiceAmount: 100000,
            DiscountAmount: 50000,
            CancellationFeeAmount: 0,
            TotalAmount: 350000,
            PaidAmount: 300000,
            RefundedAmount: 20000,
            ServiceLines: []));
        var service = new ReportService(store, new FixedClock());

        var chart = await service.GetRevenueWaterfallChartAsync(new DateOnly(2026, 7, 1), new DateOnly(2026, 7, 31), CancellationToken.None);

        var dataset = Assert.Single(chart.Datasets);
        Assert.Equal("waterfall", dataset.Type);
        Assert.NotNull(dataset.WaterfallSteps);
        Assert.Contains(dataset.WaterfallSteps!, step => step.Label == "Tiền sân" && step.Delta == 300000);
        Assert.Contains(dataset.WaterfallSteps!, step => step.Label == "Dịch vụ" && step.Delta == 100000);
        Assert.Contains(dataset.WaterfallSteps!, step => step.Label == "Khuyến mãi" && step.Delta == -50000);
        Assert.Contains(dataset.WaterfallSteps!, step => step.Label == "Hoàn trả" && step.Delta == -20000);
        var penultimateStep = dataset.WaterfallSteps![^2];
        var finalStep = dataset.WaterfallSteps!.Last();
        Assert.True(finalStep.IsTotal);
        Assert.Equal("Thực thu ròng", finalStep.Label);
        Assert.Equal(280000, penultimateStep.End);
        Assert.Equal(280000, finalStep.End);
    }

    [Fact]
    public async Task GetStaffDashboardAsync_WhenTodayHasServiceLines_ReturnsPreparationSummary()
    {
        var store = new InMemoryReportStore();
        store.Bookings.Add(CreateBooking("FB-1", BookingStatus.Confirmed, 500000, 100000, 0, [new("Nước suối", "chai", 12)]));
        store.Bookings.Add(CreateBooking("FB-2", BookingStatus.CheckedIn, 400000, 0, 0, [new("Nước suối", "chai", 8)]));
        var service = new ReportService(store, new FixedClock());

        var dashboard = await service.GetStaffDashboardAsync(CancellationToken.None);

        var serviceLine = Assert.Single(dashboard.ServicePreparation);
        Assert.Equal("Nước suối", serviceLine.ServiceName);
        Assert.Equal(20, serviceLine.Quantity);
    }

    [Fact]
    public async Task ExportRevenueCsvAsync_WhenRequested_UsesUtf8BomAndVietnameseHeaders()
    {
        var store = new InMemoryReportStore();
        store.Bookings.Add(CreateBooking("FB-1", BookingStatus.Completed, 500000, 400000, 0));
        var service = new ReportService(store, new FixedClock());

        var bytes = await service.ExportRevenueCsvAsync(new DateOnly(2026, 7, 1), new DateOnly(2026, 7, 31), CancellationToken.None);
        var content = Encoding.UTF8.GetString(bytes);

        Assert.StartsWith(Encoding.UTF8.GetString(Encoding.UTF8.GetPreamble()), content);
        Assert.Contains("Mã đặt sân", content);
        Assert.Contains("Đã hoàn thành", content);
        Assert.DoesNotContain("Completed", content);
    }

    private static ReportBookingRecordDto CreateBooking(
        string code,
        BookingStatus status,
        long totalAmount,
        long paidAmount,
        long refundedAmount,
        IReadOnlyList<ReportServiceLineDto>? serviceLines = null)
        => new(
            Guid.NewGuid(),
            code,
            "Sân 5A",
            new DateOnly(2026, 7, 26),
            1080,
            1140,
            "Nguyễn Minh Tuấn",
            status,
            PaymentStatus.PartiallyPaid,
            totalAmount,
            serviceLines?.Count > 0 ? 50000 : 0,
            0,
            0,
            totalAmount,
            paidAmount,
            refundedAmount,
            serviceLines ?? []);

    private sealed class InMemoryReportStore : IReportStore
    {
        public List<ReportBookingRecordDto> Bookings { get; } = [];

        public Task<IReadOnlyList<ReportBookingRecordDto>> ListBookingsAsync(DateOnly fromDate, DateOnly endExclusive, CancellationToken cancellationToken)
            => Task.FromResult<IReadOnlyList<ReportBookingRecordDto>>(Bookings
                .Where(booking => booking.BookingDate >= fromDate && booking.BookingDate < endExclusive)
                .ToArray());

        public Task<IReadOnlyList<ReportFieldCapacityDto>> ListFieldCapacitiesAsync(CancellationToken cancellationToken)
            => Task.FromResult<IReadOnlyList<ReportFieldCapacityDto>>([
                new("Sân 5A", 0, false, 360, 1380),
                new("Sân 5A", 1, false, 360, 1380),
                new("Sân 5A", 2, false, 360, 1380),
                new("Sân 5A", 3, false, 360, 1380),
                new("Sân 5A", 4, false, 360, 1380),
                new("Sân 5A", 5, false, 360, 1380),
                new("Sân 5A", 6, false, 360, 1380)
            ]);

        public Task<IReadOnlyList<ReportFieldBlockDto>> ListFieldBlocksAsync(DateOnly fromDate, DateOnly endExclusive, CancellationToken cancellationToken)
            => Task.FromResult<IReadOnlyList<ReportFieldBlockDto>>([]);
    }

    private sealed class FixedClock : ISystemClock
    {
        public DateTimeOffset UtcNow => new(2026, 7, 26, 4, 0, 0, TimeSpan.Zero);
    }
}
