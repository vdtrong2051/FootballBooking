using FootballBooking.Domain.Fields;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FootballBooking.Infrastructure.Data.Configurations;

public sealed class PricingRuleConfiguration : IEntityTypeConfiguration<PricingRule>
{
    public void Configure(EntityTypeBuilder<PricingRule> builder)
    {
        builder.ToTable("PricingRules");
        builder.HasKey(rule => rule.Id);
        builder.Property(rule => rule.Name).HasMaxLength(150).IsRequired();
        builder.Property(rule => rule.RuleType).HasConversion<int>().IsRequired();
        builder.HasIndex(rule => new { rule.FieldId, rule.EffectiveFrom, rule.EffectiveTo, rule.IsActive });
        builder.HasIndex(rule => new { rule.FieldId, rule.SpecificDate });
        builder.HasIndex(rule => new { rule.FieldId, rule.DayOfWeek, rule.StartMinute, rule.EndMinute });

        builder.ToTable(table =>
        {
            table.HasCheckConstraint("CK_PricingRules_Minutes", "StartMinute >= 0 AND StartMinute < EndMinute AND EndMinute <= 1440");
            table.HasCheckConstraint("CK_PricingRules_Price", "PricePerHour >= 0");
            table.HasCheckConstraint("CK_PricingRules_EffectiveTo", "EffectiveTo IS NULL OR EffectiveTo >= EffectiveFrom");
        });
    }
}
