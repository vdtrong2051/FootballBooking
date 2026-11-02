using System.Globalization;
using System.Security.Claims;
using System.Text;
using FootballBooking.Application.Common.Security;
using FootballBooking.Domain.Bookings;
using FootballBooking.Domain.Users;
using FootballBooking.Infrastructure.Data;
using FootballBooking.Infrastructure.Identity;
using FootballBooking.Web.Areas.Admin.ViewModels;
using FootballBooking.Web.ViewModels.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FootballBooking.Web.Areas.Admin.Controllers;

[Area("Admin")]
[Route("admin/staff")]
[Authorize(Policy = "OwnerOnly")]
public sealed class StaffController(
    UserManager<ApplicationUser> userManager,
    ApplicationDbContext dbContext) : Controller
{
    [HttpGet("")]
    public async Task<IActionResult> Index(string? month = null, CancellationToken cancellationToken = default)
    {
        var selectedMonth = ParseMonth(month);
        ViewData["Title"] = "Nhân viên & Bảng lương";
        ViewData["SelectedMonth"] = selectedMonth.ToString("yyyy-MM", CultureInfo.InvariantCulture);
        ViewData["Breadcrumbs"] = Breadcrumbs("Nhân viên & Bảng lương");

        var model = await BuildStaffPayrollListAsync(selectedMonth, cancellationToken);
        return View("~/Areas/Admin/Views/Shared/StaffIndex.cshtml", model);
    }

    [HttpGet("payroll.csv")]
    public async Task<IActionResult> ExportPayrollCsv(string? month = null, CancellationToken cancellationToken = default)
    {
        var selectedMonth = ParseMonth(month);
        var items = await BuildStaffPayrollListAsync(selectedMonth, cancellationToken);
        var builder = new StringBuilder();
        builder.AppendLine("HoTen,Email,TrangThai,QuyenHan,BookingXuLy,DoanhThuXuLy,LuongCoBan,GioCong,DonGiaGio,LuongTheoGio,HoaHongPhanTram,TienHoaHong,TongLuongThucLinh");

        foreach (var item in items)
        {
            var permissionsText = string.Join(" | ", item.Permissions.Select(StaffPermissions.Label));
            builder.AppendLine(string.Join(",",
                EscapeCsv(item.FullName),
                EscapeCsv(item.Email),
                EscapeCsv(item.StatusLabel),
                EscapeCsv(permissionsText),
                item.HandledBookingsCount,
                item.Salary.HandledRevenue,
                item.Salary.BaseSalary,
                item.Salary.StandardHours,
                item.Salary.HourlyRate,
                item.Salary.HourlyPay,
                item.Salary.CommissionPercent.ToString(CultureInfo.InvariantCulture),
                item.Salary.CommissionPay,
                item.Salary.TotalSalary));
        }

        var preamble = Encoding.UTF8.GetPreamble();
        var body = Encoding.UTF8.GetBytes(builder.ToString());
        var bytes = new byte[preamble.Length + body.Length];
        Buffer.BlockCopy(preamble, 0, bytes, 0, preamble.Length);
        Buffer.BlockCopy(body, 0, bytes, preamble.Length, body.Length);

        return File(bytes, "text/csv; charset=utf-8", $"bang-luong-{selectedMonth:yyyy-MM}.csv");
    }

    [HttpGet("create")]
    public IActionResult Create()
    {
        PrepareForm("Thêm nhân viên");
        return View("~/Areas/Admin/Views/Shared/StaffForm.cshtml", new StaffFormViewModel());
    }

    [HttpPost("create")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(StaffFormViewModel model, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(model.Password))
        {
            ModelState.AddModelError(nameof(model.Password), "Vui lòng nhập mật khẩu tạm.");
        }

        if (!ModelState.IsValid)
        {
            PrepareForm("Thêm nhân viên");
            return View("~/Areas/Admin/Views/Shared/StaffForm.cshtml", model);
        }

        var email = model.Email.Trim();
        if (await userManager.FindByEmailAsync(email) is not null)
        {
            ModelState.AddModelError(nameof(model.Email), "Email này đã được sử dụng.");
            PrepareForm("Thêm nhân viên");
            return View("~/Areas/Admin/Views/Shared/StaffForm.cshtml", model);
        }

        var now = DateTimeOffset.UtcNow;
        var user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            EmailConfirmed = true,
            FullName = model.FullName.Trim(),
            AccountStatus = model.IsActive ? AccountStatus.Active : AccountStatus.Locked,
            BaseSalary = model.BaseSalary,
            HourlyRate = model.HourlyRate,
            StandardHoursPerMonth = model.StandardHoursPerMonth,
            CommissionPercent = model.CommissionPercent,
            CreatedAtUtc = now,
            UpdatedAtUtc = now,
            LockoutEnabled = true
        };

        var createResult = await userManager.CreateAsync(user, model.Password!);
        if (!createResult.Succeeded)
        {
            AddIdentityErrors(createResult);
            PrepareForm("Thêm nhân viên");
            return View("~/Areas/Admin/Views/Shared/StaffForm.cshtml", model);
        }

        var roleResult = await userManager.AddToRoleAsync(user, ApplicationRoles.Staff);
        if (!roleResult.Succeeded)
        {
            AddIdentityErrors(roleResult);
            PrepareForm("Thêm nhân viên");
            return View("~/Areas/Admin/Views/Shared/StaffForm.cshtml", model);
        }

        await SyncPermissionClaimsAsync(user, model.SelectedPermissions);

        if (!model.IsActive)
        {
            await userManager.SetLockoutEndDateAsync(user, DateTimeOffset.MaxValue);
        }

        cancellationToken.ThrowIfCancellationRequested();
        TempData["SuccessMessage"] = "Đã thêm tài khoản nhân viên, cấu hình lương và phân quyền.";
        return RedirectToAction(nameof(Index));
    }

    [HttpGet("{id:guid}/edit")]
    public async Task<IActionResult> Edit(Guid id)
    {
        var user = await FindStaffAsync(id);
        if (user is null)
        {
            return NotFound();
        }

        var claims = await userManager.GetClaimsAsync(user);
        var permissions = claims
            .Where(claim => claim.Type == StaffPermissions.ClaimType)
            .Select(claim => claim.Value)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();
        if (permissions.Count == 0)
        {
            permissions.AddRange(StaffPermissions.DefaultStaffPermissions);
        }

        PrepareForm("Cập nhật nhân viên");
        return View("~/Areas/Admin/Views/Shared/StaffForm.cshtml", new StaffFormViewModel
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email ?? string.Empty,
            BaseSalary = user.BaseSalary,
            HourlyRate = user.HourlyRate,
            StandardHoursPerMonth = user.StandardHoursPerMonth,
            CommissionPercent = user.CommissionPercent,
            SelectedPermissions = permissions,
            IsActive = user.AccountStatus == AccountStatus.Active
        });
    }

    [HttpPost("{id:guid}/edit")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(Guid id, StaffFormViewModel model, CancellationToken cancellationToken)
    {
        model.Id = id;
        var user = await FindStaffAsync(id);
        if (user is null)
        {
            return NotFound();
        }

        if (!ModelState.IsValid)
        {
            PrepareForm("Cập nhật nhân viên");
            return View("~/Areas/Admin/Views/Shared/StaffForm.cshtml", model);
        }

        var email = model.Email.Trim();
        var existing = await userManager.FindByEmailAsync(email);
        if (existing is not null && existing.Id != id)
        {
            ModelState.AddModelError(nameof(model.Email), "Email này đã được sử dụng.");
            PrepareForm("Cập nhật nhân viên");
            return View("~/Areas/Admin/Views/Shared/StaffForm.cshtml", model);
        }

        user.FullName = model.FullName.Trim();
        user.Email = email;
        user.UserName = email;
        user.AccountStatus = model.IsActive ? AccountStatus.Active : AccountStatus.Locked;
        user.BaseSalary = model.BaseSalary;
        user.HourlyRate = model.HourlyRate;
        user.StandardHoursPerMonth = model.StandardHoursPerMonth;
        user.CommissionPercent = model.CommissionPercent;
        user.UpdatedAtUtc = DateTimeOffset.UtcNow;

        var updateResult = await userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
        {
            AddIdentityErrors(updateResult);
            PrepareForm("Cập nhật nhân viên");
            return View("~/Areas/Admin/Views/Shared/StaffForm.cshtml", model);
        }

        await SyncPermissionClaimsAsync(user, model.SelectedPermissions);
        await userManager.SetLockoutEndDateAsync(user, model.IsActive ? null : DateTimeOffset.MaxValue);

        if (!string.IsNullOrWhiteSpace(model.Password))
        {
            var token = await userManager.GeneratePasswordResetTokenAsync(user);
            var passwordResult = await userManager.ResetPasswordAsync(user, token, model.Password);
            if (!passwordResult.Succeeded)
            {
                AddIdentityErrors(passwordResult);
                PrepareForm("Cập nhật nhân viên");
                return View("~/Areas/Admin/Views/Shared/StaffForm.cshtml", model);
            }
        }

        cancellationToken.ThrowIfCancellationRequested();
        TempData["SuccessMessage"] = "Đã cập nhật thông tin nhân viên, bảng lương và phân quyền.";
        return RedirectToAction(nameof(Index));
    }

    [HttpPost("{id:guid}/toggle")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Toggle(Guid id, bool isActive, CancellationToken cancellationToken)
    {
        var user = await FindStaffAsync(id);
        if (user is null)
        {
            return NotFound();
        }

        user.AccountStatus = isActive ? AccountStatus.Active : AccountStatus.Locked;
        user.UpdatedAtUtc = DateTimeOffset.UtcNow;
        await userManager.UpdateAsync(user);
        await userManager.SetLockoutEndDateAsync(user, isActive ? null : DateTimeOffset.MaxValue);

        cancellationToken.ThrowIfCancellationRequested();
        TempData["SuccessMessage"] = isActive ? "Đã mở khóa tài khoản nhân viên." : "Đã khóa tài khoản nhân viên.";
        return RedirectToAction(nameof(Index));
    }

    private async Task<IReadOnlyList<StaffListItemViewModel>> BuildStaffPayrollListAsync(
        DateOnly monthStart,
        CancellationToken cancellationToken)
    {
        var monthEnd = monthStart.AddMonths(1).AddDays(-1);
        var staffUsers = await userManager.GetUsersInRoleAsync(ApplicationRoles.Staff);

        var bookingsInMonth = await dbContext.Bookings
            .AsNoTracking()
            .Where(booking => booking.BookingDate >= monthStart && booking.BookingDate <= monthEnd && booking.CreatedByUserId != null)
            .ToListAsync(cancellationToken);

        var paymentsInMonth = (await dbContext.Payments
            .AsNoTracking()
            .Where(payment =>
                payment.RecordedByUserId != null
                && payment.Status == PaymentRecordStatus.Succeeded
                && payment.PaymentType == PaymentRecordType.Payment)
            .ToListAsync(cancellationToken))
            .Where(payment =>
            {
                var recordedDate = DateOnly.FromDateTime((payment.ProcessedAtUtc ?? payment.CreatedAtUtc).UtcDateTime);
                return recordedDate >= monthStart && recordedDate <= monthEnd;
            })
            .ToArray();

        var result = new List<StaffListItemViewModel>(staffUsers.Count);
        foreach (var user in staffUsers.OrderBy(candidate => candidate.FullName))
        {
            var claims = await userManager.GetClaimsAsync(user);
            var permissions = claims
                .Where(claim => claim.Type == StaffPermissions.ClaimType)
                .Select(claim => claim.Value)
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToArray();
            if (permissions.Length == 0)
            {
                permissions = StaffPermissions.DefaultStaffPermissions;
            }

            var handledBookingsCount = bookingsInMonth.Count(booking => booking.CreatedByUserId == user.Id);
            var handledBookingRevenue = bookingsInMonth
                .Where(booking => booking.CreatedByUserId == user.Id && booking.Status != BookingStatus.Cancelled)
                .Sum(booking => booking.PaidAmount);
            var handledPaymentRevenue = paymentsInMonth
                .Where(payment => payment.RecordedByUserId == user.Id)
                .Sum(payment => payment.Amount);
            var totalHandledRevenue = Math.Max(handledBookingRevenue, handledPaymentRevenue);

            var salary = StaffPermissions.CalculateSalary(
                user.BaseSalary,
                user.HourlyRate,
                user.StandardHoursPerMonth,
                totalHandledRevenue,
                user.CommissionPercent);

            result.Add(new StaffListItemViewModel(
                user.Id,
                user.FullName,
                user.Email ?? string.Empty,
                user.AccountStatus,
                user.CreatedAtUtc,
                user.LastLoginAtUtc,
                permissions,
                handledBookingsCount,
                salary));
        }

        return result;
    }

    private async Task SyncPermissionClaimsAsync(ApplicationUser user, IEnumerable<string>? selectedPermissions)
    {
        var existingClaims = await userManager.GetClaimsAsync(user);
        var permissionClaims = existingClaims.Where(claim => claim.Type == StaffPermissions.ClaimType).ToArray();
        if (permissionClaims.Length > 0)
        {
            await userManager.RemoveClaimsAsync(user, permissionClaims);
        }

        var validPermissions = (selectedPermissions ?? [])
            .Where(permission => StaffPermissions.All.Contains(permission, StringComparer.OrdinalIgnoreCase))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .Select(permission => new Claim(StaffPermissions.ClaimType, permission))
            .ToArray();

        if (validPermissions.Length > 0)
        {
            await userManager.AddClaimsAsync(user, validPermissions);
        }
    }

    private static DateOnly ParseMonth(string? month)
    {
        if (!string.IsNullOrWhiteSpace(month)
            && DateOnly.TryParseExact($"{month}-01", "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsed))
        {
            return parsed;
        }

        var now = DateTime.UtcNow;
        return new DateOnly(now.Year, now.Month, 1);
    }

    private static string EscapeCsv(string value)
        => $"\"{value.Replace("\"", "\"\"", StringComparison.Ordinal)}\"";

    private async Task<ApplicationUser?> FindStaffAsync(Guid id)
    {
        var user = await userManager.Users.FirstOrDefaultAsync(item => item.Id == id);
        return user is not null && await userManager.IsInRoleAsync(user, ApplicationRoles.Staff) ? user : null;
    }

    private void PrepareForm(string title)
    {
        ViewData["Title"] = title;
        ViewData["Breadcrumbs"] = Breadcrumbs(title);
    }

    private static List<BreadcrumbItemViewModel> Breadcrumbs(string current)
        =>
        [
            new("Quản trị", "/admin/dashboard"),
            new("Nhân viên", "/admin/staff"),
            new(current)
        ];

    private void AddIdentityErrors(IdentityResult result)
    {
        var hasPasswordError = result.Errors.Any(error => error.Code.Contains("Password", StringComparison.OrdinalIgnoreCase));
        ModelState.AddModelError(
            string.Empty,
            hasPasswordError
                ? "Mật khẩu chưa đủ mạnh. Vui lòng dùng ít nhất 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt."
                : "Không thể lưu tài khoản nhân viên. Vui lòng kiểm tra lại thông tin.");
    }
}
