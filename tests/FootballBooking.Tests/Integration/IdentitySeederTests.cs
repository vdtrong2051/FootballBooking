using FootballBooking.Application.Common.Security;
using FootballBooking.Infrastructure.Data;
using FootballBooking.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace FootballBooking.Tests.Integration;

public sealed class IdentitySeederTests
{
    [Fact]
    public async Task SeedDevelopmentOwnerAsync_WhenConfigured_CreatesRolesAndOwner()
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddDbContext<ApplicationDbContext>(options => options.UseMySQL(MySqlTestDatabase.ConnectionString));
        services
            .AddIdentity<ApplicationUser, IdentityRole<Guid>>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();
        services.AddSingleton(Options.Create(new DevelopmentOwnerOptions
        {
            Email = "owner@anphu.local",
            Password = "LocalOnly!12345",
            FullName = "Chủ sân"
        }));
        services.AddSingleton(Options.Create(new DevelopmentInternalUsersOptions()));
        services.AddScoped<IdentitySeeder>();

        await using var provider = services.BuildServiceProvider();
        await using var scope = provider.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        await dbContext.Database.EnsureDeletedAsync();
        await dbContext.Database.EnsureCreatedAsync();

        var seeder = scope.ServiceProvider.GetRequiredService<IdentitySeeder>();
        await seeder.SeedDevelopmentOwnerAsync();

        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

        Assert.True(await roleManager.RoleExistsAsync(ApplicationRoles.Customer));
        Assert.True(await roleManager.RoleExistsAsync(ApplicationRoles.Owner));
        Assert.True(await roleManager.RoleExistsAsync(ApplicationRoles.Staff));

        var owner = await userManager.FindByEmailAsync("owner@anphu.local");
        Assert.NotNull(owner);
        Assert.True(await userManager.IsInRoleAsync(owner, ApplicationRoles.Owner));
    }
}
