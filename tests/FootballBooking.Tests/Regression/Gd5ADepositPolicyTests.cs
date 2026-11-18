using FootballBooking.Application.Bookings;

namespace FootballBooking.Tests.Regression;

public sealed class Gd5ADepositPolicyTests
{
    private static readonly BookingPolicyOptions Policy = new();

    [Theory]
    [InlineData(300_000L, 90_000L)]
    [InlineData(100_000L, 50_000L)]
    [InlineData(50_000L, 50_000L)]
    [InlineData(0L, 0L)]
    public void RequiredAmount_RespectsPercentageMinimumAndCap(long total, long expected)
        => Assert.Equal(expected, BookingDepositPolicy.RequiredAmount(total, Policy));

    [Fact]
    public void OutstandingToConfirm_SubtractsConfirmedNetReceipts()
    {
        Assert.Equal(30_000L, BookingDepositPolicy.OutstandingToConfirm(300_000, 60_000, 0, Policy));
        Assert.Equal(50_000L, BookingDepositPolicy.OutstandingToConfirm(300_000, 60_000, 20_000, Policy));
        Assert.Equal(0L, BookingDepositPolicy.OutstandingToConfirm(300_000, 100_000, 0, Policy));
    }

    [Fact]
    public void InvalidPolicy_FailsClosed()
    {
        Assert.Throws<InvalidOperationException>(() =>
            BookingDepositPolicy.RequiredAmount(300_000, new BookingPolicyOptions { DepositPercent = 101 }));
        Assert.Throws<InvalidOperationException>(() =>
            BookingDepositPolicy.RequiredAmount(300_000, new BookingPolicyOptions { MinimumDepositAmount = -1 }));
    }
}
