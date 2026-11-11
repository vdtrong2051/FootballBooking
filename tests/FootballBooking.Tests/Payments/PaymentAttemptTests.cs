using FootballBooking.Domain.Bookings;
using FootballBooking.Domain.Payments;
using FootballBooking.Infrastructure.Payments;

namespace FootballBooking.Tests.Payments;

public sealed class PaymentAttemptTests
{
    private static readonly DateTimeOffset Now = new(2026, 11, 11, 2, 0, 0, TimeSpan.Zero);

    private static PaymentAttempt Create() => new(Guid.NewGuid(), Guid.NewGuid(),
        PaymentMethod.VietQr, 250000, "FBPAYABC123", Now.AddMinutes(10), Now);

    [Fact]
    public void Attempt_IsPendingUntilTrustedConfirmation()
    {
        var attempt = Create();
        Assert.Equal(PaymentAttemptStatus.Pending, attempt.Status);
        Assert.True(attempt.IsLive(Now));
        Assert.Null(attempt.ExternalReference);
        attempt.Confirm("BANK20261111X", 250000, Guid.NewGuid(), Now.AddMinutes(2));
        Assert.Equal(PaymentAttemptStatus.Succeeded, attempt.Status);
        Assert.Equal("BANK20261111X", attempt.ExternalReference);
    }

    [Fact]
    public void Attempt_RejectsIncorrectAmount()
    {
        var attempt = Create();
        Assert.Throws<ArgumentException>(() => attempt.Confirm("BANK20261111X", 100000, null, Now));
        Assert.Equal(PaymentAttemptStatus.Pending, attempt.Status);
    }

    [Fact]
    public void Attempt_ExpiredHoldCannotBeConfirmed()
    {
        var attempt = Create();
        attempt.Expire(Now.AddMinutes(11));
        Assert.Equal(PaymentAttemptStatus.Expired, attempt.Status);
        Assert.Throws<InvalidOperationException>(() => attempt.Confirm("BANK20261111X", 250000, null, Now.AddMinutes(11)));
    }

    [Fact]
    public void Attempt_LateTransferIsReviewOnly()
    {
        var attempt = Create();
        attempt.FlagForReconciliation("BANK20261111X", 250000, "Paid late", Now.AddMinutes(11));
        Assert.Equal(PaymentAttemptStatus.NeedsReconciliation, attempt.Status);
        Assert.Throws<InvalidOperationException>(() => attempt.Confirm("BANK20261111X", 250000, null, Now.AddMinutes(11)));
    }

    [Fact]
    public void VietQrQuickLink_EncodesAmountAndRequestCode_NoNetworkRequired()
    {
        var config = new PaymentOptions
        {
            BankBin = "970436", AccountNumber = "123456789", AccountName = "SAN BONG ABC"
        };
        var qr = VietQrInstructions.BuildImageUrl(config, Create());
        Assert.NotNull(qr);
        Assert.Contains("img.vietqr.io/image/970436-123456789-compact2.png", qr);
        Assert.Contains("amount=250000", qr);
        Assert.Contains("addInfo=FBPAYABC123", qr);
    }

    [Fact]
    public void VietQrQuickLink_UnconfiguredBankReturnsNull()
    {
        Assert.Null(VietQrInstructions.BuildImageUrl(new PaymentOptions(), Create()));
    }

    [Fact]
    public void DemoSignature_ValidatesHmacAndTimestamp()
    {
        var secret = "development-only-secret-minimum-32-chars";
        var id = Guid.NewGuid();
        var signature = DemoPaymentSignature.Compute(secret, id, 250000, "DEMOREF123", Now.ToUnixTimeSeconds());
        Assert.True(DemoPaymentSignature.Verify(secret, id, 250000, "DEMOREF123",
            Now.ToUnixTimeSeconds(), signature, Now));
        Assert.False(DemoPaymentSignature.Verify(secret, id, 250001, "DEMOREF123",
            Now.ToUnixTimeSeconds(), signature, Now));
        Assert.False(DemoPaymentSignature.Verify(secret, id, 250000, "DEMOREF123",
            Now.AddMinutes(-7).ToUnixTimeSeconds(), signature, Now));
    }
}
