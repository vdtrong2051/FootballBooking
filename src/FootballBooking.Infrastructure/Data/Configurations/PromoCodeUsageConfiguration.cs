using FootballBooking.Domain.Bookings;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FootballBooking.Infrastructure.Data.Configurations;

public sealed class PromoCodeUsageConfiguration : IEntityTypeConfiguration<PromoCodeUsage>
{
    public void Configure(EntityTypeBuilder<PromoCodeUsage> builder)
    {
        builder.ToTable("PromoCodeUsages");
        builder.HasKey(usage => usage.Id);
        builder.Property(usage => usage.CustomerPhoneNormalized).HasMaxLength(30).IsRequired();
        builder.HasOne(usage => usage.PromoCode)
            .WithMany()
            .HasForeignKey(usage => usage.PromoCodeId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(usage => usage.Booking)
            .WithMany()
            .HasForeignKey(usage => usage.BookingId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.HasIndex(usage => new { usage.PromoCodeId, usage.CustomerPhoneNormalized });
        builder.HasIndex(usage => usage.BookingId).IsUnique();
        builder.ToTable(table => table.HasCheckConstraint("CK_PromoCodeUsages_DiscountAmount", "DiscountAmount >= 0"));
    }
}
