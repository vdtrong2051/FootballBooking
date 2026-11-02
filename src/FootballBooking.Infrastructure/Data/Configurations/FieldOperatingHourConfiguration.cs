using FootballBooking.Domain.Fields;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FootballBooking.Infrastructure.Data.Configurations;

public sealed class FieldOperatingHourConfiguration : IEntityTypeConfiguration<FieldOperatingHour>
{
    public void Configure(EntityTypeBuilder<FieldOperatingHour> builder)
    {
        builder.ToTable("FieldOperatingHours");
        builder.HasKey(hour => hour.Id);
        builder.HasIndex(hour => new { hour.FieldId, hour.DayOfWeek }).IsUnique();

        builder.ToTable(table =>
        {
            table.HasCheckConstraint("CK_FieldOperatingHours_DayOfWeek", "DayOfWeek >= 0 AND DayOfWeek <= 6");
            table.HasCheckConstraint("CK_FieldOperatingHours_Minutes", "IsClosed = 1 OR (OpenMinute IS NOT NULL AND CloseMinute IS NOT NULL AND OpenMinute >= 0 AND OpenMinute < CloseMinute AND CloseMinute <= 1440)");
        });
    }
}
