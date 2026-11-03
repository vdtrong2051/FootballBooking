using FootballBooking.Application.Bookings;
using FootballBooking.Application.Fields;
using FootballBooking.Web.ViewModels.Bookings;
using FootballBooking.Web.ViewModels.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FootballBooking.Web.Areas.Admin.Controllers;

[Area("Admin")]
[Route("admin/payments")]
[Authorize(Policy = "CanManagePayments")]
public sealed class PaymentsController(IBookingService bookingService) : Controller
{
    [HttpGet("")]
    public async Task<IActionResult> Index(CancellationToken cancellationToken)
    {
        ViewData["Title"] = "Thanh toán";
        ViewData["Breadcrumbs"] = new List<BreadcrumbItemViewModel>
        {
            new("Quản trị", "/admin/dashboard"),
            new("Thanh toán")
        };

        return View(new PaymentListViewModel
        {
            Bookings = await bookingService.ListAdminBookingsAsync(null, null, null, cancellationToken)
        });
    }
}
