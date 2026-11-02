using System.ComponentModel.DataAnnotations;
using FootballBooking.Application.Common.Security;
using FootballBooking.Domain.Users;

namespace FootballBooking.Web.Areas.Admin.ViewModels;

public sealed record StaffListItemViewModel(
    Guid Id,
    string FullName,
    string Email,
    AccountStatus AccountStatus,
    DateTimeOffset CreatedAtUtc,
    DateTimeOffset? LastLoginAtUtc,
    IReadOnlyList<string> Permissions,
    int HandledBookingsCount,
    StaffSalaryBreakdown Salary)
{
    public string StatusLabel => AccountStatus switch
    {
        AccountStatus.Active => "Đang hoạt động",
        AccountStatus.Locked => "Đã khóa",
        AccountStatus.Inactive => "Ngưng sử dụng",
        _ => "Không xác định"
    };

    public string StatusTone => AccountStatus == AccountStatus.Active ? "success" : "neutral";
}

public sealed class StaffFormViewModel
{
    public Guid? Id { get; set; }

    [Required(ErrorMessage = "Vui lòng nhập họ tên nhân viên.")]
    [StringLength(120, ErrorMessage = "Họ tên không được vượt quá 120 ký tự.")]
    [Display(Name = "Họ tên")]
    public string FullName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vui lòng nhập email.")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ.")]
    [Display(Name = "Email")]
    public string Email { get; set; } = string.Empty;

    [StringLength(100, MinimumLength = 8, ErrorMessage = "Mật khẩu phải có ít nhất 8 ký tự.")]
    [Display(Name = "Mật khẩu tạm")]
    public string? Password { get; set; }

    [Range(0, 1_000_000_000, ErrorMessage = "Lương cứng không được âm.")]
    [Display(Name = "Lương cơ bản / tháng (₫)")]
    public long BaseSalary { get; set; } = 5_000_000;

    [Range(0, 10_000_000, ErrorMessage = "Đơn giá giờ công không được âm.")]
    [Display(Name = "Lương theo giờ (₫/giờ)")]
    public long HourlyRate { get; set; } = 25_000;

    [Range(0, 744, ErrorMessage = "Số giờ công chuẩn trong tháng từ 0 đến 744.")]
    [Display(Name = "Số giờ công trong tháng")]
    public int StandardHoursPerMonth { get; set; } = 160;

    [Range(0, 100, ErrorMessage = "Tỷ lệ hoa hồng từ 0% đến 100%.")]
    [Display(Name = "Hoa hồng doanh thu xử lý (%)")]
    public decimal CommissionPercent { get; set; } = 1.5m;

    public List<string> SelectedPermissions { get; set; } = [.. StaffPermissions.DefaultStaffPermissions];

    public bool IsActive { get; set; } = true;
}
