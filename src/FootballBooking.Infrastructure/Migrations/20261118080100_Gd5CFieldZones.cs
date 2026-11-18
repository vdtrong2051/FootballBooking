using FootballBooking.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable
namespace FootballBooking.Infrastructure.Migrations;

[DbContext(typeof(ApplicationDbContext))]
[Migration("20261118080100_Gd5CFieldZones")]
public sealed class Gd5CFieldZones : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "FieldZones",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "char(36)", nullable: false),
                Code = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false),
                Name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                Description = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true),
                SortOrder = table.Column<int>(type: "int", nullable: false),
                IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                CreatedAtUtc = table.Column<DateTimeOffset>(type: "datetime", nullable: false),
                UpdatedAtUtc = table.Column<DateTimeOffset>(type: "datetime", nullable: false)
            },
            constraints: table => table.PrimaryKey("PK_FieldZones", x => x.Id));
        migrationBuilder.CreateIndex("IX_FieldZones_Code", "FieldZones", "Code", unique: true);
        migrationBuilder.AddColumn<Guid>(name: "ZoneId", table: "Fields", type: "char(36)", nullable: true);
        migrationBuilder.CreateIndex("IX_Fields_ZoneId", "Fields", "ZoneId");
        migrationBuilder.AddForeignKey("FK_Fields_FieldZones_ZoneId", "Fields", "ZoneId",
            "FieldZones", "Id", onDelete: ReferentialAction.Restrict);
    }
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropForeignKey("FK_Fields_FieldZones_ZoneId", "Fields");
        migrationBuilder.DropIndex("IX_Fields_ZoneId", "Fields");
        migrationBuilder.DropColumn("ZoneId", "Fields");
        migrationBuilder.DropTable("FieldZones");
    }
}
