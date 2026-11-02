using FootballBooking.Domain.Fields;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FootballBooking.Infrastructure.Data.Configurations;

public sealed class FieldConfiguration : IEntityTypeConfiguration<Field>
{
    public void Configure(EntityTypeBuilder<Field> builder)
    {
        builder.ToTable("Fields");
        builder.HasKey(field => field.Id);

        builder.Property(field => field.Code).HasMaxLength(30).IsRequired();
        builder.Property(field => field.Name).HasMaxLength(120).IsRequired();
        builder.Property(field => field.Slug).HasMaxLength(160).IsRequired();
        builder.Property(field => field.FieldType).HasMaxLength(50).IsRequired();
        builder.Property(field => field.Description).HasMaxLength(2000);
        builder.Property(field => field.Address).HasMaxLength(300);
        builder.Property(field => field.AmenitiesJson).HasColumnType("json");
        builder.Property(field => field.Status).HasConversion<int>().IsRequired();

        builder.HasIndex(field => field.Code).IsUnique();
        builder.HasIndex(field => field.Slug).IsUnique();

        builder.HasMany(field => field.Images)
            .WithOne(image => image.Field)
            .HasForeignKey(image => image.FieldId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(field => field.OperatingHours)
            .WithOne(hour => hour.Field)
            .HasForeignKey(hour => hour.FieldId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(field => field.Blocks)
            .WithOne(block => block.Field)
            .HasForeignKey(block => block.FieldId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(field => field.PricingRules)
            .WithOne(rule => rule.Field)
            .HasForeignKey(rule => rule.FieldId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Navigation(field => field.Images).UsePropertyAccessMode(PropertyAccessMode.Field);
        builder.Navigation(field => field.OperatingHours).UsePropertyAccessMode(PropertyAccessMode.Field);
        builder.Navigation(field => field.Blocks).UsePropertyAccessMode(PropertyAccessMode.Field);
        builder.Navigation(field => field.PricingRules).UsePropertyAccessMode(PropertyAccessMode.Field);

        builder.ToTable(table =>
        {
            table.HasCheckConstraint("CK_Fields_MinimumBookingMinutes_Positive", "MinimumBookingMinutes > 0");
            table.HasCheckConstraint("CK_Fields_SlotStepMinutes_Positive", "SlotStepMinutes > 0");
        });
    }
}
