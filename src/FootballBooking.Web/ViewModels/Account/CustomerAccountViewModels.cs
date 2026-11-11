using System.ComponentModel.DataAnnotations;
using FootballBooking.Application.Bookings;

namespace FootballBooking.Web.ViewModels.Account;

public sealed class CustomerLoginViewModel
{
    [Required(ErrorMessage = "Vui lòng nhập email hoặc số điện thoại.")]
    [Display(Name = "Email hoặc Số điện thoại")]
    public string Identifier { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vui lòng nhập mật khẩu.")]
    [DataType(DataType.Password)]
    [Display(Name = "Mật khẩu")]
    public string Password { get; set; } = string.Empty;

    [Display(Name = "Ghi nhớ đăng nhập")]
    public bool RememberMe { get; set; }

    public string? ReturnUrl { get; set; }
}

public sealed class CustomerRegisterViewModel
{
    [Required(ErrorMessage = "Vui lòng nhập họ tên.")]
    [StringLength(120, ErrorMessage = "Họ tên tối đa 120 ký tự.")]
    [Display(Name = "Họ và tên")]
    public string FullName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vui lòng nhập số điện thoại.")]
    [StringLength(20, ErrorMessage = "Số điện thoại tối đa 20 ký tự.")]
    [Display(Name = "Số điện thoại")]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vui lòng nhập email.")]
    [EmailAddress(ErrorMessage = "Email chưa hợp lệ.")]
    [Display(Name = "Email")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vui lòng nhập mật khẩu.")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "Mật khẩu cần tối thiểu 6 ký tự.")]
    [DataType(DataType.Password)]
    [Display(Name = "Mật khẩu")]
    public string Password { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vui lòng xác nhận mật khẩu.")]
    [Compare(nameof(Password), ErrorMessage = "Mật khẩu xác nhận không khớp.")]
    [DataType(DataType.Password)]
    [Display(Name = "Xác nhận mật khẩu")]
    public string ConfirmPassword { get; set; } = string.Empty;

    public string? ReturnUrl { get; set; }
}

public sealed class PhoneVerificationViewModel
{
    [Required]
    public Guid UserId { get; set; }
    [Required(ErrorMessage = "Vui lòng nhập mã OTP.")]
    [RegularExpression(@"^\d{6}$", ErrorMessage = "OTP phải gồm 6 chữ số.")]
    public string Code { get; set; } = string.Empty;
    public string MaskedPhone { get; set; } = string.Empty;
    public string? ReturnUrl { get; set; }
}

public sealed class CustomerBookingsViewModel
{
    public string CustomerName { get; set; } = string.Empty;
    public string? CustomerPhone { get; set; }
    public string? CustomerEmail { get; set; }
    public IReadOnlyList<BookingSummaryDto> Bookings { get; set; } = [];
}
