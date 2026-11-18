using FootballBooking.Domain.Bookings;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FootballBooking.Infrastructure.Data.Configurations;

public sealed class BookingSessionConfiguration : IEntityTypeConfiguration<BookingSession>
{
    public void Configure(EntityTypeBuilder<BookingSession> builder)
    {
        builder.ToTable("BookingSessions");
        builder.HasKey(x => x.Id);
        builder.HasIndex(x => x.BookingId).IsUnique();
        builder.Property(x => x.CheckedInByName).HasMaxLength(120).IsRequired();
        builder.Property(x => x.CheckedInByRole).HasMaxLength(16).IsRequired();
        builder.Property(x => x.StartedByName).HasMaxLength(120);
        builder.Property(x => x.StartedByRole).HasMaxLength(16);
        builder.Property(x => x.EndedByName).HasMaxLength(120);
        builder.Property(x => x.EndedByRole).HasMaxLength(16);
        builder.HasOne<Booking>().WithOne(x => x.Session)
            .HasForeignKey<BookingSession>(x => x.BookingId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
