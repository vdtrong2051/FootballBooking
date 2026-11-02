using FootballBooking.Application.Common.Security;
using FootballBooking.Application.Reports;
using FootballBooking.Web.Areas.Admin.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FootballBooking.Web.Areas.Admin.Controllers;

[Area("Admin")]
[Route("admin/reports")]
[Authorize(Policy = "CanViewReports")]
public sealed class ReportsController(IReportService reportService) : Controller
{
    [HttpGet("")]
    public async Task<IActionResult> Index([FromQuery] string? from, [FromQuery] string? to, CancellationToken cancellationToken)
    {
        var (fromDate, toDate) = ResolveRange(from, to);
        var dashboard = await reportService.GetOwnerReportAsync(fromDate, toDate, cancellationToken);
        var model = new AdminReportsViewModel(
            fromDate,
            toDate,
            dashboard.Metrics,
            dashboard.FieldUtilization,
            dashboard.PeakHours,
            dashboard.PaymentsDue);

        return View(model);
    }

    [HttpGet("revenue.csv")]
    public async Task<IActionResult> RevenueCsv([FromQuery] string? from, [FromQuery] string? to, CancellationToken cancellationToken)
    {
        var (fromDate, toDate) = ResolveRange(from, to);
        var bytes = await reportService.ExportRevenueCsvAsync(fromDate, toDate, cancellationToken);
        var fileName = $"bao-cao-doanh-thu-{fromDate:yyyyMMdd}-{toDate:yyyyMMdd}.csv";
        return File(bytes, "text/csv; charset=utf-8", fileName);
    }

    private static (DateOnly FromDate, DateOnly ToDate) ResolveRange(string? from, string? to)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow.AddHours(7));
        var weekStart = today.AddDays(-6);
        var fromDate = DateOnly.TryParse(from, out var parsedFrom) ? parsedFrom : weekStart;
        var toDate = DateOnly.TryParse(to, out var parsedTo) ? parsedTo : today;
        return fromDate <= toDate ? (fromDate, toDate) : (toDate, fromDate);
    }
}
