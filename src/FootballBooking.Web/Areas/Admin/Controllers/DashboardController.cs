using FootballBooking.Application.Common.Security;
using FootballBooking.Application.Reports;
using FootballBooking.Web.Areas.Admin.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FootballBooking.Web.Areas.Admin.Controllers;

[Area("Admin")]
[Route("admin/dashboard")]
[Authorize(Policy = "InternalUser")]
public sealed class DashboardController(IReportService reportService) : Controller
{
    [HttpGet("")]
    public async Task<IActionResult> Index(CancellationToken cancellationToken)
    {
        var isOwner = User.IsInRole(ApplicationRoles.Owner);
        var model = isOwner
            ? new AdminDashboardViewModel(true, await reportService.GetOwnerDashboardAsync(cancellationToken), null)
            : new AdminDashboardViewModel(false, null, await reportService.GetStaffDashboardAsync(cancellationToken));

        return View(model);
    }

    [HttpGet("/admin/api/dashboard/revenue")]
    [Authorize(Policy = "OwnerOnly")]
    public async Task<IActionResult> Revenue([FromQuery] string? from, [FromQuery] string? to, CancellationToken cancellationToken)
    {
        var (fromDate, toDate) = ResolveRange(from, to);
        return Json(await reportService.GetRevenueChartAsync(fromDate, toDate, cancellationToken));
    }

    [HttpGet("/admin/api/dashboard/revenue-waterfall")]
    [Authorize(Policy = "OwnerOnly")]
    public async Task<IActionResult> RevenueWaterfall([FromQuery] string? from, [FromQuery] string? to, CancellationToken cancellationToken)
    {
        var (fromDate, toDate) = ResolveRange(from, to);
        return Json(await reportService.GetRevenueWaterfallChartAsync(fromDate, toDate, cancellationToken));
    }

    [HttpGet("/admin/api/dashboard/bookings")]
    public async Task<IActionResult> Bookings([FromQuery] string? from, [FromQuery] string? to, CancellationToken cancellationToken)
    {
        var (fromDate, toDate) = ResolveRange(from, to);
        return Json(await reportService.GetBookingCountChartAsync(fromDate, toDate, cancellationToken));
    }

    [HttpGet("/admin/api/dashboard/utilization")]
    [Authorize(Policy = "OwnerOnly")]
    public async Task<IActionResult> Utilization([FromQuery] string? from, [FromQuery] string? to, CancellationToken cancellationToken)
    {
        var (fromDate, toDate) = ResolveRange(from, to);
        return Json(await reportService.GetUtilizationChartAsync(fromDate, toDate, cancellationToken));
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
