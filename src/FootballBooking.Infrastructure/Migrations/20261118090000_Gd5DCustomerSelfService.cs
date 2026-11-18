using FootballBooking.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable
namespace FootballBooking.Infrastructure.Migrations;

[DbContext(typeof(ApplicationDbContext))]
[Migration("20261118090000_Gd5DCustomerSelfService")]
public sealed class Gd5DCustomerSelfService : Migration
{
    protected override void Up(MigrationBuilder m)
    {
        m.CreateTable("BookingRescheduleHistory", columns: t => new
        {
            Id = t.Column<Guid>(type:"char(36)", nullable:false),
            BookingId = t.Column<Guid>(type:"char(36)", nullable:false),
            ActorUserId = t.Column<Guid>(type:"char(36)", nullable:true),
            ViaGuestOtp = t.Column<bool>(type:"tinyint(1)", nullable:false),
            OldDate = t.Column<DateOnly>(type:"date", nullable:false),
            OldStartMinute = t.Column<int>(type:"int", nullable:false),
            OldEndMinute = t.Column<int>(type:"int", nullable:false),
            NewDate = t.Column<DateOnly>(type:"date", nullable:false),
            NewStartMinute = t.Column<int>(type:"int", nullable:false),
            NewEndMinute = t.Column<int>(type:"int", nullable:false),
            OldCourtAmount = t.Column<long>(type:"bigint", nullable:false),
            NewCourtAmount = t.Column<long>(type:"bigint", nullable:false),
            OldTotalAmount = t.Column<long>(type:"bigint", nullable:false),
            NewTotalAmount = t.Column<long>(type:"bigint", nullable:false),
            CreatedAtUtc = t.Column<DateTimeOffset>(type:"datetime", nullable:false)
        }, constraints: t => {
            t.PrimaryKey("PK_BookingRescheduleHistory", x => x.Id);
            t.ForeignKey("FK_BookingRescheduleHistory_Bookings_BookingId", x => x.BookingId,
                "Bookings", "Id", onDelete: ReferentialAction.Cascade);
        });
        m.CreateIndex("IX_BookingRescheduleHistory_BookingId_CreatedAtUtc", "BookingRescheduleHistory",
            new[] { "BookingId", "CreatedAtUtc" });
        m.CreateTable("RecurringBookingSeries", columns: t => new
        {
            Id = t.Column<Guid>(type:"char(36)", nullable:false),
            CustomerUserId = t.Column<Guid>(type:"char(36)", nullable:false),
            FieldId = t.Column<Guid>(type:"char(36)", nullable:false),
            FirstDate = t.Column<DateOnly>(type:"date", nullable:false),
            StartMinute = t.Column<int>(type:"int", nullable:false),
            DurationMinutes = t.Column<int>(type:"int", nullable:false),
            Weeks = t.Column<int>(type:"int", nullable:false),
            CreatedAtUtc = t.Column<DateTimeOffset>(type:"datetime", nullable:false)
        }, constraints: t => {
            t.PrimaryKey("PK_RecurringBookingSeries", x => x.Id);
            t.ForeignKey("FK_RecurringBookingSeries_Fields_FieldId", x => x.FieldId,
                "Fields", "Id", onDelete: ReferentialAction.Restrict);
        });
        m.CreateIndex("IX_RecurringBookingSeries_CustomerUserId_CreatedAtUtc", "RecurringBookingSeries",
            new[] { "CustomerUserId", "CreatedAtUtc" });
        m.CreateIndex("IX_RecurringBookingSeries_FieldId", "RecurringBookingSeries", "FieldId");
        m.CreateTable("RecurringBookingOccurrences", columns: t => new
        {
            Id = t.Column<Guid>(type:"char(36)", nullable:false),
            SeriesId = t.Column<Guid>(type:"char(36)", nullable:false),
            BookingDate = t.Column<DateOnly>(type:"date", nullable:false),
            BookingId = t.Column<Guid>(type:"char(36)", nullable:true),
            FailureReason = t.Column<string>(type:"varchar(300)", maxLength:300, nullable:true),
            CreatedAtUtc = t.Column<DateTimeOffset>(type:"datetime", nullable:false)
        }, constraints: t => {
            t.PrimaryKey("PK_RecurringBookingOccurrences", x => x.Id);
            t.ForeignKey("FK_RecurringBookingOccurrences_RecurringBookingSeries_SeriesId",
                x => x.SeriesId, "RecurringBookingSeries", "Id", onDelete: ReferentialAction.Cascade);
            t.ForeignKey("FK_RecurringBookingOccurrences_Bookings_BookingId",
                x => x.BookingId, "Bookings", "Id", onDelete: ReferentialAction.Restrict);
        });
        m.CreateIndex("IX_RecurringBookingOccurrences_BookingId", "RecurringBookingOccurrences", "BookingId", unique:true);
        m.CreateIndex("IX_RecurringBookingOccurrences_SeriesId_BookingDate", "RecurringBookingOccurrences",
            new[] { "SeriesId", "BookingDate" }, unique:true);
        m.CreateTable("GuestBookingOtpChallenges", columns: t => new
        {
            BookingId = t.Column<Guid>(type:"char(36)", nullable:false),
            PhoneNormalized = t.Column<string>(type:"varchar(30)", maxLength:30, nullable:false),
            ProtectedCode = t.Column<string>(type:"varchar(1000)", maxLength:1000, nullable:false),
            SentAtUtc = t.Column<DateTimeOffset>(type:"datetime", nullable:false),
            ExpiresAtUtc = t.Column<DateTimeOffset>(type:"datetime", nullable:false),
            Attempts = t.Column<int>(type:"int", nullable:false)
        }, constraints: t => {
            t.PrimaryKey("PK_GuestBookingOtpChallenges", x => x.BookingId);
            t.ForeignKey("FK_GuestBookingOtpChallenges_Bookings_BookingId", x => x.BookingId,
                "Bookings", "Id", onDelete: ReferentialAction.Cascade);
        });
    }
    protected override void Down(MigrationBuilder m)
    {
        m.DropTable("GuestBookingOtpChallenges");
        m.DropTable("RecurringBookingOccurrences");
        m.DropTable("BookingRescheduleHistory");
        m.DropTable("RecurringBookingSeries");
    }
}
