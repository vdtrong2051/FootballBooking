using FootballBooking.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FootballBooking.Infrastructure.Migrations;

[DbContext(typeof(ApplicationDbContext))]
[Migration("20261118090000_Gd5BOperations")]
public sealed class Gd5BOperations : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "BookingSessions",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "char(36)", nullable: false),
                BookingId = table.Column<Guid>(type: "char(36)", nullable: false),
                OriginalEndMinute = table.Column<int>(type: "int", nullable: false),
                EffectiveEndMinute = table.Column<int>(type: "int", nullable: false),
                CheckedInAtUtc = table.Column<DateTimeOffset>(type: "datetime", nullable: false),
                CheckedInByUserId = table.Column<Guid>(type: "char(36)", nullable: false),
                CheckedInByName = table.Column<string>(type: "varchar(120)", maxLength: 120, nullable: false),
                CheckedInByRole = table.Column<string>(type: "varchar(16)", maxLength: 16, nullable: false),
                StartedAtUtc = table.Column<DateTimeOffset>(type: "datetime", nullable: true),
                StartedByUserId = table.Column<Guid>(type: "char(36)", nullable: true),
                StartedByName = table.Column<string>(type: "varchar(120)", maxLength: 120, nullable: true),
                StartedByRole = table.Column<string>(type: "varchar(16)", maxLength: 16, nullable: true),
                EndedAtUtc = table.Column<DateTimeOffset>(type: "datetime", nullable: true),
                EndedByUserId = table.Column<Guid>(type: "char(36)", nullable: true),
                EndedByName = table.Column<string>(type: "varchar(120)", maxLength: 120, nullable: true),
                EndedByRole = table.Column<string>(type: "varchar(16)", maxLength: 16, nullable: true),
                OvertimeRatePerHour = table.Column<long>(type: "bigint", nullable: false),
                GraceMinutes = table.Column<int>(type: "int", nullable: false),
                BillingStepMinutes = table.Column<int>(type: "int", nullable: false),
                OvertimeMinutes = table.Column<int>(type: "int", nullable: false),
                BilledOvertimeMinutes = table.Column<int>(type: "int", nullable: false),
                OvertimeAmount = table.Column<long>(type: "bigint", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_BookingSessions", x => x.Id);
                table.ForeignKey("FK_BookingSessions_Bookings_BookingId", x => x.BookingId,
                    "Bookings", "Id", onDelete: ReferentialAction.Restrict);
            })
            .Annotation("MySQL:Charset", "utf8mb4");

        migrationBuilder.CreateTable(
            name: "BookingExtraCharges",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "char(36)", nullable: false),
                BookingId = table.Column<Guid>(type: "char(36)", nullable: false),
                Kind = table.Column<int>(type: "int", nullable: false),
                FromMinute = table.Column<int>(type: "int", nullable: false),
                ToMinute = table.Column<int>(type: "int", nullable: false),
                BilledMinutes = table.Column<int>(type: "int", nullable: false),
                RatePerHour = table.Column<long>(type: "bigint", nullable: false),
                Amount = table.Column<long>(type: "bigint", nullable: false),
                Note = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false),
                ActorUserId = table.Column<Guid>(type: "char(36)", nullable: false),
                CreatedAtUtc = table.Column<DateTimeOffset>(type: "datetime", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_BookingExtraCharges", x => x.Id);
                table.ForeignKey("FK_BookingExtraCharges_Bookings_BookingId", x => x.BookingId,
                    "Bookings", "Id", onDelete: ReferentialAction.Restrict);
            })
            .Annotation("MySQL:Charset", "utf8mb4");

        migrationBuilder.CreateIndex("IX_BookingSessions_BookingId", "BookingSessions", "BookingId", unique: true);
        migrationBuilder.CreateIndex("IX_BookingExtraCharges_BookingId_Kind", "BookingExtraCharges", new[] { "BookingId", "Kind" });
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "BookingExtraCharges");
        migrationBuilder.DropTable(name: "BookingSessions");
    }
}
