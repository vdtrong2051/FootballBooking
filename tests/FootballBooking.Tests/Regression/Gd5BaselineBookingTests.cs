using FootballBooking.Domain.Bookings;

namespace FootballBooking.Tests.Regression;

/// <summary>
/// GD5.0: guard existing booking-domain invariants without a database.
/// Missing deposit, overtime and zone behaviors are tracked as gaps for later stages.
/// </summary>
public sealed class Gd5BaselineBookingTests
{
    private static readonly DateTimeOffset Now =
        new(2026, 11, 18, 0, 0, 0, TimeSpan.Zero);
    private static readonly DateOnly Day = new(2026, 11, 20);

    private static Booking Make(
        BookingStatus status,
        DateTimeOffset? expiresAt = null,
        BookingSource source = BookingSource.GuestWeb,
        Guid? customerUserId = null,
        DateOnly? date = null)
        => new(
            Guid.NewGuid(), "FB-261120-REGRESS", Guid.NewGuid(), date ?? Day,
            1080, 1140, "Khach test", "0901234567", "0901234567",
            null, customerUserId, null, source, status, PaymentStatus.Unpaid,
            300_000L, 0L, 0L, 300_000L, expiresAt, Now, null);

    [Theory]
    [InlineData(1020, 1080, false)]
    [InlineData(1140, 1200, false)]
    [InlineData(1050, 1110, true)]
    [InlineData(1110, 1170, true)]
    [InlineData(1090, 1130, true)]
    [InlineData(1050, 1170, true)]
    [InlineData(1080, 1140, true)]
    public void Overlaps_UsesHalfOpenIntervals(
        int startMinute, int endMinute, bool expected)
    {
        var booking = Make(BookingStatus.Confirmed);
        Assert.Equal(expected, booking.Overlaps(Day, startMinute, endMinute));
    }

    [Fact]
    public void Overlaps_DifferentDate_DoesNotConflict()
    {
        var booking = Make(BookingStatus.Confirmed);
        Assert.False(booking.Overlaps(Day.AddDays(1), 1080, 1140));
    }

    [Theory]
    [InlineData(BookingStatus.Confirmed, true)]
    [InlineData(BookingStatus.CheckedIn, true)]
    [InlineData(BookingStatus.InProgress, true)]
    [InlineData(BookingStatus.Cancelled, false)]
    [InlineData(BookingStatus.Expired, false)]
    [InlineData(BookingStatus.NoShow, false)]
    [InlineData(BookingStatus.Completed, false)]
    public void BlocksAvailability_DependsOnOperationalStatus(
        BookingStatus status, bool expected)
    {
        var booking = Make(status);
        Assert.Equal(expected, booking.BlocksAvailability(Now));
    }

    [Fact]
    public void PendingHold_BlocksUntilExpiry_NotAtOrAfterExpiry()
    {
        Assert.True(Make(BookingStatus.PendingPayment, Now.AddSeconds(1))
            .BlocksAvailability(Now));
        Assert.False(Make(BookingStatus.PendingPayment, Now)
            .BlocksAvailability(Now));
        Assert.False(Make(BookingStatus.PendingPayment, Now.AddSeconds(-1))
            .BlocksAvailability(Now));
    }

    [Fact]
    public void ExpiredHold_ChangesStatusOnlyWhenExplicitlyExpired()
    {
        var booking = Make(BookingStatus.PendingPayment, Now.AddMinutes(-1));
        Assert.False(booking.BlocksAvailability(Now));
        Assert.True(booking.ExpireIfNeeded(Now));
        Assert.Equal(BookingStatus.Expired, booking.Status);
        Assert.False(booking.ExpireIfNeeded(Now));
    }

    [Fact]
    public void GuestAndRegisteredCustomer_KeepDistinctOwnership()
    {
        var customerId = Guid.NewGuid();
        var guest = Make(BookingStatus.PendingPayment, Now.AddMinutes(10));
        var registered = Make(BookingStatus.PendingPayment, Now.AddMinutes(10),
            BookingSource.CustomerAccount, customerId);

        Assert.Equal(BookingSource.GuestWeb, guest.Source);
        Assert.Null(guest.CustomerUserId);
        Assert.Equal(BookingSource.CustomerAccount, registered.Source);
        Assert.Equal(customerId, registered.CustomerUserId);
    }

    [Fact]
    public void PendingPayment_CannotSkipDirectlyToCheckIn()
    {
        var booking = Make(BookingStatus.PendingPayment, Now.AddMinutes(10));
        booking.MarkCheckedIn(Now.AddMinutes(1));
        Assert.Equal(BookingStatus.PendingPayment, booking.Status);
    }

    [Fact]
    public void ConfirmedBooking_CannotSkipCheckInToInProgress()
    {
        var booking = Make(BookingStatus.Confirmed);
        booking.Start(Now.AddMinutes(1));
        Assert.Equal(BookingStatus.Confirmed, booking.Status);
    }

    [Fact]
    public void PartialPaymentAndRefund_KeepSeparateAccounting()
    {
        var booking = Make(BookingStatus.Confirmed);
        booking.RecordPayment(PaymentRecordType.Payment, PaymentMethod.Cash,
            100_000L, PaymentRecordStatus.Succeeded, "GD5-BASE-PAY",
            null, null, Now.AddMinutes(1));

        Assert.Equal(100_000L, booking.PaidAmount);
        Assert.Equal(PaymentStatus.PartiallyPaid, booking.PaymentStatus);

        booking.RecordPayment(PaymentRecordType.Refund, PaymentMethod.Cash,
            40_000L, PaymentRecordStatus.Succeeded, "GD5-BASE-REFUND",
            null, null, Now.AddMinutes(2));

        Assert.Equal(100_000L, booking.PaidAmount);
        Assert.Equal(40_000L, booking.RefundedAmount);
        Assert.Equal(PaymentStatus.PartiallyRefunded, booking.PaymentStatus);
    }
}
