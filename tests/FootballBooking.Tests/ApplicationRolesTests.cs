using System.Security.Claims;
using FootballBooking.Application.Common.Security;

namespace FootballBooking.Tests;

public sealed class ApplicationRolesTests
{
    [Fact]
    public void All_WhenRead_ContainsTechnicalRoles()
    {
        Assert.Contains(ApplicationRoles.Customer, ApplicationRoles.All);
        Assert.Contains(ApplicationRoles.Owner, ApplicationRoles.All);
        Assert.Contains(ApplicationRoles.Staff, ApplicationRoles.All);
    }

    [Fact]
    public void StaffPermissions_WhenOwnerOrPermittedStaff_EvaluatesAccessCorrectly()
    {
        var ownerPrincipal = new ClaimsPrincipal(new ClaimsIdentity(
        [
            new Claim(ClaimTypes.Role, ApplicationRoles.Owner)
        ], "TestAuth"));

        var staffWithReportsClaim = new ClaimsPrincipal(new ClaimsIdentity(
        [
            new Claim(ClaimTypes.Role, ApplicationRoles.Staff),
            new Claim(StaffPermissions.ClaimType, StaffPermissions.ViewReports)
        ], "TestAuth"));

        var defaultStaffWithoutClaims = new ClaimsPrincipal(new ClaimsIdentity(
        [
            new Claim(ClaimTypes.Role, ApplicationRoles.Staff)
        ], "TestAuth"));

        Assert.True(StaffPermissions.HasPermission(ownerPrincipal, StaffPermissions.ViewReports));
        Assert.True(StaffPermissions.HasPermission(ownerPrincipal, StaffPermissions.ManageCatalog));

        Assert.True(StaffPermissions.HasPermission(staffWithReportsClaim, StaffPermissions.ViewReports));
        Assert.False(StaffPermissions.HasPermission(staffWithReportsClaim, StaffPermissions.ManageCatalog));

        Assert.True(StaffPermissions.HasPermission(defaultStaffWithoutClaims, StaffPermissions.ManageSchedule));
        Assert.True(StaffPermissions.HasPermission(defaultStaffWithoutClaims, StaffPermissions.ManagePayments));
        Assert.False(StaffPermissions.HasPermission(defaultStaffWithoutClaims, StaffPermissions.ViewReports));
    }

    [Fact]
    public void StaffPermissions_CalculateSalary_ComputesBaseHourlyAndCommissionPay()
    {
        var breakdown = StaffPermissions.CalculateSalary(
            baseSalary: 5_000_000,
            hourlyRate: 30_000,
            standardHours: 160,
            handledRevenue: 20_000_000,
            commissionPercent: 2.5m);

        Assert.Equal(5_000_000, breakdown.BaseSalary);
        Assert.Equal(4_800_000, breakdown.HourlyPay);
        Assert.Equal(500_000, breakdown.CommissionPay);
        Assert.Equal(10_300_000, breakdown.TotalSalary);
    }
}
