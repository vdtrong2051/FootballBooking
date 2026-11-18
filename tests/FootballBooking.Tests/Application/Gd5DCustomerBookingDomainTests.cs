using FootballBooking.Domain.Bookings;

namespace FootballBooking.Tests.Application;

public sealed class Gd5DCustomerBookingDomainTests
{
    private static readonly DateTimeOffset Now = new(2026, 11, 18, 2, 0, 0, TimeSpan.Zero);

    private static Booking Create()
        => new(Guid.NewGuid(), "FB-D5-TEST", Guid.NewGuid(), new DateOnly(2026, 12, 1),
            1080, 1140, "Customer", "0901234567", "0901234567", null,
            Guid.NewGuid(), null, BookingSource.CustomerAccount, BookingStatus.Confirmed,
            PaymentStatus.PartiallyPaid, 200000, 0, 0, 200000, null, Now, null);

    [Fact]
    public void Reschedule_ConfirmedBooking_PreservesReceiptsAndChangesOnlyCourtPrice()
    {
        var booking = Create();
        booking.RecordPayment(PaymentRecordType.Payment, PaymentMethod.Cash, 60000,
            PaymentRecordStatus.Succeeded, "GD5D-TEST-1", null, null, Now);
        booking.Reschedule(new DateOnly(2026, 12, 8), 1140, 1200, 250000, Now.AddMinutes(1));
        Assert.Equal(new DateOnly(2026, 12, 8), booking.BookingDate);
        Assert.Equal(1140, booking.StartMinute);
        Assert.Equal(1200, booking.EndMinute);
        Assert.Equal(250000, booking.CourtAmount);
        Assert.Equal(250000, booking.TotalAmount);
        Assert.Equal(60000, booking.PaidAmount);
        Assert.Equal(BookingStatus.Confirmed, booking.Status);
    }

    [Fact]
    public void Reschedule_ExcessRefundNeeded_DoesNotMutateBooking()
    {
        var booking = Create();
        booking.RecordPayment(PaymentRecordType.Payment, PaymentMethod.Cash, 200000,
            PaymentRecordStatus.Succeeded, "GD5D-TEST-2", null, null, Now);
        Assert.Throws<InvalidOperationException>(() => booking.Reschedule(
            new DateOnly(2026, 12, 8), 900, 960, 100000, Now));
        Assert.Equal(new DateOnly(2026, 12, 1), booking.BookingDate);
        Assert.Equal(200000, booking.CourtAmount);
    }

    [Fact]
    public void Reschedule_CheckedInBooking_IsRejected()
    {
        var booking = Create();
        booking.MarkCheckedIn(Now);
        Assert.Throws<InvalidOperationException>(() => booking.Reschedule(
            new DateOnly(2026, 12, 8), 900, 960, 250000, Now));
    }

    [Fact]
    public void Otp_MaxAttempts_AndRenewResetAreDeterministic()
    {
        var otp = new GuestBookingOtpChallenge(Guid.NewGuid(), "0901234567", "encrypted", Now);
        for (int i = 0; i < 7; i++) otp.RegisterFailure();
        Assert.Equal(5, otp.Attempts);
        otp.Renew("0901234567", "encrypted2", Now.AddMinutes(2));
        Assert.Equal(0, otp.Attempts);
        Assert.Equal(Now.AddMinutes(7), otp.ExpiresAtUtc);
    }
}
