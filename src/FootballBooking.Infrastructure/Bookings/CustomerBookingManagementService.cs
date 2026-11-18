using FootballBooking.Application.Bookings;
using FootballBooking.Application.Common.Time;
using FootballBooking.Domain.Bookings;
using FootballBooking.Domain.Fields;
using FootballBooking.Domain.Payments;
using FootballBooking.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FootballBooking.Infrastructure.Bookings;

public sealed class CustomerBookingManagementService(
    ApplicationDbContext db, IBookingService bookings, IBookingWriteLock writeLock,
    ISystemClock clock, BookingPolicyOptions policy) : ICustomerBookingManagementService
{
    private static readonly TimeSpan LockTimeout = TimeSpan.FromSeconds(5);
    private static readonly TimeZoneInfo VietnamZone = ResolveVietnamZone();

    public async Task<ReschedulePreview> PreviewAsync(RescheduleRequest request, CancellationToken ct = default)
    {
        var booking = await db.Bookings.AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == request.BookingId, ct);
        return await EvaluateAsync(booking, request, ct);
    }

    public async Task<RescheduleOutcome> RescheduleAsync(RescheduleRequest request, CancellationToken ct = default)
    {
        var original = await db.Bookings.AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == request.BookingId, ct);
        if (original is null) return RescheduleOutcome.Fail("Không tìm thấy booking.");

        // Both dates use the same lock key as GĐ5-A booking creation. Always sort keys to avoid deadlocks.
        var dates = new[] { original.BookingDate, request.NewDate }.Distinct().OrderBy(x => x).ToArray();
        var acquired = new List<IAsyncDisposable>();
        try
        {
            foreach (var date in dates)
            {
                var handle = await writeLock.TryAcquireAsync(original.FieldId, date, LockTimeout, ct);
                if (handle is null) return RescheduleOutcome.Fail("Lịch sân đang thay đổi, vui lòng thử lại.");
                acquired.Add(handle);
            }

            var booking = await db.Bookings.FirstOrDefaultAsync(x => x.Id == request.BookingId, ct);
            if (booking is null || booking.FieldId != original.FieldId || booking.BookingDate != original.BookingDate
                || booking.StartMinute != original.StartMinute || booking.EndMinute != original.EndMinute
                || booking.UpdatedAtUtc != original.UpdatedAtUtc)
                return RescheduleOutcome.Fail("Booking đã thay đổi; vui lòng tải lại trang.");

            var preview = await EvaluateAsync(booking, request, ct);
            if (!preview.Succeeded) return new RescheduleOutcome(false, preview.Errors);
            if (request.ExpectedNewTotalAmount is null || preview.NewTotal != request.ExpectedNewTotalAmount)
                return RescheduleOutcome.Fail("Báo giá đã thay đổi. Hãy xem lại báo giá và xác nhận lại.");

            var audit = new BookingRescheduleHistory(Guid.NewGuid(), booking.Id,
                request.CustomerUserId, request.VerifiedGuest,
                booking.BookingDate, booking.StartMinute, booking.EndMinute,
                request.NewDate, request.NewStartMinute, request.NewStartMinute + request.DurationMinutes,
                booking.CourtAmount, preview.NewCourt, booking.TotalAmount, preview.NewTotal, clock.UtcNow);
            booking.Reschedule(request.NewDate, request.NewStartMinute,
                request.NewStartMinute + request.DurationMinutes, preview.NewCourt, clock.UtcNow);
            // Old unpaid payment instructions may no longer match the post-change balance.
            // Payment confirmation takes the original field/date lock as well.
            var openAttempts = await db.PaymentAttempts
                .Where(x => x.BookingId == booking.Id && x.Status == PaymentAttemptStatus.Pending)
                .ToListAsync(ct);
            foreach (var attempt in openAttempts) attempt.Cancel(clock.UtcNow);
            db.BookingRescheduleHistory.Add(audit);
            await db.SaveChangesAsync(ct);
            return RescheduleOutcome.Ok();
        }
        finally
        {
            for (var i = acquired.Count - 1; i >= 0; i--) await acquired[i].DisposeAsync();
        }
    }

    private async Task<ReschedulePreview> EvaluateAsync(Booking? booking, RescheduleRequest input, CancellationToken ct)
    {
        if (booking is null || !OwnedBy(booking, input.CustomerUserId, input.VerifiedGuest))
            return ReschedulePreview.Fail("Không tìm thấy booking hoặc chưa có quyền đổi lịch.");
        if (booking.Status != BookingStatus.Confirmed)
            return ReschedulePreview.Fail("Chỉ đổi được lịch đã xác nhận và chưa check-in.");
        if (booking.PromoCodeId is not null)
            return ReschedulePreview.Fail("Booking có khuyến mãi cần nhân viên đối soát trước khi đổi lịch.");
        if (input.DurationMinutes != booking.EndMinute - booking.StartMinute)
            return ReschedulePreview.Fail("Đổi lịch phải giữ nguyên thời lượng; vui lòng liên hệ nhân viên nếu cần thay đổi.");
        if (input.DurationMinutes is not (60 or 90 or 120))
            return ReschedulePreview.Fail("Chỉ hỗ trợ các lượt 60, 90 hoặc 120 phút.");
        if (input.NewStartMinute < 0 || input.NewStartMinute + input.DurationMinutes > 1440)
            return ReschedulePreview.Fail("Khung giờ mới không hợp lệ.");
        if (input.NewDate == booking.BookingDate && input.NewStartMinute == booking.StartMinute)
            return ReschedulePreview.Fail("Khung giờ mới trùng với lịch hiện tại.");

        var now = clock.UtcNow;
        var oldStart = ToUtc(booking.BookingDate, booking.StartMinute);
        var newStart = ToUtc(input.NewDate, input.NewStartMinute);
        if (oldStart <= now.AddHours(Math.Max(1, policy.RescheduleCutoffHours)))
            return ReschedulePreview.Fail("Đã quá thời hạn tự đổi lịch; vui lòng liên hệ nhân viên.");
        if (newStart <= now.AddHours(Math.Max(1, policy.RescheduleCutoffHours)))
            return ReschedulePreview.Fail("Giờ mới cần cách hiện tại ít nhất thời hạn đổi lịch.");
        if (input.NewDate > DateOnly.FromDateTime(TimeZoneInfo.ConvertTime(now, VietnamZone).DateTime).AddMonths(6))
            return ReschedulePreview.Fail("Chỉ hỗ trợ đổi lịch trong 6 tháng tới.");
        var changeCount = await db.BookingRescheduleHistory.CountAsync(x => x.BookingId == booking.Id, ct);
        if (changeCount >= Math.Clamp(policy.MaxCustomerReschedules, 1, 5))
            return ReschedulePreview.Fail("Đã vượt số lần tự đổi lịch. Vui lòng liên hệ nhân viên.");

        var field = await db.Fields.AsNoTracking()
            .Include(x => x.Zone).Include(x => x.OperatingHours).Include(x => x.Blocks)
            .FirstOrDefaultAsync(x => x.Id == booking.FieldId, ct);
        if (field is null || field.Status != FieldStatus.Active || field.Zone is { IsActive: false })
            return ReschedulePreview.Fail("Sân hoặc khu hiện không nhận đặt mới.");
        if (input.NewStartMinute % field.SlotStepMinutes != 0 ||
            input.DurationMinutes < field.MinimumBookingMinutes || input.DurationMinutes % field.SlotStepMinutes != 0)
            return ReschedulePreview.Fail("Thời lượng hoặc bước giờ không phù hợp sân.");
        var hour = field.OperatingHours.FirstOrDefault(x => x.DayOfWeek == (int)input.NewDate.DayOfWeek);
        if (hour is null || hour.IsClosed || hour.OpenMinute is null || hour.CloseMinute is null ||
            input.NewStartMinute < hour.OpenMinute || input.NewStartMinute + input.DurationMinutes > hour.CloseMinute)
            return ReschedulePreview.Fail("Giờ mới nằm ngoài giờ hoạt động của sân.");
        var end = input.NewStartMinute + input.DurationMinutes;
        if (field.Blocks.Any(x => x.BlockDate == input.NewDate && input.NewStartMinute < x.EndMinute && end > x.StartMinute))
            return ReschedulePreview.Fail("Giờ mới bị khóa do bảo trì hoặc sự kiện.");
        var rivals = await db.Bookings.AsNoTracking()
            .Where(x => x.FieldId == booking.FieldId && x.BookingDate == input.NewDate && x.Id != booking.Id)
            .ToListAsync(ct);
        if (rivals.Any(x => x.BlocksAvailability(now) && x.Overlaps(input.NewDate, input.NewStartMinute, end)))
            return ReschedulePreview.Fail("Khung giờ mới đã được giữ hoặc xác nhận.");

        var price = await bookings.GetPricingQuoteAsync(booking.FieldId, input.NewDate, input.NewStartMinute, end, ct);
        if (price is null) return ReschedulePreview.Fail("Chưa có bảng giá đầy đủ cho giờ mới.");
        var newTotal = checked(booking.TotalAmount - booking.CourtAmount + price.CourtAmount);
        var netReceived = booking.PaidAmount - booking.RefundedAmount;
        if (newTotal < netReceived)
            return ReschedulePreview.Fail("Lịch mới cần hoàn tiền; nhân viên phải xử lý thủ công trước.");
        if (netReceived < BookingDepositPolicy.RequiredAmount(newTotal, policy))
            return ReschedulePreview.Fail("Tiền cọc hiện tại chưa đủ cho giá mới; vui lòng liên hệ nhân viên.");
        return new ReschedulePreview(true, booking.TotalAmount, newTotal,
            booking.CourtAmount, price.CourtAmount, []);
    }

    private static bool OwnedBy(Booking booking, Guid? userId, bool verifiedGuest)
        => (userId is not null && userId != Guid.Empty && booking.CustomerUserId == userId)
            || (verifiedGuest && userId is null && booking.Source == BookingSource.GuestWeb && booking.CustomerUserId is null);

    private static DateTimeOffset ToUtc(DateOnly day, int minute)
    {
        var local = day.ToDateTime(TimeOnly.MinValue).AddMinutes(minute);
        return new DateTimeOffset(TimeZoneInfo.ConvertTimeToUtc(local, VietnamZone), TimeSpan.Zero);
    }
    private static TimeZoneInfo ResolveVietnamZone()
    {
        try { return TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh"); }
        catch (TimeZoneNotFoundException) { return TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"); }
    }

    public async Task<RecurringOutcome> CreateRecurringAsync(RecurringRequest request, CancellationToken ct = default)
    {
        if (request.SeriesId == Guid.Empty || request.CustomerUserId == Guid.Empty || request.FieldId == Guid.Empty)
            return RecurringOutcome.Fail("Yêu cầu chuỗi đặt sân không hợp lệ.");
        var earlier = await db.RecurringBookingSeries.AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == request.SeriesId, ct);
        if (earlier is not null)
            return earlier.CustomerUserId == request.CustomerUserId
                ? RecurringOutcome.Ok(earlier.Id) : RecurringOutcome.Fail("Yêu cầu không thuộc tài khoản.");
        if (request.Weeks < 2 || request.Weeks > Math.Clamp(policy.MaxRecurringWeeks, 2, 12)
            || request.DurationMinutes is not (60 or 90 or 120)
            || request.StartMinute < 0 || request.StartMinute + request.DurationMinutes > 1440
            || string.IsNullOrWhiteSpace(request.CustomerName) || string.IsNullOrWhiteSpace(request.CustomerPhone))
            return RecurringOutcome.Fail("Chu kỳ, giờ, thời lượng hoặc thông tin khách không hợp lệ.");
        var today = DateOnly.FromDateTime(TimeZoneInfo.ConvertTime(clock.UtcNow, VietnamZone).DateTime);
        if (request.FirstDate < today || request.FirstDate > today.AddDays(90)
            || ToUtc(request.FirstDate, request.StartMinute) <= clock.UtcNow.AddMinutes(30))
            return RecurringOutcome.Fail("Buổi đầu phải ở tương lai và trong 90 ngày tới.");
        var series = new RecurringBookingSeries(request.SeriesId, request.CustomerUserId,
            request.FieldId, request.FirstDate, request.StartMinute, request.DurationMinutes,
            request.Weeks, clock.UtcNow);
        db.RecurringBookingSeries.Add(series);
        await db.SaveChangesAsync(ct);
        // Each occurrence independently uses the GD5-A lock and existing payment-hold policy.
        for (var week = 0; week < request.Weeks; week++)
        {
            var date = request.FirstDate.AddDays(7 * week);
            var create = await bookings.CreateBookingAsync(new BookingCreateCommand(
                request.FieldId, date, request.StartMinute, request.StartMinute + request.DurationMinutes,
                request.CustomerName, request.CustomerPhone, request.CustomerEmail,
                "Đặt định kỳ: " + request.SeriesId.ToString("N"),
                BookingSource.CustomerAccount, null, null, null,
                request.CustomerUserId), ct);
            db.RecurringBookingOccurrences.Add(new RecurringBookingOccurrence(Guid.NewGuid(),
                series.Id, date, create.Succeeded ? create.BookingId : null,
                create.Succeeded ? null : string.Join(" ", create.Errors), clock.UtcNow));
            await db.SaveChangesAsync(ct);
        }
        return RecurringOutcome.Ok(series.Id);
    }

    public async Task<RecurringSeriesDto?> GetSeriesAsync(Guid seriesId, Guid customerUserId, CancellationToken ct = default)
    {
        var series = await db.RecurringBookingSeries.AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == seriesId && x.CustomerUserId == customerUserId, ct);
        if (series is null) return null;
        var items = await db.RecurringBookingOccurrences.AsNoTracking()
            .Where(x => x.SeriesId == seriesId).OrderBy(x => x.BookingDate).ToListAsync(ct);
        var ids = items.Where(x => x.BookingId.HasValue).Select(x => x.BookingId!.Value).ToArray();
        var codes = await db.Bookings.AsNoTracking().Where(x => ids.Contains(x.Id))
            .Select(x => new { x.Id, x.BookingCode }).ToDictionaryAsync(x => x.Id, x => x.BookingCode, ct);
        return new RecurringSeriesDto(series.Id, series.FieldId, series.FirstDate,
            series.StartMinute, series.DurationMinutes, series.Weeks,
            items.Select(x => new RecurringOccurrenceDto(x.BookingDate,
                x.BookingId is Guid bookingId && codes.TryGetValue(bookingId, out var code) ? code : null,
                x.FailureReason)).ToArray());
    }

    public async Task<IReadOnlyList<RecurringSeriesSummaryDto>> ListSeriesAsync(Guid customerUserId, CancellationToken ct = default)
    {
        var series = await db.RecurringBookingSeries.AsNoTracking()
            .Where(x => x.CustomerUserId == customerUserId)
            .OrderByDescending(x => x.CreatedAtUtc).Take(50).ToListAsync(ct);
        var ids = series.Select(x => x.Id).ToArray();
        var occurrences = await db.RecurringBookingOccurrences.AsNoTracking()
            .Where(x => ids.Contains(x.SeriesId)).ToListAsync(ct);
        return series.Select(x => new RecurringSeriesSummaryDto(x.Id, x.FirstDate, x.Weeks,
            occurrences.Count(y => y.SeriesId == x.Id && y.BookingId is not null),
            occurrences.Count(y => y.SeriesId == x.Id))).ToArray();
    }
}
