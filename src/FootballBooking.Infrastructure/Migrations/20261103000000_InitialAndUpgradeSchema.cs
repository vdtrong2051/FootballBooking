using FootballBooking.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FootballBooking.Infrastructure.Migrations;

[DbContext(typeof(ApplicationDbContext))]
[Migration("20261103000000_InitialAndUpgradeSchema")]
public partial class InitialAndUpgradeSchema : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<Guid>(
            name: "CustomerUserId",
            table: "Bookings",
            type: "TEXT",
            nullable: true);

        migrationBuilder.AddColumn<long>(
            name: "BaseSalary",
            table: "AspNetUsers",
            type: "INTEGER",
            nullable: false,
            defaultValue: 0L);

        migrationBuilder.AddColumn<long>(
            name: "HourlyRate",
            table: "AspNetUsers",
            type: "INTEGER",
            nullable: false,
            defaultValue: 0L);

        migrationBuilder.AddColumn<int>(
            name: "StandardHoursPerMonth",
            table: "AspNetUsers",
            type: "INTEGER",
            nullable: false,
            defaultValue: 160);

        migrationBuilder.AddColumn<decimal>(
            name: "CommissionPercent",
            table: "AspNetUsers",
            type: "decimal(5,2)",
            precision: 5,
            scale: 2,
            nullable: false,
            defaultValue: 0m);

        migrationBuilder.CreateIndex(
            name: "IX_Bookings_CustomerUserId_BookingDate",
            table: "Bookings",
            columns: ["CustomerUserId", "BookingDate"]);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropIndex(
            name: "IX_Bookings_CustomerUserId_BookingDate",
            table: "Bookings");

        migrationBuilder.DropColumn(
            name: "CustomerUserId",
            table: "Bookings");

        migrationBuilder.DropColumn(
            name: "BaseSalary",
            table: "AspNetUsers");

        migrationBuilder.DropColumn(
            name: "HourlyRate",
            table: "AspNetUsers");

        migrationBuilder.DropColumn(
            name: "StandardHoursPerMonth",
            table: "AspNetUsers");

        migrationBuilder.DropColumn(
            name: "CommissionPercent",
            table: "AspNetUsers");
    }
}
