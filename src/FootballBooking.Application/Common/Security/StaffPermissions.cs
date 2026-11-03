using System.Security.Claims;

namespace FootballBooking.Application.Common.Security;

public sealed record StaffSalaryBreakdown(
    long BaseSalary,
    long HourlyRate,
    int StandardHours,
    long HourlyPay,
    long HandledRevenue,
    decimal CommissionPercent,
    long CommissionPay,
    long TotalSalary);

public static class StaffPermissions
{
    public const string ClaimType = "permission";

    public const string ManageSchedule = "schedule.manage";
    public const string ManagePayments = "payments.manage";
    public const string ManageCatalog = "catalog.manage";
    public const string ViewReports = "reports.view";

    public static readonly string[] All =
    [
        ManageSchedule,
        ManagePayments,
        ManageCatalog,
        ViewReports
    ];

    public static readonly string[] DefaultStaffPermissions =
    [
        ManageSchedule,
        ManagePayments
    ];

    public static string Label(string permission)
        => permission switch
        {
            ManageSchedule => "Điều phối lịch & booking",
            ManagePayments => "Thu tiền & quyết toán",
            ManageCatalog => "Quản lý sân, dịch vụ & khuyến mãi",
            ViewReports => "Xem báo cáo doanh thu",
            _ => permission
        };

    public static bool HasPermission(ClaimsPrincipal? user, string permission)
    {
        if (user?.Identity?.IsAuthenticated != true)
        {
            return false;
        }

        if (user.IsInRole(ApplicationRoles.Owner))
        {
            return true;
        }

        if (!user.IsInRole(ApplicationRoles.Staff))
        {
            return false;
        }

        var assignedPermissions = user.FindAll(ClaimType).Select(claim => claim.Value).ToArray();
        if (assignedPermissions.Length == 0)
        {
            return DefaultStaffPermissions.Contains(permission, StringComparer.OrdinalIgnoreCase);
        }

        return assignedPermissions.Contains(permission, StringComparer.OrdinalIgnoreCase);
    }

    public static StaffSalaryBreakdown CalculateSalary(
        long baseSalary,
        long hourlyRate,
        int standardHours,
        long handledRevenue,
        decimal commissionPercent)
    {
        var normalizedBase = Math.Max(0, baseSalary);
        var normalizedHourlyRate = Math.Max(0, hourlyRate);
        var normalizedHours = Math.Max(0, standardHours);
        var normalizedRevenue = Math.Max(0, handledRevenue);
        var normalizedCommissionPercent = Math.Clamp(commissionPercent, 0m, 100m);

        var hourlyPay = normalizedHourlyRate * normalizedHours;
        var commissionPay = (long)Math.Round(normalizedRevenue * (normalizedCommissionPercent / 100m), MidpointRounding.AwayFromZero);
        var totalSalary = normalizedBase + hourlyPay + commissionPay;

        return new StaffSalaryBreakdown(
            normalizedBase,
            normalizedHourlyRate,
            normalizedHours,
            hourlyPay,
            normalizedRevenue,
            normalizedCommissionPercent,
            commissionPay,
            totalSalary);
    }
}
