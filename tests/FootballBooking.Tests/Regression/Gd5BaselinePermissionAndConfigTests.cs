using System.Security.Claims;
using FootballBooking.Application.Common.Security;
using FootballBooking.Infrastructure.Payments;

namespace FootballBooking.Tests.Regression;

public sealed class Gd5BaselinePermissionAndConfigTests
{
    private static ClaimsPrincipal Principal(string role, params string[] permissions)
    {
        var claims = new List<Claim> { new(ClaimTypes.Role, role) };
        claims.AddRange(permissions.Select(permission =>
            new Claim(StaffPermissions.ClaimType, permission)));
        return new ClaimsPrincipal(new ClaimsIdentity(claims, "Gd5TestAuth"));
    }

    [Fact]
    public void Customer_CannotAcquireStaffOrOwnerPermissions()
    {
        var customer = Principal(ApplicationRoles.Customer, StaffPermissions.ManageSchedule);
        Assert.False(StaffPermissions.HasPermission(customer, StaffPermissions.ManageSchedule));
        Assert.False(StaffPermissions.HasPermission(customer, StaffPermissions.ManagePayments));
        Assert.False(StaffPermissions.HasPermission(customer, StaffPermissions.ManageCatalog));
    }

    [Fact]
    public void StaffWithExplicitPaymentPermission_CannotManageCatalog()
    {
        var staff = Principal(ApplicationRoles.Staff, StaffPermissions.ManagePayments);
        Assert.True(StaffPermissions.HasPermission(staff, StaffPermissions.ManagePayments));
        Assert.False(StaffPermissions.HasPermission(staff, StaffPermissions.ManageSchedule));
        Assert.False(StaffPermissions.HasPermission(staff, StaffPermissions.ManageCatalog));
    }

    [Fact]
    public void AnonymousUser_DoesNotInheritStaffPermissions()
    {
        Assert.False(StaffPermissions.HasPermission(new ClaimsPrincipal(),
            StaffPermissions.ManagePayments));
    }

    [Fact]
    public void RealBankQr_AndLanSimulator_AreDisabledByDefault()
    {
        var settings = new PaymentOptions
        {
            BankBin = "970436", AccountNumber = "123456789", AccountName = "TEST ONLY"
        };
        Assert.True(settings.HasBankAccount);
        Assert.False(settings.EnableRealBankQr);
        Assert.False(settings.EnableLanDemo);
        Assert.False(settings.EnableDemoGateway);
    }
}
