using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using FootballBooking.Web.Models;
using FootballBooking.Application.Bookings;
using FootballBooking.Application.Fields;
using FootballBooking.Web.ViewModels.Home;
using System.Globalization;

namespace FootballBooking.Web.Controllers;

public class HomeController(IFieldService fieldService, IBookingService bookingService) : Controller
{
    public async Task<IActionResult> Index(CancellationToken cancellationToken)
    {
        var fields = await fieldService.ListPublicFieldsAsync(cancellationToken);
        var services = await bookingService.ListActiveServicesAsync(cancellationToken);
        var promotions = await bookingService.ListActivePromotionsAsync(cancellationToken);
        var date = DateOnly.FromDateTime(DateTimeOffset.UtcNow.ToOffset(TimeSpan.FromHours(7)).AddDays(1).DateTime)
            .ToString("dd/MM/yyyy", CultureInfo.InvariantCulture);
        return View(new HomeIndexViewModel(fields, services, promotions, date));
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [HttpGet("/contact")]
    public IActionResult Contact()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
