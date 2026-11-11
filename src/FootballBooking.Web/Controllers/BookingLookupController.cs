using FootballBooking.Application.Bookings;
using FootballBooking.Web.ViewModels.Bookings;
using Microsoft.AspNetCore.Mvc;

namespace FootballBooking.Web.Controllers;

[Route("booking/lookup")]
[Microsoft.AspNetCore.RateLimiting.EnableRateLimiting("sensitive-booking")]
public sealed class BookingLookupController(IBookingService bookingService) : Controller
{
    [HttpGet("")]
    public IActionResult Index()
        => View(new BookingLookupViewModel());

    [HttpPost("")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Index(BookingLookupViewModel model, CancellationToken cancellationToken)
    {
        model.HasSearched = true;
        if (!ModelState.IsValid)
        {
            return View(model);
        }

        Response.Headers.CacheControl = "no-store";
        model.Result = await bookingService.LookupBookingAsync(new BookingLookupQuery(model.BookingCode, model.CustomerPhone), cancellationToken);
        if (model.Result is null)
        {
            ModelState.AddModelError(string.Empty, "Không tìm thấy booking phù hợp. Vui lòng kiểm tra mã booking và số điện thoại.");
        }

        return View(model);
    }
}
