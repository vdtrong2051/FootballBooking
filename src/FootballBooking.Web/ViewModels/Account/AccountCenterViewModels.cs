using System.ComponentModel.DataAnnotations;
using FootballBooking.Application.Bookings;
using FootballBooking.Domain.Bookings;
using FootballBooking.Domain.Payments;

namespace FootballBooking.Web.ViewModels.Account;

public sealed class CustomerAccountHomeViewModel
{
    public string FullName { get; init; } = string.Empty;
    public string? Email { get; init; }
    public bool PhoneConfirmed { get; init; }
    public IReadOnlyList<BookingSummaryDto> RecentBookings { get; init; } = [];
    public int UpcomingCount { get; init; }
    public int CompletedCount { get; init; }
    public int OtherCount { get; init; }
}

public sealed class CustomerProfileEditViewModel
{
    [Required(ErrorMessage = "Vui lòng nhập họ tên.")]
    [StringLength(120, MinimumLength = 2, ErrorMessage = "Họ tên cần từ 2 đến 120 ký tự.")]
    [Display(Name = "Họ và tên")]
    public string FullName { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public bool PhoneConfirmed { get; set; }
}

public sealed class CustomerPasswordViewModel
{
    [Required(ErrorMessage = "Vui lòng nhập mật khẩu hiện tại.")]
    [DataType(DataType.Password)]
    [Display(Name = "Mật khẩu hiện tại")]
    public string CurrentPassword { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vui lòng nhập mật khẩu mới.")]
    [StringLength(100, MinimumLength = 8, ErrorMessage = "Mật khẩu mới cần từ 8 đến 100 ký tự.")]
    [DataType(DataType.Password)]
    [Display(Name = "Mật khẩu mới")]
    public string NewPassword { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vui lòng xác nhận mật khẩu.")]
    [Compare(nameof(NewPassword), ErrorMessage = "Hai mật khẩu không khớp.")]
    [DataType(DataType.Password)]
    [Display(Name = "Xác nhận mật khẩu mới")]
    public string ConfirmPassword { get; set; } = string.Empty;
}

public sealed class CustomerPhoneChangeViewModel
{
    [Required(ErrorMessage = "Nhập mật khẩu hiện tại để xác minh.")]
    [DataType(DataType.Password)]
    [Display(Name = "Mật khẩu hiện tại")]
    public string CurrentPassword { get; set; } = string.Empty;

    [Required(ErrorMessage = "Nhập số điện thoại mới.")]
    [Display(Name = "Số điện thoại mới")]
    public string NewPhone { get; set; } = string.Empty;
}

public sealed class CustomerPhoneVerifyViewModel
{
    [Required(ErrorMessage = "Nhập mã OTP.")]
    [RegularExpression(@"^\d{6}$", ErrorMessage = "OTP gồm 6 chữ số.")]
    public string Code { get; set; } = string.Empty;
    public string MaskedPhone { get; set; } = string.Empty;
}

public sealed record CustomerPaymentLedgerRow(string BookingCode, Guid BookingId,
    PaymentRecordType Type, PaymentMethod Method, long Amount, PaymentRecordStatus Status,
    string? TransactionCode, DateTimeOffset CreatedAtUtc);

public sealed record CustomerPaymentAttemptRow(string BookingCode, Guid BookingId,
    PaymentMethod Method, long Amount, PaymentAttemptStatus Status,
    string RequestCode, DateTimeOffset CreatedAtUtc);

public sealed class CustomerPaymentHistoryViewModel
{
    public IReadOnlyList<CustomerPaymentLedgerRow> ReceivedPayments { get; init; } = [];
    public IReadOnlyList<CustomerPaymentAttemptRow> Attempts { get; init; } = [];
}
