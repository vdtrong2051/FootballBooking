using FootballBooking.Domain.Bookings;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FootballBooking.Infrastructure.Data.Configurations;

public sealed class PromoCodeConfiguration : IEntityTypeConfiguration<PromoCode>
{
    public void Configure(EntityTypeBuilder<PromoCode> builder)
    {
        builder.ToTable("PromoCodes");
        builder.HasKey(promotion => promotion.Id);
        builder.Property(promotion => promotion.Code).HasMaxLength(50).IsRequired();
        builder.Property(promotion => promotion.Name).HasMaxLength(150).IsRequired();
        builder.Property(promotion => promotion.DiscountType).HasConversion<int>().IsRequired();
        builder.HasIndex(promotion => promotion.Code).IsUnique();
        builder.HasIndex(promotion => new { promotion.IsActive, promotion.StartsAtUtc, promotion.EndsAtUtc });
        builder.ToTable(table =>
        {
            table.HasCheckConstraint("CK_PromoCodes_DiscountValue", "DiscountValue > 0");
            table.HasCheckConstraint("CK_PromoCodes_Amounts", "MinimumOrderAmount >= 0 AND (MaximumDiscountAmount IS NULL OR MaximumDiscountAmount >= 0)");
        });
    }
}
