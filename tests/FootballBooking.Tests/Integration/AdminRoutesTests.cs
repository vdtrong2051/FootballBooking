using System.Net;
using FootballBooking.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace FootballBooking.Tests.Integration;

public sealed class AdminRoutesTests
{
    [Fact]
    public async Task Login_WhenRequested_ReturnsVietnameseLoginPage()
    {
        await using var factory = CreateFactory();
        using var client = factory.CreateClient();

        var response = await client.GetAsync("/admin/login");
        var content = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("Đăng nhập quản trị", content);
        Assert.DoesNotContain("/lib/bootstrap", content);
    }

    [Fact]
    public async Task Dashboard_WhenAnonymous_RedirectsToAdminLogin()
    {
        await using var factory = CreateFactory();
        using var client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });

        var response = await client.GetAsync("/admin/dashboard");

        Assert.Equal(HttpStatusCode.Redirect, response.StatusCode);
        Assert.Equal("/admin/login", response.Headers.Location?.AbsolutePath);
    }

    [Theory]
    [InlineData("/admin/reports")]
    [InlineData("/admin/api/dashboard/revenue")]
    public async Task OwnerReportRoutes_WhenAnonymous_RedirectToAdminLogin(string route)
    {
        await using var factory = CreateFactory();
        using var client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });

        var response = await client.GetAsync(route);

        Assert.Equal(HttpStatusCode.Redirect, response.StatusCode);
        Assert.Equal("/admin/login", response.Headers.Location?.AbsolutePath);
    }

    [Fact]
    public async Task Home_WhenRequested_ReturnsVietnamesePublicShell()
    {
        await using var context = await MySqlTestDatabase.CreateCleanContextAsync();
        await using var factory = CreateFactory();
        using var client = factory.CreateClient();

        var response = await client.GetAsync("/");
        var content = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("Đặt sân ngay", content);
        Assert.Contains("Sân bóng An Phú", content);
        Assert.DoesNotContain("/lib/bootstrap", content);
    }

    [Fact]
    public async Task DesignSystem_WhenNotDevelopment_ReturnsNotFound()
    {
        await using var factory = CreateFactory();
        using var client = factory.CreateClient();

        var response = await client.GetAsync("/dev/design-system");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }


    private static WebApplicationFactory<Program> CreateFactory()
    {
        var contentRoot = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "..", "src", "FootballBooking.Web"));

        return new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder =>
            {
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
                    var keysPath = Path.Combine(Path.GetTempPath(), "FootballBooking.Tests.DataProtectionKeys");
                    Directory.CreateDirectory(keysPath);
                    services.AddDataProtection().PersistKeysToFileSystem(new DirectoryInfo(keysPath));
                });
            });
    }

}
