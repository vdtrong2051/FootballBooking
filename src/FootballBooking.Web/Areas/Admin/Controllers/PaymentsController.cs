using System.Security.Claims;
using FootballBooking.Application.Bookings;
using FootballBooking.Application.Payments;
using FootballBooking.Application.Fields;
using FootballBooking.Web.ViewModels.Bookings;
using FootballBooking.Web.ViewModels.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FootballBooking.Web.Areas.Admin.Controllers;

[Area("Admin")]
[Route("admin/payments")]
[Authorize(Policy = "CanManagePayments")]
public sealed class PaymentsController(IBookingService bookingService, IPaymentAttemptService paymentAttempts) : Controller
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

        ViewData["GD2Attempts"] = await paymentAttempts.ListRecentAsync(100, cancellationToken);
        return View(new PaymentListViewModel
        {
            Bookings = await bookingService.ListAdminBookingsAsync(null, null, null, cancellationToken)
        });
    }

    [HttpPost("attempts/{id:guid}/confirm")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Confirm(Guid id, string externalReference, long receivedAmount, CancellationToken cancellationToken)
    {
        // Operator must FIRST verify transfer/receipt outside the website.
        var actor = Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var parsedId)
            ? parsedId : (Guid?)null;
        var result = await paymentAttempts.ConfirmAsync(id, externalReference, receivedAmount, actor, cancellationToken);
        TempData[result.Succeeded ? "SuccessMessage" : "ErrorMessage"] = result.Succeeded
            ? result.Attempt?.Status == FootballBooking.Domain.Payments.PaymentAttemptStatus.NeedsReconciliation
                ? "Cần đối soát/hoàn tiền thủ công; booking KHÔNG được xác nhận."
                : "Đã xác minh và ghi nhận thanh toán vào booking."
            : result.Error;
        return RedirectToAction(nameof(Index));
    }
}
