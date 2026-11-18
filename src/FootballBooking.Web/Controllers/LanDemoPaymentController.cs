using System.Net;
using FootballBooking.Application.Payments;
using FootballBooking.Domain.Payments;
using FootballBooking.Infrastructure.Payments;
using FootballBooking.Web.Payments;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace FootballBooking.Web.Controllers;

/// <summary>Fake checkout for LAN testing only. This is NOT a real bank webhook.</summary>
[Route("dev/lan-pay")]
[ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
public sealed class LanDemoPaymentController(
    IPaymentAttemptService attempts,
    IDataProtectionProvider dataProtection,
    IOptions<PaymentOptions> options,
    IWebHostEnvironment environment) : Controller
{
    public sealed record PageModel(Guid AttemptId, string BookingCode, long Amount,
        string RequestCode, string Token);

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Index(Guid id, [FromQuery] string? token, CancellationToken ct)
    {
        if (!IsAllowed()) return NotFound();
        NoLeakHeaders();
        var attempt = await GetValidAttemptAsync(id, token, ct);
        if (attempt is null) return BadRequest("Mã demo đã hết hạn hoặc không hợp lệ. Hãy tải lại QR trên máy tính.");
        if (attempt.Status != PaymentAttemptStatus.Pending || attempt.ExpiresAtUtc <= DateTimeOffset.UtcNow)
            return BadRequest("Lần thử thanh toán không còn chờ xác nhận.");

        return View(new PageModel(attempt.Id, attempt.BookingCode, attempt.Amount,
            attempt.RequestCode, token!));
    }

    [HttpPost("{id:guid}")]
    [ValidateAntiForgeryToken]
    [Microsoft.AspNetCore.RateLimiting.EnableRateLimiting("sensitive-booking")]
    public async Task<IActionResult> Confirm(Guid id, [FromForm] string? token, CancellationToken ct)
    {
        if (!IsAllowed()) return NotFound();
        NoLeakHeaders();
        var attempt = await GetValidAttemptAsync(id, token, ct);
        if (attempt is null || attempt.Status != PaymentAttemptStatus.Pending
            || attempt.ExpiresAtUtc <= DateTimeOffset.UtcNow)
            return BadRequest("Mã demo không hợp lệ, đã dùng hoặc đã hết hạn.");

        var reference = "LAN-DEMO-" + Guid.NewGuid().ToString("N")[..20].ToUpperInvariant();
        var result = await attempts.ConfirmAsync(id, reference, attempt.Amount, null, ct);
        if (!result.Succeeded) return Conflict("Mô phỏng không thành công: " + result.Error);
        if (result.Attempt?.Status != PaymentAttemptStatus.Succeeded)
            return Conflict("Lần thử cần xử lý thủ công; booking chưa được xác nhận.");

        return View("Completed", attempt);
    }

    private async Task<PaymentAttemptDto?> GetValidAttemptAsync(Guid id, string? token, CancellationToken ct)
    {
        if (!LanDemoPaymentToken.TryUnprotect(dataProtection, token, out var payload)
            || payload is null || payload.AttemptId != id) return null;
        var history = await attempts.ListForBookingAsync(payload.BookingId, ct);
        return history.FirstOrDefault(x => x.Id == payload.AttemptId
            && x.BookingId == payload.BookingId && x.Amount == payload.Amount
            && string.Equals(x.RequestCode, payload.RequestCode, StringComparison.Ordinal));
    }

    private bool IsAllowed()
        => environment.IsDevelopment() && options.Value.EnableLanDemo
            && LanDemoPaymentToken.IsPrivateOrLoopback(HttpContext.Connection.RemoteIpAddress)
            && LanDemoPaymentToken.TryGetPrivateLanBase(options.Value.LanBaseUrl, out _);

    private void NoLeakHeaders()
    {
        Response.Headers.CacheControl = "no-store, no-cache, max-age=0";
        Response.Headers["Referrer-Policy"] = "no-referrer";
        Response.Headers["X-Robots-Tag"] = "noindex, nofollow";
    }
}
