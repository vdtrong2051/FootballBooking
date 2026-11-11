using FootballBooking.Application.Bookings;
using FootballBooking.Application.Common.Time;
using FootballBooking.Application.Payments;
using FootballBooking.Domain.Bookings;
using FootballBooking.Domain.Payments;
using FootballBooking.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;

namespace FootballBooking.Infrastructure.Payments;

/// <summary>All money-affecting transitions share the GĐ0 MySQL field/date named lock.</summary>
public sealed class EfPaymentAttemptService(
    ApplicationDbContext db,
    IBookingWriteLock bookingLock,
    ISystemClock clock,
    IOptions<PaymentOptions> options,
    IHostEnvironment environment) : IPaymentAttemptService
{
    private static readonly TimeSpan LockTimeout = TimeSpan.FromSeconds(5);

    public async Task<PaymentAttemptResult> StartAsync(Guid bookingId, PaymentMethod method, CancellationToken ct = default)
    {
        if (method is not (PaymentMethod.VietQr or PaymentMethod.BankTransfer or PaymentMethod.Cash
            or PaymentMethod.Card or PaymentMethod.MoMo or PaymentMethod.ZaloPay))
            return PaymentAttemptResult.Fail("Phương thức thanh toán không được hỗ trợ.");
        if ((method is PaymentMethod.MoMo or PaymentMethod.ZaloPay)
            && (!environment.IsDevelopment() || !options.Value.EnableDemoGateway))
            return PaymentAttemptResult.Fail("Ví điện tử chưa được kết nối; chỉ hỗ trợ sandbox nội bộ khi bật chế độ demo.");
        if ((method is PaymentMethod.VietQr or PaymentMethod.BankTransfer) && !options.Value.HasBankAccount)
            return PaymentAttemptResult.Fail("Chưa cấu hình thông tin ngân hàng để sinh VietQR.");

        var referenceBooking = await db.Bookings.AsNoTracking()
            .Where(x => x.Id == bookingId)
            .Select(x => new { x.FieldId, x.BookingDate })
            .FirstOrDefaultAsync(ct);
        if (referenceBooking is null) return PaymentAttemptResult.Fail("Không tìm thấy booking.");

        await using var lockHandle = await bookingLock.TryAcquireAsync(referenceBooking.FieldId,
            referenceBooking.BookingDate, LockTimeout, ct);
        if (lockHandle is null) return PaymentAttemptResult.Fail("Booking đang được xử lý, vui lòng thử lại.");

        var now = clock.UtcNow;
        var booking = await db.Bookings.FirstOrDefaultAsync(x => x.Id == bookingId, ct);
        if (booking is null) return PaymentAttemptResult.Fail("Không tìm thấy booking.");
        if (booking.ExpireIfNeeded(now))
        {
            await db.SaveChangesAsync(ct);
            return PaymentAttemptResult.Fail("Booking đã hết hạn giữ sân.");
        }
        if (booking.Status != BookingStatus.PendingPayment || booking.ExpiresAtUtc is null
            || booking.ExpiresAtUtc <= now)
            return PaymentAttemptResult.Fail("Booking không còn ở trạng thái chờ thanh toán.");

        var remaining = booking.TotalAmount - booking.PaidAmount + booking.RefundedAmount;
        if (remaining <= 0) return PaymentAttemptResult.Fail("Booking không còn số tiền cần thanh toán.");

        var existing = await db.PaymentAttempts
            .Where(x => x.BookingId == bookingId)
            .OrderByDescending(x => x.CreatedAtUtc).ToListAsync(ct);
        if (existing.Any(x => x.Status == PaymentAttemptStatus.NeedsReconciliation))
            return PaymentAttemptResult.Fail("Booking đang có khoản tiền cần đối soát; vui lòng liên hệ nhân viên.");
        foreach (var previous in existing)
        {
            previous.Expire(now);
            if (previous.IsLive(now) && previous.Method == method && previous.Amount == remaining)
            {
                await db.SaveChangesAsync(ct);
                return PaymentAttemptResult.Ok(ToDto(previous, booking.BookingCode));
            }
            previous.Cancel(now);
        }

        var attempt = new PaymentAttempt(Guid.NewGuid(), booking.Id, method, remaining,
            "FBPAY" + Guid.NewGuid().ToString("N")[..18].ToUpperInvariant(), booking.ExpiresAtUtc.Value, now);
        db.PaymentAttempts.Add(attempt);
        await db.SaveChangesAsync(ct);
        return PaymentAttemptResult.Ok(ToDto(attempt, booking.BookingCode));
    }

    public async Task<IReadOnlyList<PaymentAttemptDto>> ListForBookingAsync(Guid bookingId, CancellationToken ct = default)
    {
        var booking = await db.Bookings.AsNoTracking()
            .Where(x => x.Id == bookingId).Select(x => new { x.Id, x.BookingCode }).FirstOrDefaultAsync(ct);
        if (booking is null) return [];
        var attempts = await db.PaymentAttempts.AsNoTracking()
            .Where(x => x.BookingId == bookingId).OrderByDescending(x => x.CreatedAtUtc)
            .Take(20).ToListAsync(ct);
        return attempts.Select(x => ToDto(x, booking.BookingCode)).ToArray();
    }

    public async Task<IReadOnlyList<PaymentAttemptDto>> ListRecentAsync(int count = 100, CancellationToken ct = default)
    {
        count = Math.Clamp(count, 1, 200);
        var attempts = await db.PaymentAttempts.AsNoTracking()
            .OrderByDescending(x => x.CreatedAtUtc).Take(count).ToListAsync(ct);
        var bookingIds = attempts.Select(x => x.BookingId).Distinct().ToArray();
        var codes = await db.Bookings.AsNoTracking().Where(x => bookingIds.Contains(x.Id))
            .ToDictionaryAsync(x => x.Id, x => x.BookingCode, ct);
        return attempts.Select(x => ToDto(x, codes.GetValueOrDefault(x.BookingId) ?? "—")).ToArray();
    }

    /// <summary>Must be invoked only after trusted manual verification or authenticated demo webhook.</summary>
    public async Task<PaymentAttemptResult> ConfirmAsync(Guid attemptId, string reference,
        long receivedAmount, Guid? actorId, CancellationToken ct = default)
    {
        reference = reference?.Trim() ?? string.Empty;
        if (reference.Length is < 6 or > 100 || receivedAmount <= 0)
            return PaymentAttemptResult.Fail("Cần mã giao dịch hợp lệ và số tiền lớn hơn 0.");
        var target = await db.PaymentAttempts.AsNoTracking()
            .Where(x => x.Id == attemptId)
            .Select(x => new { x.BookingId }).FirstOrDefaultAsync(ct);
        if (target is null) return PaymentAttemptResult.Fail("Không tìm thấy payment attempt.");
        var info = await db.Bookings.AsNoTracking().Where(x => x.Id == target.BookingId)
            .Select(x => new { x.FieldId, x.BookingDate }).FirstOrDefaultAsync(ct);
        if (info is null) return PaymentAttemptResult.Fail("Không tìm thấy booking.");

        await using var lockHandle = await bookingLock.TryAcquireAsync(info.FieldId, info.BookingDate, LockTimeout, ct);
        if (lockHandle is null) return PaymentAttemptResult.Fail("Booking đang được xử lý, vui lòng thử lại.");

        var now = clock.UtcNow;
        var attempt = await db.PaymentAttempts.FirstAsync(x => x.Id == attemptId, ct);
        var booking = await db.Bookings.Include(x => x.Payments)
            .FirstAsync(x => x.Id == target.BookingId, ct);

        if (attempt.Status == PaymentAttemptStatus.Succeeded)
            return string.Equals(attempt.ExternalReference, reference, StringComparison.OrdinalIgnoreCase)
                && attempt.ReportedAmount == receivedAmount
                ? PaymentAttemptResult.Ok(ToDto(attempt, booking.BookingCode))
                : PaymentAttemptResult.Fail("Giao dịch đã được xác nhận bằng tham chiếu khác.");
        if (attempt.Status == PaymentAttemptStatus.NeedsReconciliation)
            return PaymentAttemptResult.Fail("Khoản tiền đang chờ xử lý thủ công; không thể tự xác nhận lại.");
        if (await db.PaymentAttempts.AnyAsync(x => x.Id != attempt.Id && x.ExternalReference == reference, ct)
            || await db.Payments.AnyAsync(x => x.TransactionCode == reference && x.Status == PaymentRecordStatus.Succeeded, ct))
            return PaymentAttemptResult.Fail("Mã giao dịch đã được ghi nhận trước đó.");

        if (attempt.Status is PaymentAttemptStatus.Cancelled or PaymentAttemptStatus.Failed)
        {
            attempt.FlagForReconciliation(reference, receivedAmount,
                "Tiền đến cho lần thử đã hủy/thất bại; cần đối soát hoặc hoàn tiền.", now);
            await db.SaveChangesAsync(ct);
            return PaymentAttemptResult.Ok(ToDto(attempt, booking.BookingCode));
        }

        var expired = booking.ExpireIfNeeded(now) || attempt.ExpiresAtUtc <= now
            || booking.Status == BookingStatus.Expired;
        if (expired || receivedAmount != attempt.Amount || booking.Status != BookingStatus.PendingPayment)
        {
            var reason = expired ? "Tiền đến sau khi hết hạn giữ sân; cần hoàn tiền/đối soát."
                : receivedAmount != attempt.Amount ? "Số tiền không khớp với booking; cần đối soát."
                : "Booking đã chuyển trạng thái; không tự xác nhận thanh toán.";
            attempt.FlagForReconciliation(reference, receivedAmount, reason, now);
            await db.SaveChangesAsync(ct);
            return PaymentAttemptResult.Ok(ToDto(attempt, booking.BookingCode));
        }

        var conflicts = await db.Bookings.Where(x => x.FieldId == booking.FieldId
            && x.BookingDate == booking.BookingDate && x.Id != booking.Id).ToListAsync(ct);
        if (conflicts.Any(x => x.BlocksAvailability(now)
            && x.Overlaps(booking.BookingDate, booking.StartMinute, booking.EndMinute)))
        {
            attempt.FlagForReconciliation(reference, receivedAmount,
                "Khung giờ đã được booking khác giữ/đặt; cần đối soát hoặc hoàn tiền.", now);
            await db.SaveChangesAsync(ct);
            return PaymentAttemptResult.Ok(ToDto(attempt, booking.BookingCode));
        }

        var payment = booking.RecordPayment(PaymentRecordType.Payment, attempt.Method, receivedAmount,
            PaymentRecordStatus.Succeeded, reference, "GĐ2: xác nhận dựa trên chứng từ đã kiểm tra",
            actorId, now);
        db.Payments.Add(payment);
        booking.Confirm(now);
        attempt.Confirm(reference, receivedAmount, actorId, now);
        await db.SaveChangesAsync(ct); // EF Core saves ledger + booking + attempt atomically.
        return PaymentAttemptResult.Ok(ToDto(attempt, booking.BookingCode));
    }

    private static PaymentAttemptDto ToDto(PaymentAttempt x, string code)
        => new(x.Id, x.BookingId, code, x.Method, x.Amount, x.RequestCode,
            x.Status, x.ExpiresAtUtc, x.CreatedAtUtc, x.ExternalReference, x.ReportedAmount);
}
