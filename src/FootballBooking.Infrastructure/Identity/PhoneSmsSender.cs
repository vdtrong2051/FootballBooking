using System.Net.Http.Headers;
using System.Text;
using FootballBooking.Infrastructure.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace FootballBooking.Infrastructure.Identity;

public interface IPhoneSmsSender
{
    bool IsConfigured { get; }
    Task SendAsync(string phone, string message, CancellationToken cancellationToken = default);
}

// Explicit Console mode is DEVELOPMENT ONLY; Twilio mode sends real SMS.
public sealed class PhoneSmsSender(
    HttpClient client,
    IConfiguration config,
    IHostEnvironment environment,
    ILogger<PhoneSmsSender> logger) : IPhoneSmsSender
{
    private string Mode => config["Sms:Provider"]?.Trim() ?? string.Empty;

    public bool IsConfigured =>
        (environment.IsDevelopment() && Mode.Equals("Console", StringComparison.OrdinalIgnoreCase))
        || (Mode.Equals("Twilio", StringComparison.OrdinalIgnoreCase)
            && !string.IsNullOrWhiteSpace(config["Sms:Twilio:AccountSid"])
            && !string.IsNullOrWhiteSpace(config["Sms:Twilio:AuthToken"])
            && !string.IsNullOrWhiteSpace(config["Sms:Twilio:From"]));

    public async Task SendAsync(string phone, string message, CancellationToken cancellationToken = default)
    {
        if (!IsConfigured) throw new InvalidOperationException("SMS provider not configured.");
        if (Mode.Equals("Console", StringComparison.OrdinalIgnoreCase))
        {
            logger.LogWarning("DEVELOPMENT ONLY — SMS to {Phone}: {Body}", phone, message);
            return;
        }

        var sid = config["Sms:Twilio:AccountSid"]!;
        var secret = config["Sms:Twilio:AuthToken"]!;
        var from = config["Sms:Twilio:From"]!;
        var to = phone.StartsWith("0", StringComparison.Ordinal) ? "+84" + phone[1..] : phone;
        var request = new HttpRequestMessage(HttpMethod.Post,
            $"https://api.twilio.com/2010-04-01/Accounts/{Uri.EscapeDataString(sid)}/Messages.json")
        {
            Content = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["From"] = from, ["To"] = to, ["Body"] = message
            })
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Basic",
            Convert.ToBase64String(Encoding.UTF8.GetBytes($"{sid}:{secret}")));
        using var response = await client.SendAsync(request, cancellationToken);
        response.EnsureSuccessStatusCode();
    }
}
