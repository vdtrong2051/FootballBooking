using System.Security.Claims;
using FootballBooking.Application.Bookings;
using FootballBooking.Application.Payments;
using FootballBooking.Domain.Bookings;
using FootballBooking.Domain.Payments;
using FootballBooking.Infrastructure.Payments;
using FootballBooking.Web.ViewModels.Payments;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace FootballBooking.Web.Controllers;

[Route("booking/pay")]
public sealed class CheckoutController(
    IBookingService bookings,
    IPaymentAttemptService attempts,
    IOptions<PaymentOptions> options,
    IWebHostEnvironment environment) : Controller
{
    [HttpGet("{code}")]
    public async Task<IActionResult> Index(string code, CancellationToken ct)
    {
        var booking = await AllowedBookingAsync(code, ct);
        if (booking is null) return RedirectToAction("Index", "BookingLookup");
        Response.Headers.CacheControl = "no-store";
        var history = await attempts.ListForBookingAsync(booking.Id, ct);
        var config = options.Value;
        var latest = history.FirstOrDefault(x => x.Status == PaymentAttemptStatus.Pending
            && x.ExpiresAtUtc > DateTimeOffset.UtcNow);
        string? qr = null;
        if (latest is not null && latest.Method == PaymentMethod.VietQr)
        {
            // Purely construct a VietQR Quick Link; do not imply money has arrived.
            qr = VietQrInstructions.BuildImageUrl(config,
                new PaymentAttempt(latest.Id, latest.BookingId, latest.Method,
                    latest.Amount, latest.RequestCode, latest.ExpiresAtUtc, latest.CreatedAtUtc));
        }
        return View(new CheckoutPageViewModel
        {
            Booking = booking,
            Attempts = history,
            VietQrImageUrl = qr,
            BankConfigured = config.HasBankAccount,
            BankAccountName = config.HasBankAccount ? config.AccountName : null,
            BankAccountNumber = config.HasBankAccount ? config.AccountNumber : null,
            EnableDemoGateway = environment.IsDevelopment() && config.EnableDemoGateway
        });
    }

    [HttpPost("{code}/start")]
    [ValidateAntiForgeryToken]
    [Microsoft.AspNetCore.RateLimiting.EnableRateLimiting("sensitive-booking")]
    public async Task<IActionResult> Start(string code, PaymentMethod method, CancellationToken ct)
    {
        var booking = await AllowedBookingAsync(code, ct);
        if (booking is null) return NotFound();
        var result = await attempts.StartAsync(booking.Id, method, ct);
        TempData[result.Succeeded ? "SuccessMessage" : "ErrorMessage"] = result.Succeeded
            ? "Đã tạo hướng dẫn thanh toán. Chưa ghi nhận tiền."
            : result.Error;
        return RedirectToAction(nameof(Index), new { code });
    }

    [HttpGet("{code}/status")]
    public async Task<IActionResult> Status(string code, CancellationToken ct)
    {
        var booking = await AllowedBookingAsync(code, ct);
        if (booking is null) return NotFound();
        Response.Headers.CacheControl = "no-store";
        var history = await attempts.ListForBookingAsync(booking.Id, ct);
        var current = history.FirstOrDefault();
        return Json(new
        {
            bookingStatus = booking.Status.ToString(),
            paymentStatus = booking.PaymentStatus.ToString(),
            attemptStatus = current?.Status.ToString(),
            expiresAtUtc = current?.ExpiresAtUtc,
            serverTimeUtc = DateTimeOffset.UtcNow
        });
    }

    private async Task<BookingDetailDto?> AllowedBookingAsync(string code, CancellationToken ct)
    {
        var booking = await bookings.GetBookingByCodeAsync(code, ct);
        if (booking is null) return null;
        var hasAccountAccess = User.Identity?.IsAuthenticated == true
            && Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId)
            && booking.CustomerUserId == userId;
        var sameBrowser = string.Equals(TempData.Peek("NewBookingCode") as string,
            booking.BookingCode, StringComparison.Ordinal);
        return hasAccountAccess || sameBrowser ? booking : null;
    }
}
