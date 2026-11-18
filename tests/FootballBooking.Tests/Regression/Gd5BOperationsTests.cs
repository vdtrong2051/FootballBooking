using FootballBooking.Application.Bookings;
using FootballBooking.Domain.Bookings;

namespace FootballBooking.Tests.Regression;

public sealed class Gd5BOperationsTests
{
    private static readonly DateTimeOffset Now = new(2026, 11, 18, 12, 0, 0, TimeSpan.Zero);

    [Theory]
    [InlineData(0, 0, 0)]
    [InlineData(5, 0, 0)]
    [InlineData(6, 15, 50000)]
    [InlineData(19, 15, 50000)]
    [InlineData(20, 15, 50000)]
    [InlineData(21, 30, 100000)]
    public void Overtime_GraceAndStep_AreAppliedOnce(int actualMinutes, int billedMinutes, long charge)
    {
        var result = BookingOvertimePolicy.Calculate(actualMinutes, 200000, 5, 15);
        Assert.Equal(billedMinutes, result.BilledMinutes);
        Assert.Equal(charge, result.Amount);
    }

    [Fact]
    public void Overtime_RejectsNegativeOrInvalidPolicy()
    {
        Assert.Throws<ArgumentOutOfRangeException>(() => BookingOvertimePolicy.Calculate(-1, 200000, 5, 15));
        Assert.Throws<ArgumentOutOfRangeException>(() => BookingOvertimePolicy.Calculate(20, 200000, -1, 15));
        Assert.Throws<ArgumentOutOfRangeException>(() => BookingOvertimePolicy.Calculate(20, 200000, 5, 0));
    }

    [Fact]
    public void Session_CannotStartTwiceAndCannotFinishTwice()
    {
        var bookingId = Guid.NewGuid();
        var actor = Guid.NewGuid();
        var session = new BookingSession(Guid.NewGuid(), bookingId, 1140, 200000, 5, 15,
            Now, actor, "Staff A", "Staff");
        session.Start(Now.AddMinutes(1), actor, "Staff A", "Staff");
        Assert.Throws<InvalidOperationException>(() => session.Start(Now.AddMinutes(2), actor, "Staff A", "Staff"));
        session.Finish(Now.AddMinutes(75), actor, "Staff A", "Staff", 15, 15, 50000);
        Assert.Equal(Now.AddMinutes(75), session.EndedAtUtc!.Value);
        Assert.Equal("Staff", session.EndedByRole);
        Assert.Throws<InvalidOperationException>(() => session.Finish(Now.AddMinutes(76), actor, "Staff A", "Staff", 15, 15, 50000));
    }

    [Fact]
    public void Session_ExtensionPreservesOriginalEndTime()
    {
        var session = new BookingSession(Guid.NewGuid(), Guid.NewGuid(), 1140,
            200000, 5, 15, Now, Guid.NewGuid(), "Owner A", "Owner");
        session.Extend(1170, 300000);
        Assert.Equal(1140, session.OriginalEndMinute);
        Assert.Equal(1170, session.EffectiveEndMinute);
        Assert.Equal(300000, session.OvertimeRatePerHour);
        Assert.Throws<InvalidOperationException>(() => session.Extend(1170, 300000));
    }

    [Fact]
    public void Actors_MustBeAuthenticatedInternalRoles()
    {
        Assert.True(new BookingOperator(Guid.NewGuid(), "Owner A", "Owner").IsValid);
        Assert.True(new BookingOperator(Guid.NewGuid(), "Staff A", "Staff").IsValid);
        Assert.False(new BookingOperator(Guid.NewGuid(), "Customer A", "Customer").IsValid);
        Assert.False(new BookingOperator(Guid.Empty, "Staff A", "Staff").IsValid);
    }

    [Fact]
    public void ExtraCharge_MustNotBeNegative()
    {
        Assert.Throws<ArgumentOutOfRangeException>(() => new BookingExtraCharge(
            Guid.NewGuid(), Guid.NewGuid(), BookingExtraChargeKind.Overtime,
            1140, 1140, 15, 200000, -1, "Test", Guid.NewGuid(), Now));
    }
}
