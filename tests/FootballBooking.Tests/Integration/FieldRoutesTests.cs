using System.Net;
using FootballBooking.Application.Common.Time;
using FootballBooking.Infrastructure.Data;
using FootballBooking.Infrastructure.SeedData;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;

namespace FootballBooking.Tests.Integration;

public sealed class FieldRoutesTests
{
    [Fact]
    public async Task PublicFields_WhenSeeded_RendersFieldListAndDetails()
    {
        await using var factory = await CreateSeededFactoryAsync();
        using var client = factory.CreateClient();

        var listResponse = await client.GetAsync("/fields");
        var listContent = await listResponse.Content.ReadAsStringAsync();
        var detailResponse = await client.GetAsync("/fields/san-5a");
        var detailContent = await detailResponse.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, listResponse.StatusCode);
        Assert.Contains("san-5a", listContent);
        Assert.Contains("san-7a", listContent);
        Assert.Equal(HttpStatusCode.OK, detailResponse.StatusCode);
        Assert.Contains("Bảng giá tham khảo", detailContent);
    }

    [Fact]
    public async Task AdminFields_WhenAnonymous_RedirectsToAdminLogin()
    {
        await using var factory = await CreateSeededFactoryAsync();
        using var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });

        var response = await client.GetAsync("/admin/fields");

        Assert.Equal(HttpStatusCode.Redirect, response.StatusCode);
        Assert.Equal("/admin/login", response.Headers.Location?.AbsolutePath);
    }

    [Fact]
    public async Task BookingRoutes_WhenSeeded_RenderPublicBookingAndLookup()
    {
        await using var factory = await CreateSeededFactoryAsync();
        using var client = factory.CreateClient();

        var bookingResponse = await client.GetAsync("/booking");
        var bookingContent = await bookingResponse.Content.ReadAsStringAsync();
        var lookupResponse = await client.GetAsync("/booking/lookup");
        var lookupContent = await lookupResponse.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, bookingResponse.StatusCode);
        Assert.Contains("Xác nhận đặt sân", bookingContent);
        Assert.Equal(HttpStatusCode.OK, lookupResponse.StatusCode);
        Assert.Contains("Tra cứu đặt sân", lookupContent);
    }

    [Fact]
    public async Task CommerceRoutes_WhenSeeded_RenderServicesAndPromotions()
    {
        await using var factory = await CreateSeededFactoryAsync();
        using var client = factory.CreateClient();

        var servicesResponse = await client.GetAsync("/services");
        var servicesContent = await servicesResponse.Content.ReadAsStringAsync();
        var promotionsResponse = await client.GetAsync("/promotions");
        var promotionsContent = await promotionsResponse.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, servicesResponse.StatusCode);
        Assert.Contains("Dịch vụ đi kèm", servicesContent);
        Assert.Equal(HttpStatusCode.OK, promotionsResponse.StatusCode);
        Assert.Contains("ANPHU50", promotionsContent);
    }

    [Fact]
    public async Task AdminCommerceRoutes_WhenAnonymous_RedirectToAdminLogin()
    {
        await using var factory = await CreateSeededFactoryAsync();
        using var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });

        var paymentsResponse = await client.GetAsync("/admin/payments");
        var servicesResponse = await client.GetAsync("/admin/services");
        var promotionsResponse = await client.GetAsync("/admin/promotions");

        Assert.Equal(HttpStatusCode.Redirect, paymentsResponse.StatusCode);
        Assert.Equal("/admin/login", paymentsResponse.Headers.Location?.AbsolutePath);
        Assert.Equal(HttpStatusCode.Redirect, servicesResponse.StatusCode);
        Assert.Equal("/admin/login", servicesResponse.Headers.Location?.AbsolutePath);
        Assert.Equal(HttpStatusCode.Redirect, promotionsResponse.StatusCode);
        Assert.Equal("/admin/login", promotionsResponse.Headers.Location?.AbsolutePath);
    }

    [Fact]
    public async Task AdminBookings_WhenAnonymous_RedirectsToAdminLogin()
    {
        await using var factory = await CreateSeededFactoryAsync();
        using var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });

        var response = await client.GetAsync("/admin/bookings");

        Assert.Equal(HttpStatusCode.Redirect, response.StatusCode);
        Assert.Equal("/admin/login", response.Headers.Location?.AbsolutePath);
    }

    [Fact]
    public async Task AdminSchedule_WhenAnonymous_RedirectsToAdminLogin()
    {
        await using var factory = await CreateSeededFactoryAsync();
        using var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });

        var pageResponse = await client.GetAsync("/admin/schedule");
        var apiResponse = await client.GetAsync("/admin/api/schedule/events?start=2026-07-25&end=2026-08-01");

        Assert.Equal(HttpStatusCode.Redirect, pageResponse.StatusCode);
        Assert.Equal("/admin/login", pageResponse.Headers.Location?.AbsolutePath);
        Assert.Equal(HttpStatusCode.Redirect, apiResponse.StatusCode);
        Assert.Equal("/admin/login", apiResponse.Headers.Location?.AbsolutePath);
    }

    [Fact]
    public async Task CustomerAccountRoutes_WhenRequested_RenderLoginAndRegisterPages()
    {
        await using var factory = await CreateSeededFactoryAsync();
        using var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });

        var loginResponse = await client.GetAsync("/account/login");
        var registerResponse = await client.GetAsync("/account/register");
        var bookingsAnonymousResponse = await client.GetAsync("/account/bookings");

        Assert.Equal(HttpStatusCode.OK, loginResponse.StatusCode);
        Assert.Equal(HttpStatusCode.OK, registerResponse.StatusCode);
        Assert.Equal(HttpStatusCode.Redirect, bookingsAnonymousResponse.StatusCode);
        Assert.Equal("/account/login", bookingsAnonymousResponse.Headers.Location?.AbsolutePath);
    }

    [Fact]
    public async Task BookingPage_WhenRendered_ShowsNewPaymentMethodOptions()
    {
        await using var factory = await CreateSeededFactoryAsync();
        using var client = factory.CreateClient();

        var response = await client.GetAsync("/booking");
        var html = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("VietQR", html);
        Assert.Contains("MoMo", html);
        Assert.Contains("ZaloPay", html);
    }

    [Fact]
    public async Task AdminScheduleAndBookingCreate_WhenFilteredAndPrefilled_ApplyStatusDateAndSlotParameters()
    {
        await using var factory = await CreateSeededFactoryAsync();
        await using var scope = factory.Services.CreateAsyncScope();
        var bookingService = scope.ServiceProvider.GetRequiredService<FootballBooking.Application.Bookings.IBookingService>();
        var fieldService = scope.ServiceProvider.GetRequiredService<FootballBooking.Application.Fields.IFieldService>();
        var fields = await fieldService.ListAdminFieldsAsync();
        var fieldId = fields[0].Id;

        var scheduleController = new FootballBooking.Web.Areas.Admin.Controllers.ScheduleController(bookingService, fieldService);
        var indexResult = Assert.IsType<Microsoft.AspNetCore.Mvc.ViewResult>(
            await scheduleController.Index(fieldId, FootballBooking.Domain.Bookings.BookingStatus.PendingPayment, "2026-07-26", CancellationToken.None));
        var scheduleModel = Assert.IsType<FootballBooking.Web.ViewModels.Bookings.AdminScheduleViewModel>(indexResult.Model);

        Assert.Equal(fieldId, scheduleModel.FieldId);
        Assert.Equal(FootballBooking.Domain.Bookings.BookingStatus.PendingPayment, scheduleModel.Status);
        Assert.Equal("2026-07-26", scheduleModel.InitialDateText);

        var bookingsController = new FootballBooking.Web.Areas.Admin.Controllers.BookingsController(bookingService, fieldService);
        var createResult = Assert.IsType<Microsoft.AspNetCore.Mvc.ViewResult>(
            await bookingsController.Create(fieldId, "2026-07-26", 1080, CancellationToken.None));
        var createModel = Assert.IsType<FootballBooking.Web.ViewModels.Bookings.BookingCreateViewModel>(createResult.Model);

        Assert.Equal(fieldId, createModel.FieldId);
        Assert.Equal("26/07/2026", createModel.BookingDateText);
        Assert.Equal(1080, createModel.StartMinute);
        Assert.Equal(1140, createModel.EndMinute);
    }

    [Fact]
    public async Task StaffController_WhenStaffCreatedWithPayrollAndPermissions_CalculatesMonthlySalaryAndExportsCsv()
    {
        await using var factory = await CreateSeededFactoryAsync();
        await using var scope = factory.Services.CreateAsyncScope();
        var userManager = scope.ServiceProvider.GetRequiredService<Microsoft.AspNetCore.Identity.UserManager<FootballBooking.Infrastructure.Identity.ApplicationUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<Microsoft.AspNetCore.Identity.RoleManager<Microsoft.AspNetCore.Identity.IdentityRole<Guid>>>();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        if (!await roleManager.RoleExistsAsync(FootballBooking.Application.Common.Security.ApplicationRoles.Staff))
        {
            await roleManager.CreateAsync(new Microsoft.AspNetCore.Identity.IdentityRole<Guid>(FootballBooking.Application.Common.Security.ApplicationRoles.Staff));
        }

        var staffController = new FootballBooking.Web.Areas.Admin.Controllers.StaffController(userManager, dbContext)
        {
            TempData = new Microsoft.AspNetCore.Mvc.ViewFeatures.TempDataDictionary(
                new Microsoft.AspNetCore.Http.DefaultHttpContext(),
                new TestTempDataProvider())
        };

        var createResponse = await staffController.Create(new FootballBooking.Web.Areas.Admin.ViewModels.StaffFormViewModel
        {
            FullName = "Trần Văn Bình",
            Email = "binh.staff@anphu.local",
            Password = "StaffPassword1!",
            BaseSalary = 6_000_000,
            HourlyRate = 25_000,
            StandardHoursPerMonth = 160,
            CommissionPercent = 2.0m,
            SelectedPermissions =
            [
                FootballBooking.Application.Common.Security.StaffPermissions.ManageSchedule,
                FootballBooking.Application.Common.Security.StaffPermissions.ViewReports
            ],
            IsActive = true
        }, CancellationToken.None);

        Assert.IsType<Microsoft.AspNetCore.Mvc.RedirectToActionResult>(createResponse);

        var indexResult = Assert.IsType<Microsoft.AspNetCore.Mvc.ViewResult>(await staffController.Index("2026-07", CancellationToken.None));
        var staffList = Assert.IsAssignableFrom<IReadOnlyList<FootballBooking.Web.Areas.Admin.ViewModels.StaffListItemViewModel>>(indexResult.Model);
        var createdStaff = Assert.Single(staffList, item => item.Email == "binh.staff@anphu.local");

        Assert.Equal(6_000_000, createdStaff.Salary.BaseSalary);
        Assert.Equal(4_000_000, createdStaff.Salary.HourlyPay);
        Assert.Equal(10_000_000, createdStaff.Salary.TotalSalary);
        Assert.Contains(FootballBooking.Application.Common.Security.StaffPermissions.ViewReports, createdStaff.Permissions);

        var csvResult = Assert.IsType<Microsoft.AspNetCore.Mvc.FileContentResult>(await staffController.ExportPayrollCsv("2026-07", CancellationToken.None));
        var csvText = System.Text.Encoding.UTF8.GetString(csvResult.FileContents);
        Assert.Contains("Trần Văn Bình", csvText);
        Assert.Contains("10000000", csvText);
    }

    private static async Task<FieldRouteFactory> CreateSeededFactoryAsync()
    {
        var factory = new FieldRouteFactory();
        _ = factory.CreateClient();

        await using var scope = factory.Services.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        await dbContext.Database.EnsureDeletedAsync();
        await dbContext.Database.EnsureCreatedAsync();
        await scope.ServiceProvider.GetRequiredService<DevelopmentFieldSeeder>().SeedAsync();
        await scope.ServiceProvider.GetRequiredService<DevelopmentCommerceSeeder>().SeedAsync();

        return factory;
    }

    private sealed class FieldRouteFactory : WebApplicationFactory<Program>
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            var contentRoot = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "..", "src", "FootballBooking.Web"));

            builder.UseEnvironment("Testing");
            builder.UseContentRoot(contentRoot);
            builder.ConfigureLogging(logging => logging.ClearProviders());
            builder.ConfigureTestServices(services =>
            {
                services.RemoveAll<DbContextOptions<ApplicationDbContext>>();
                services.RemoveAll<DbContextOptions>();
                services.AddSingleton(MySqlTestDatabase.Options());
                services.AddSingleton<DbContextOptions>(sp => sp.GetRequiredService<DbContextOptions<ApplicationDbContext>>());
                services.AddDbContext<ApplicationDbContext>();
                services.RemoveAll<FootballBooking.Application.Bookings.IBookingWriteLock>();
                services.AddSingleton<FootballBooking.Application.Bookings.IBookingWriteLock>(_ =>
                    new FootballBooking.Infrastructure.Bookings.MySqlBookingWriteLock(MySqlTestDatabase.ConnectionString));
                services.RemoveAll<ISystemClock>();
                services.AddSingleton<ISystemClock, FixedClock>();

                var keysPath = Path.Combine(Path.GetTempPath(), "FootballBooking.Tests.FieldRouteKeys");
                Directory.CreateDirectory(keysPath);
                services.AddDataProtection().PersistKeysToFileSystem(new DirectoryInfo(keysPath));
            });
        }

    }

    private sealed class FixedClock : ISystemClock
    {
        public DateTimeOffset UtcNow => new(2026, 7, 25, 0, 0, 0, TimeSpan.Zero);
    }

    private sealed class TestTempDataProvider : Microsoft.AspNetCore.Mvc.ViewFeatures.ITempDataProvider
    {
        public IDictionary<string, object> LoadTempData(Microsoft.AspNetCore.Http.HttpContext context) => new Dictionary<string, object>();
        public void SaveTempData(Microsoft.AspNetCore.Http.HttpContext context, IDictionary<string, object> values) { }
    }
}
