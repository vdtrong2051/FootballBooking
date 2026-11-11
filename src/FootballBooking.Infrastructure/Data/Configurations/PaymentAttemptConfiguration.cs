using FootballBooking.Domain.Bookings;
using FootballBooking.Domain.Payments;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FootballBooking.Infrastructure.Data.Configurations;

public sealed class PaymentAttemptConfiguration : IEntityTypeConfiguration<PaymentAttempt>
{
    public void Configure(EntityTypeBuilder<PaymentAttempt> builder)
    {
        builder.ToTable("PaymentAttempts");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Method).HasConversion<int>().IsRequired();
        builder.Property(x => x.Status).HasConversion<int>().IsRequired();
        builder.Property(x => x.RequestCode).HasMaxLength(64).IsRequired();
        builder.Property(x => x.ExternalReference).HasMaxLength(100);
        builder.Property(x => x.Note).HasMaxLength(500);
        builder.HasOne<Booking>().WithMany().HasForeignKey(x => x.BookingId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.HasIndex(x => x.RequestCode).IsUnique();
        builder.HasIndex(x => x.ExternalReference).IsUnique();
        builder.HasIndex(x => new { x.BookingId, x.Status });
        builder.HasIndex(x => x.CreatedAtUtc);
    }
}
