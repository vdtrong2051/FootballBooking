using FootballBooking.Domain.Fields;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FootballBooking.Infrastructure.Data.Configurations;

public sealed class FieldBlockConfiguration : IEntityTypeConfiguration<FieldBlock>
{
    public void Configure(EntityTypeBuilder<FieldBlock> builder)
    {
        builder.ToTable("FieldBlocks");
        builder.HasKey(block => block.Id);
        builder.Property(block => block.BlockType).HasConversion<int>().IsRequired();
        builder.Property(block => block.Reason).HasMaxLength(500).IsRequired();
        builder.HasIndex(block => new { block.FieldId, block.BlockDate, block.StartMinute, block.EndMinute });

        builder.ToTable(table =>
        {
            table.HasCheckConstraint("CK_FieldBlocks_Minutes", "StartMinute >= 0 AND StartMinute < EndMinute AND EndMinute <= 1440");
        });
    }
}
