using FootballBooking.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FootballBooking.Infrastructure.Migrations;

[DbContext(typeof(ApplicationDbContext))]
[Migration("20261111000100_Gd2PaymentAttempts")]
public sealed class Gd2PaymentAttempts : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "PaymentAttempts",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "char(36)", nullable: false),
                BookingId = table.Column<Guid>(type: "char(36)", nullable: false),
                Method = table.Column<int>(type: "int", nullable: false),
                Amount = table.Column<long>(type: "bigint", nullable: false),
                RequestCode = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false),
                Status = table.Column<int>(type: "int", nullable: false),
                ExternalReference = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true),
                ReportedAmount = table.Column<long>(type: "bigint", nullable: true),
                Note = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true),
                VerifiedByUserId = table.Column<Guid>(type: "char(36)", nullable: true),
                ExpiresAtUtc = table.Column<DateTimeOffset>(type: "datetime", nullable: false),
                CreatedAtUtc = table.Column<DateTimeOffset>(type: "datetime", nullable: false),
                UpdatedAtUtc = table.Column<DateTimeOffset>(type: "datetime", nullable: false),
                ProcessedAtUtc = table.Column<DateTimeOffset>(type: "datetime", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_PaymentAttempts", x => x.Id);
                table.ForeignKey("FK_PaymentAttempts_Bookings_BookingId", x => x.BookingId,
                    "Bookings", "Id", onDelete: ReferentialAction.Restrict);
            })
            .Annotation("MySQL:Charset", "utf8mb4");

        migrationBuilder.CreateIndex("IX_PaymentAttempts_BookingId_Status", "PaymentAttempts", new[] { "BookingId", "Status" });
        migrationBuilder.CreateIndex("IX_PaymentAttempts_CreatedAtUtc", "PaymentAttempts", "CreatedAtUtc");
        migrationBuilder.CreateIndex("IX_PaymentAttempts_ExternalReference", "PaymentAttempts", "ExternalReference", unique: true);
        migrationBuilder.CreateIndex("IX_PaymentAttempts_RequestCode", "PaymentAttempts", "RequestCode", unique: true);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
        => migrationBuilder.DropTable(name: "PaymentAttempts");
}
