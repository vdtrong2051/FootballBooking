using FootballBooking.Domain.Bookings;

namespace FootballBooking.Application.Bookings;

public static class BookingLabels
{
    public static string Status(BookingStatus status)
        => status switch
        {
            BookingStatus.PendingPayment => "Chờ thanh toán",
            BookingStatus.Confirmed => "Đã xác nhận",
            BookingStatus.CheckedIn => "Khách đã đến",
            BookingStatus.InProgress => "Đang sử dụng",
            BookingStatus.Completed => "Đã hoàn thành",
            BookingStatus.Cancelled => "Đã hủy",
            BookingStatus.NoShow => "Khách không đến",
            BookingStatus.Expired => "Đã hết hạn",
            _ => "Không rõ"
        };

    public static string PaymentStatus(PaymentStatus status)
        => status switch
        {
            Domain.Bookings.PaymentStatus.Unpaid => "Chưa thanh toán",
            Domain.Bookings.PaymentStatus.PartiallyPaid => "Đã thanh toán một phần",
            Domain.Bookings.PaymentStatus.Paid => "Đã thanh toán đủ",
            Domain.Bookings.PaymentStatus.RefundPending => "Đang chờ hoàn tiền",
            Domain.Bookings.PaymentStatus.PartiallyRefunded => "Đã hoàn tiền một phần",
            Domain.Bookings.PaymentStatus.Refunded => "Đã hoàn tiền",
            Domain.Bookings.PaymentStatus.Failed => "Thanh toán thất bại",
            _ => "Không rõ"
        };

    public static string StatusTone(BookingStatus status)
        => status switch
        {
            BookingStatus.PendingPayment => "warning",
            BookingStatus.Confirmed => "info",
            BookingStatus.CheckedIn => "active",
            BookingStatus.InProgress => "warning",
            BookingStatus.Completed => "success",
            BookingStatus.Cancelled => "danger",
            BookingStatus.NoShow => "neutral",
            BookingStatus.Expired => "neutral",
            _ => "neutral"
        };

    public static string ScheduleTone(BookingStatus status)
        => status switch
        {
            BookingStatus.PendingPayment => "warning",
            BookingStatus.Confirmed => "info",
            BookingStatus.CheckedIn => "active",
            BookingStatus.InProgress => "warning",
            BookingStatus.Completed => "success",
            BookingStatus.Cancelled => "danger",
            BookingStatus.NoShow => "neutral",
            BookingStatus.Expired => "neutral",
            _ => "neutral"
        };

    public static string PaymentRecordType(PaymentRecordType type)
        => type switch
        {
            Domain.Bookings.PaymentRecordType.Payment => "Thu tiền",
            Domain.Bookings.PaymentRecordType.Refund => "Hoàn tiền",
            _ => "Không rõ"
        };

    public static string PaymentMethod(PaymentMethod method)
        => method switch
        {
            Domain.Bookings.PaymentMethod.Cash => "Tiền mặt",
            Domain.Bookings.PaymentMethod.BankTransfer => "Chuyển khoản",
            Domain.Bookings.PaymentMethod.Online => "Trực tuyến",
            Domain.Bookings.PaymentMethod.Other => "Khác",
            Domain.Bookings.PaymentMethod.VietQr => "Quét mã VietQR",
            Domain.Bookings.PaymentMethod.MoMo => "Ví MoMo",
            Domain.Bookings.PaymentMethod.ZaloPay => "Ví ZaloPay",
            Domain.Bookings.PaymentMethod.Card => "Thẻ ngân hàng",
            _ => "Không rõ"
        };

    public static string PaymentRecordStatus(PaymentRecordStatus status)
        => status switch
        {
            Domain.Bookings.PaymentRecordStatus.Pending => "Chờ xử lý",
            Domain.Bookings.PaymentRecordStatus.Succeeded => "Đã ghi nhận",
            Domain.Bookings.PaymentRecordStatus.Failed => "Thất bại",
            Domain.Bookings.PaymentRecordStatus.Cancelled => "Đã hủy",
            _ => "Không rõ"
        };

    public static string PromoDiscountType(PromoDiscountType type)
        => type switch
        {
            Domain.Bookings.PromoDiscountType.Percentage => "Giảm theo phần trăm",
            Domain.Bookings.PromoDiscountType.FixedAmount => "Giảm số tiền cố định",
            _ => "Không rõ"
        };
}
