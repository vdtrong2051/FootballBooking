using FootballBooking.Domain.Bookings;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FootballBooking.Infrastructure.Data.Configurations;

public sealed class PaymentRecordConfiguration : IEntityTypeConfiguration<PaymentRecord>
{
    public void Configure(EntityTypeBuilder<PaymentRecord> builder)
    {
        builder.ToTable("Payments");
        builder.HasKey(payment => payment.Id);
        builder.Property(payment => payment.PaymentType).HasConversion<int>().IsRequired();
        builder.Property(payment => payment.Method).HasConversion<int>().IsRequired();
        builder.Property(payment => payment.Status).HasConversion<int>().IsRequired();
        builder.Property(payment => payment.TransactionCode).HasMaxLength(100);
        builder.Property(payment => payment.Note).HasMaxLength(500);
        builder.Property(payment => payment.EvidencePath).HasMaxLength(500);
        builder.HasOne(payment => payment.Booking)
            .WithMany(booking => booking.Payments)
            .HasForeignKey(payment => payment.BookingId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.HasIndex(payment => new { payment.BookingId, payment.Status });
        builder.HasIndex(payment => payment.TransactionCode);
        builder.HasIndex(payment => payment.CreatedAtUtc);
        builder.ToTable(table => table.HasCheckConstraint("CK_Payments_Amount", "Amount > 0"));
    }
}
