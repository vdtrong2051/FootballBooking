namespace FootballBooking.Application.Reports;

public interface IReportService
{
    Task<OwnerDashboardDto> GetOwnerDashboardAsync(CancellationToken cancellationToken);
    Task<OwnerDashboardDto> GetOwnerReportAsync(DateOnly fromDate, DateOnly toDate, CancellationToken cancellationToken);
    Task<StaffDashboardDto> GetStaffDashboardAsync(CancellationToken cancellationToken);
    Task<ChartDataDto> GetRevenueChartAsync(DateOnly fromDate, DateOnly toDate, CancellationToken cancellationToken);
    Task<ChartDataDto> GetRevenueWaterfallChartAsync(DateOnly fromDate, DateOnly toDate, CancellationToken cancellationToken);
    Task<ChartDataDto> GetBookingCountChartAsync(DateOnly fromDate, DateOnly toDate, CancellationToken cancellationToken);
    Task<ChartDataDto> GetUtilizationChartAsync(DateOnly fromDate, DateOnly toDate, CancellationToken cancellationToken);
    Task<byte[]> ExportRevenueCsvAsync(DateOnly fromDate, DateOnly toDate, CancellationToken cancellationToken);
}
