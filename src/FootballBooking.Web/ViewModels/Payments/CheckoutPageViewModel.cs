using FootballBooking.Application.Bookings;
using FootballBooking.Application.Payments;
using FootballBooking.Domain.Bookings;

namespace FootballBooking.Web.ViewModels.Payments;

public sealed class CheckoutPageViewModel
{
    public required BookingDetailDto Booking { get; init; }
    public IReadOnlyList<PaymentAttemptDto> Attempts { get; init; } = [];
    public string? VietQrImageUrl { get; init; }
    public bool BankConfigured { get; init; }
    public string? BankAccountNumber { get; init; }
    public string? BankAccountName { get; init; }
    public bool EnableDemoGateway { get; init; }
    public PaymentAttemptDto? LatestAttempt => Attempts.FirstOrDefault();
    public static string MethodName(PaymentMethod method) => method switch
    {
        PaymentMethod.VietQr => "VietQR",
        PaymentMethod.BankTransfer => "Chuyển khoản",
        PaymentMethod.Cash => "Tiền mặt tại sân",
        PaymentMethod.Card => "Thẻ/POS tại sân",
        PaymentMethod.MoMo => "MoMo (sandbox demo)",
        PaymentMethod.ZaloPay => "ZaloPay (sandbox demo)",
        _ => method.ToString()
    };
}
