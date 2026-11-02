using FootballBooking.Domain.Bookings;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FootballBooking.Infrastructure.Data.Configurations;

public sealed class BookingConfiguration : IEntityTypeConfiguration<Booking>
{
    public void Configure(EntityTypeBuilder<Booking> builder)
    {
        builder.ToTable("Bookings");
        builder.HasKey(booking => booking.Id);

        builder.Property(booking => booking.BookingCode).HasMaxLength(32).IsRequired();
        builder.Property(booking => booking.CustomerName).HasMaxLength(120).IsRequired();
        builder.Property(booking => booking.CustomerPhone).HasMaxLength(30).IsRequired();
        builder.Property(booking => booking.CustomerPhoneNormalized).HasMaxLength(30).IsRequired();
        builder.Property(booking => booking.CustomerEmail).HasMaxLength(180);
        builder.Property(booking => booking.Note).HasMaxLength(500);
        builder.Property(booking => booking.PromoCodeSnapshot).HasMaxLength(50);
        builder.Property(booking => booking.CancellationReason).HasMaxLength(500);
        builder.Property(booking => booking.Source).HasConversion<int>().IsRequired();
        builder.Property(booking => booking.Status).HasConversion<int>().IsRequired();
        builder.Property(booking => booking.PaymentStatus).HasConversion<int>().IsRequired();

        builder.HasIndex(booking => booking.BookingCode).IsUnique();
        builder.HasIndex(booking => new { booking.FieldId, booking.BookingDate, booking.StartMinute, booking.EndMinute });
        builder.HasIndex(booking => new { booking.CustomerPhoneNormalized, booking.BookingCode });
        builder.HasOne(booking => booking.Field)
            .WithMany()
            .HasForeignKey(booking => booking.FieldId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(booking => booking.PromoCode)
            .WithMany()
            .HasForeignKey(booking => booking.PromoCodeId)
            .OnDelete(DeleteBehavior.SetNull);
        builder.Navigation(booking => booking.ServiceLines).UsePropertyAccessMode(PropertyAccessMode.Field);
        builder.Navigation(booking => booking.Payments).UsePropertyAccessMode(PropertyAccessMode.Field);

        builder.ToTable(table =>
        {
            table.HasCheckConstraint("CK_Bookings_Minutes", "StartMinute >= 0 AND StartMinute < EndMinute AND EndMinute <= 1440");
            table.HasCheckConstraint("CK_Bookings_Amounts", "CourtAmount >= 0 AND ServiceAmount >= 0 AND DiscountAmount >= 0 AND TotalAmount >= 0 AND PaidAmount >= 0 AND RefundedAmount >= 0");
        });
    }
}
