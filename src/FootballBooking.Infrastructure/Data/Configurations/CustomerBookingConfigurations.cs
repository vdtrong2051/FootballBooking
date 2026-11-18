using FootballBooking.Domain.Bookings;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FootballBooking.Infrastructure.Data.Configurations;

public sealed class BookingRescheduleHistoryConfiguration : IEntityTypeConfiguration<BookingRescheduleHistory>
{
    public void Configure(EntityTypeBuilder<BookingRescheduleHistory> b)
    {
        b.ToTable("BookingRescheduleHistory"); b.HasKey(x => x.Id);
        b.HasIndex(x => new { x.BookingId, x.CreatedAtUtc });
        b.HasOne<Booking>().WithMany().HasForeignKey(x => x.BookingId).OnDelete(DeleteBehavior.Cascade);
    }
}
public sealed class RecurringBookingSeriesConfiguration : IEntityTypeConfiguration<RecurringBookingSeries>
{
    public void Configure(EntityTypeBuilder<RecurringBookingSeries> b)
    {
        b.ToTable("RecurringBookingSeries"); b.HasKey(x => x.Id);
        b.HasIndex(x => new { x.CustomerUserId, x.CreatedAtUtc });
        b.HasOne<FootballBooking.Domain.Fields.Field>().WithMany()
            .HasForeignKey(x => x.FieldId).OnDelete(DeleteBehavior.Restrict);
    }
}
public sealed class RecurringBookingOccurrenceConfiguration : IEntityTypeConfiguration<RecurringBookingOccurrence>
{
    public void Configure(EntityTypeBuilder<RecurringBookingOccurrence> b)
    {
        b.ToTable("RecurringBookingOccurrences"); b.HasKey(x => x.Id);
        b.Property(x => x.FailureReason).HasMaxLength(300);
        b.HasIndex(x => new { x.SeriesId, x.BookingDate }).IsUnique();
        b.HasIndex(x => x.BookingId).IsUnique();
        b.HasOne<RecurringBookingSeries>().WithMany().HasForeignKey(x => x.SeriesId).OnDelete(DeleteBehavior.Cascade);
        b.HasOne<Booking>().WithMany().HasForeignKey(x => x.BookingId).OnDelete(DeleteBehavior.Restrict);
    }
}
public sealed class GuestBookingOtpChallengeConfiguration : IEntityTypeConfiguration<GuestBookingOtpChallenge>
{
    public void Configure(EntityTypeBuilder<GuestBookingOtpChallenge> b)
    {
        b.ToTable("GuestBookingOtpChallenges"); b.HasKey(x => x.BookingId);
        b.Property(x => x.PhoneNormalized).HasMaxLength(30).IsRequired();
        b.Property(x => x.ProtectedCode).HasMaxLength(1000).IsRequired();
        b.HasOne<Booking>().WithMany().HasForeignKey(x => x.BookingId).OnDelete(DeleteBehavior.Cascade);
    }
}
