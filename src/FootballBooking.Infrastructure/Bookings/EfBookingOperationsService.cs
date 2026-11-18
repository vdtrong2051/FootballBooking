using FootballBooking.Application.Bookings;
using FootballBooking.Application.Common.Time;
using FootballBooking.Domain.Bookings;
using FootballBooking.Domain.Fields;
using FootballBooking.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FootballBooking.Infrastructure.Bookings;

/// <summary>
/// GĐ5-B operational write model. All transitions and monetary changes are
/// serialized by the same field/day MySQL named lock as booking/payment creation.
/// </summary>
public sealed class EfBookingOperationsService(
    ApplicationDbContext db,
    IBookingWriteLock writeLock,
    IBookingService bookingService,
    ISystemClock clock,
    BookingPolicyOptions policy) : IBookingOperationsService
{
    private static readonly TimeSpan LockTimeout = TimeSpan.FromSeconds(5);

    public async Task<BookingCommandResult> CheckInAsync(Guid bookingId, BookingOperator actor, CancellationToken ct = default)
    {
        if (!actor.IsValid) return InvalidActor();
        var info = await LookupAsync(bookingId, ct);
        if (info is null) return Missing();
        await using var held = await writeLock.TryAcquireAsync(info.Value.FieldId, info.Value.Day, LockTimeout, ct);
        if (held is null) return Busy();
        var booking = await db.Bookings.FirstAsync(x => x.Id == bookingId, ct);
        if (booking.Status != BookingStatus.Confirmed)
            return Reject("Chỉ booking đã xác nhận mới được check-in; không ghi trùng lượt đến.");
        if (await db.BookingSessions.AnyAsync(x => x.BookingId == bookingId, ct))
            return Reject("Booking đã có check-in; không được ghi đè thời gian thực tế.");
        var now = clock.UtcNow;
        var scheduledStart = booking.BookingDate.ToDateTime(TimeOnly.MinValue).AddMinutes(booking.StartMinute);
        var localNow = TimeZoneInfo.ConvertTime(now, VietnamTimeZone()).DateTime;
        if (localNow < scheduledStart.AddMinutes(-policy.CheckInEarlyMinutes)
            || localNow > scheduledStart.AddMinutes(policy.CheckInLateMinutes))
            return Reject($"Chỉ được check-in từ {policy.CheckInEarlyMinutes} phút trước đến {policy.CheckInLateMinutes} phút sau giờ đặt.");

        var tailStart = Math.Max(booking.StartMinute, booking.EndMinute - 30);
        var quote = await bookingService.GetPricingQuoteAsync(booking.FieldId,
            booking.BookingDate, tailStart, booking.EndMinute, ct);
        var snapshotRate = quote?.Segments.LastOrDefault()?.PricePerHour
            ?? checked((long)decimal.Ceiling(booking.CourtAmount * 60m / (booking.EndMinute - booking.StartMinute)));
        var session = new BookingSession(Guid.NewGuid(), booking.Id, booking.EndMinute,
            snapshotRate, policy.OvertimeGraceMinutes, policy.OvertimeBillingStepMinutes,
            now, actor.UserId, actor.DisplayName, actor.Role);
        booking.MarkCheckedIn(now);
        db.BookingSessions.Add(session);
        await db.SaveChangesAsync(ct);
        return BookingCommandResult.Success(booking.BookingCode, booking.Id);
    }

    public async Task<BookingCommandResult> StartAsync(Guid bookingId, BookingOperator actor, CancellationToken ct = default)
    {
        if (!actor.IsValid) return InvalidActor();
        var info = await LookupAsync(bookingId, ct);
        if (info is null) return Missing();
        await using var held = await writeLock.TryAcquireAsync(info.Value.FieldId, info.Value.Day, LockTimeout, ct);
        if (held is null) return Busy();
        var booking = await db.Bookings.FirstAsync(x => x.Id == bookingId, ct);
        var session = await db.BookingSessions.FirstOrDefaultAsync(x => x.BookingId == bookingId, ct);
        if (booking.Status != BookingStatus.CheckedIn || session is null || session.StartedAtUtc is not null)
            return Reject("Phải check-in hợp lệ trước khi bắt đầu; không thể bắt đầu hai lần.");
        var now = clock.UtcNow;
        var localNow = TimeZoneInfo.ConvertTime(now, VietnamTimeZone()).DateTime;
        var end = booking.BookingDate.ToDateTime(TimeOnly.MinValue).AddMinutes(booking.EndMinute);
        if (localNow > end.AddMinutes(policy.MaxLateStartMinutes))
            return Reject("Đã quá muộn để bắt đầu ca theo lịch. Cần nhân viên điều phối xử lý.");
        session.Start(now, actor.UserId, actor.DisplayName, actor.Role);
        booking.Start(now);
        await db.SaveChangesAsync(ct);
        return BookingCommandResult.Success(booking.BookingCode, booking.Id);
    }

    public async Task<BookingCommandResult> ExtendAsync(Guid bookingId, int newEndMinute,
        BookingOperator actor, CancellationToken ct = default)
    {
        if (!actor.IsValid) return InvalidActor();
        var info = await LookupAsync(bookingId, ct);
        if (info is null) return Missing();
        await using var held = await writeLock.TryAcquireAsync(info.Value.FieldId, info.Value.Day, LockTimeout, ct);
        if (held is null) return Busy();
        var booking = await db.Bookings.FirstAsync(x => x.Id == bookingId, ct);
        var session = await db.BookingSessions.FirstOrDefaultAsync(x => x.BookingId == bookingId, ct);
        if (booking.Status is not (BookingStatus.CheckedIn or BookingStatus.InProgress)
            || session is null || session.EndedAtUtc is not null)
            return Reject("Chỉ gia hạn lượt đã check-in và chưa kết thúc.");
        var oldEnd = booking.EndMinute;
        if (newEndMinute <= oldEnd || newEndMinute > 1440
            || newEndMinute - oldEnd > policy.MaximumExtensionMinutes)
            return Reject($"Giờ kết thúc mới phải lớn hơn giờ cũ và không gia hạn quá {policy.MaximumExtensionMinutes} phút/lần.");
        var now = clock.UtcNow;
        var localNow = TimeZoneInfo.ConvertTime(now, VietnamTimeZone()).DateTime;
        var previousEnd = booking.BookingDate.ToDateTime(TimeOnly.MinValue).AddMinutes(oldEnd);
        if (localNow > previousEnd.AddMinutes(policy.MaxLateStartMinutes))
            return Reject("Đã quá thời hạn gia hạn sau giờ kết thúc dự kiến; cần Owner đối soát.");
        var field = await db.Fields
            .Include(f => f.OperatingHours)
            .Include(f => f.Blocks)
            .FirstOrDefaultAsync(f => f.Id == booking.FieldId, ct);
        if (field is null || field.Status != FieldStatus.Active)
            return Reject("Sân đang đóng hoặc không còn hoạt động.");
        if (newEndMinute % field.SlotStepMinutes != 0)
            return Reject($"Giờ gia hạn phải theo bước {field.SlotStepMinutes} phút.");
        var hours = field.OperatingHours.FirstOrDefault(h => h.DayOfWeek == (int)booking.BookingDate.DayOfWeek);
        if (hours is null || hours.IsClosed || hours.CloseMinute is null
            || newEndMinute > hours.CloseMinute.Value)
            return Reject("Gia hạn vượt giờ đóng cửa của sân.");
        if (field.Blocks.Any(b => b.BlockDate == booking.BookingDate
            && oldEnd < b.EndMinute && newEndMinute > b.StartMinute))
            return Reject("Khoảng giờ gia hạn bị khóa vì bảo trì hoặc sự kiện.");
        var otherBookings = await db.Bookings
            .Where(x => x.FieldId == booking.FieldId && x.BookingDate == booking.BookingDate && x.Id != bookingId)
            .ToListAsync(ct);
        if (otherBookings.Any(x => x.BlocksAvailability(now)
            && x.Overlaps(booking.BookingDate, oldEnd, newEndMinute)))
            return Reject("Gia hạn trùng booking khác hoặc lượt giữ sân đang còn hạn.");
        var quote = await bookingService.GetPricingQuoteAsync(booking.FieldId,
            booking.BookingDate, oldEnd, newEndMinute, ct);
        if (quote is null) return Reject("Chưa có bảng giá cho khung giờ gia hạn.");
        var lastRate = quote.Segments.Last().PricePerHour;
        booking.ExtendTo(newEndMinute, now);
        booking.AddOperationalCharge(quote.CourtAmount, now);
        session.Extend(newEndMinute, lastRate);
        db.BookingExtraCharges.Add(new BookingExtraCharge(Guid.NewGuid(), booking.Id,
            BookingExtraChargeKind.Extension, oldEnd, newEndMinute, newEndMinute - oldEnd,
            lastRate, quote.CourtAmount, "Phí gia hạn đã xác nhận", actor.UserId, now));
        await db.SaveChangesAsync(ct);
        return BookingCommandResult.Success(booking.BookingCode, booking.Id);
    }

    public async Task<BookingCommandResult> FinishAsync(Guid bookingId, BookingOperator actor, CancellationToken ct = default)
    {
        if (!actor.IsValid) return InvalidActor();
        var info = await LookupAsync(bookingId, ct);
        if (info is null) return Missing();
        await using var held = await writeLock.TryAcquireAsync(info.Value.FieldId, info.Value.Day, LockTimeout, ct);
        if (held is null) return Busy();
        var booking = await db.Bookings.FirstAsync(x => x.Id == bookingId, ct);
        var session = await db.BookingSessions.FirstOrDefaultAsync(x => x.BookingId == bookingId, ct);
        if (booking.Status != BookingStatus.InProgress || session?.StartedAtUtc is null
            || session.EndedAtUtc is not null)
            return Reject("Booking không đang sử dụng hoặc thiếu dữ liệu bắt đầu thực tế.");
        var now = clock.UtcNow;
        if (now < session.StartedAtUtc.Value)
            return Reject("Giờ kết thúc không được trước giờ bắt đầu thực tế.");
        var scheduledEnd = booking.BookingDate.ToDateTime(TimeOnly.MinValue).AddMinutes(booking.EndMinute);
        var localNow = TimeZoneInfo.ConvertTime(now, VietnamTimeZone()).DateTime;
        var overtime = Math.Max(0, (int)Math.Ceiling((localNow - scheduledEnd).TotalMinutes));
        if (overtime > policy.MaxAutoOvertimeMinutes)
            return Reject("Vượt giới hạn tính phí tự động. Cần Owner đối soát trước khi kết thúc ca.");
        var calculated = BookingOvertimePolicy.Calculate(overtime, session.OvertimeRatePerHour,
            session.GraceMinutes, session.BillingStepMinutes);
        if (calculated.Amount > 0)
        {
            booking.AddOperationalCharge(calculated.Amount, now);
            db.BookingExtraCharges.Add(new BookingExtraCharge(Guid.NewGuid(), booking.Id,
                BookingExtraChargeKind.Overtime, booking.EndMinute, booking.EndMinute,
                calculated.BilledMinutes, session.OvertimeRatePerHour, calculated.Amount,
                $"Quá giờ {calculated.OvertimeMinutes} phút; tính phí {calculated.BilledMinutes} phút",
                actor.UserId, now));
        }
        session.Finish(now, actor.UserId, actor.DisplayName, actor.Role,
            calculated.OvertimeMinutes, calculated.BilledMinutes, calculated.Amount);
        booking.Complete(now);
        await db.SaveChangesAsync(ct);
        return BookingCommandResult.Success(booking.BookingCode, booking.Id);
    }

    private async Task<(Guid FieldId, DateOnly Day)?> LookupAsync(Guid bookingId, CancellationToken ct)
    {
        var result = await db.Bookings.AsNoTracking().Where(x => x.Id == bookingId)
            .Select(x => new { x.FieldId, x.BookingDate }).FirstOrDefaultAsync(ct);
        return result is null ? null : (result.FieldId, result.BookingDate);
    }

    private static TimeZoneInfo VietnamTimeZone()
    {
        try { return TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh"); }
        catch (TimeZoneNotFoundException)
        { return TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"); }
    }

    private static BookingCommandResult InvalidActor()
        => Reject("Thao tác phải do Owner hoặc Staff đã xác thực thực hiện.");
    private static BookingCommandResult Missing()
        => Reject("Không tìm thấy booking.");
    private static BookingCommandResult Busy()
        => Reject("Sân đang được xử lý đồng thời; vui lòng thử lại.");
    private static BookingCommandResult Reject(string reason)
        => BookingCommandResult.Failure([reason]);
}
