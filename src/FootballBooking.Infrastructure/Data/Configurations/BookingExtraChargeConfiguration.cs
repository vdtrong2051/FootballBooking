using FootballBooking.Domain.Bookings;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FootballBooking.Infrastructure.Data.Configurations;

public sealed class BookingExtraChargeConfiguration : IEntityTypeConfiguration<BookingExtraCharge>
{
    public void Configure(EntityTypeBuilder<BookingExtraCharge> builder)
    {
        builder.ToTable("BookingExtraCharges");
        builder.HasKey(x => x.Id);
        builder.HasIndex(x => new { x.BookingId, x.Kind });
        builder.Property(x => x.Kind).HasConversion<int>();
        builder.Property(x => x.Note).HasMaxLength(500).IsRequired();
        builder.HasOne<Booking>().WithMany(x => x.ExtraCharges)
            .HasForeignKey(x => x.BookingId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
