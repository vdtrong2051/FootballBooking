using FootballBooking.Domain.Bookings;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FootballBooking.Infrastructure.Data.Configurations;

public sealed class BookingServiceLineConfiguration : IEntityTypeConfiguration<BookingServiceLine>
{
    public void Configure(EntityTypeBuilder<BookingServiceLine> builder)
    {
        builder.ToTable("BookingServices");
        builder.HasKey(line => line.Id);
        builder.Property(line => line.ServiceCodeSnapshot).HasMaxLength(30).IsRequired();
        builder.Property(line => line.ServiceNameSnapshot).HasMaxLength(120).IsRequired();
        builder.Property(line => line.UnitNameSnapshot).HasMaxLength(50).IsRequired();
        builder.HasOne(line => line.Booking)
            .WithMany(booking => booking.ServiceLines)
            .HasForeignKey(line => line.BookingId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(line => line.Service)
            .WithMany()
            .HasForeignKey(line => line.ServiceId)
            .OnDelete(DeleteBehavior.SetNull);
        builder.HasIndex(line => line.BookingId);
        builder.ToTable(table =>
        {
            table.HasCheckConstraint("CK_BookingServices_Quantity", "Quantity > 0");
            table.HasCheckConstraint("CK_BookingServices_Amounts", "UnitPrice >= 0 AND LineTotal >= 0");
        });
    }
}
