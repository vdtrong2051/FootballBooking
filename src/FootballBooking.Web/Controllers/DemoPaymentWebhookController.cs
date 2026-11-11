using FootballBooking.Application.Payments;
using FootballBooking.Infrastructure.Payments;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace FootballBooking.Web.Controllers;

/// <summary>Not an integration with MoMo/ZaloPay; local-only signed demo event receiver.</summary>
[ApiController]
[Route("dev/payments")]
public sealed class DemoPaymentWebhookController(
    IPaymentAttemptService attempts,
    IOptions<PaymentOptions> options,
    IWebHostEnvironment environment) : ControllerBase
{
    public sealed record Notification(Guid AttemptId, long Amount, string Reference, long Timestamp);

    [HttpPost("notify")]
    public async Task<IActionResult> Notify([FromBody] Notification notification, CancellationToken ct)
    {
        // Fail closed even if someone accidentally maps the route in Production.
        var cfg = options.Value;
        if (!environment.IsDevelopment() || !cfg.EnableDemoGateway
            || string.IsNullOrWhiteSpace(cfg.DemoWebhookSecret) || cfg.DemoWebhookSecret.Length < 32)
            return NotFound();
        var signature = Request.Headers["X-FB-Demo-Signature"].ToString();
        if (!DemoPaymentSignature.Verify(cfg.DemoWebhookSecret, notification.AttemptId,
            notification.Amount, notification.Reference, notification.Timestamp,
            signature, DateTimeOffset.UtcNow))
            return Unauthorized(new { message = "Invalid demo signature or expired timestamp." });

        var result = await attempts.ConfirmAsync(notification.AttemptId,
            notification.Reference, notification.Amount, null, ct);
        if (!result.Succeeded) return Conflict(new { message = result.Error });
        return Ok(new { status = result.Attempt!.Status.ToString(), attemptId = result.Attempt.Id });
    }
}
