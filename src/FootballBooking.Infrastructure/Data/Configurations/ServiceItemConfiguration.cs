using FootballBooking.Domain.Bookings;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FootballBooking.Infrastructure.Data.Configurations;

public sealed class ServiceItemConfiguration : IEntityTypeConfiguration<ServiceItem>
{
    public void Configure(EntityTypeBuilder<ServiceItem> builder)
    {
        builder.ToTable("Services");
        builder.HasKey(service => service.Id);
        builder.Property(service => service.Code).HasMaxLength(30).IsRequired();
        builder.Property(service => service.Name).HasMaxLength(120).IsRequired();
        builder.Property(service => service.Description).HasMaxLength(1000);
        builder.Property(service => service.UnitName).HasMaxLength(50).IsRequired();
        builder.HasIndex(service => service.Code).IsUnique();
        builder.HasIndex(service => new { service.IsActive, service.SortOrder });
        builder.ToTable(table =>
        {
            table.HasCheckConstraint("CK_Services_UnitPrice", "UnitPrice >= 0");
            table.HasCheckConstraint("CK_Services_AvailableQuantity", "AvailableQuantity IS NULL OR AvailableQuantity >= 0");
        });
    }
}
