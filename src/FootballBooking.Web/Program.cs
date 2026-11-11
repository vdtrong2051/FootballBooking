using FootballBooking.Application;
using FootballBooking.Application.Bookings;
using FootballBooking.Application.Common.Security;
using FootballBooking.Infrastructure;
using FootballBooking.Infrastructure.Data;
using FootballBooking.Infrastructure.Identity;
using FootballBooking.Infrastructure.SeedData;
using Microsoft.AspNetCore.Hosting.StaticWebAssets;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);
var shouldSeedDevelopmentData = args.Any(arg => arg.Equals("--seed-development-data", StringComparison.OrdinalIgnoreCase));

builder.Logging.ClearProviders();
builder.Logging.AddConsole();

StaticWebAssetsLoader.UseStaticWebAssets(builder.Environment, builder.Configuration);

var bookingPolicy = builder.Configuration
    .GetSection("BookingPolicy")
    .Get<BookingPolicyOptions>() ?? new BookingPolicyOptions();

builder.Services.AddApplication(bookingPolicy);
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddControllersWithViews();
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddPolicy("sensitive-booking", context => RateLimitPartition.GetFixedWindowLimiter(
        context.Connection.RemoteIpAddress?.ToString() ?? "unknown", _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = 12, Window = TimeSpan.FromMinutes(1), QueueLimit = 0
        }));
    options.AddPolicy("phone-otp", context => RateLimitPartition.GetFixedWindowLimiter(
        context.Connection.RemoteIpAddress?.ToString() ?? "unknown", _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = 8, Window = TimeSpan.FromMinutes(10), QueueLimit = 0
        }));
});
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("InternalUser", policy => policy.RequireRole(ApplicationRoles.Internal));
    options.AddPolicy("OwnerOnly", policy => policy.RequireRole(ApplicationRoles.Owner));
    options.AddPolicy("CanManageSchedule", policy => policy.RequireAssertion(ctx => StaffPermissions.HasPermission(ctx.User, StaffPermissions.ManageSchedule)));
    options.AddPolicy("CanManagePayments", policy => policy.RequireAssertion(ctx => StaffPermissions.HasPermission(ctx.User, StaffPermissions.ManagePayments)));
    options.AddPolicy("CanAccessBookings", policy => policy.RequireAssertion(ctx =>
        StaffPermissions.HasPermission(ctx.User, StaffPermissions.ManageSchedule)
        || StaffPermissions.HasPermission(ctx.User, StaffPermissions.ManagePayments)));
    options.AddPolicy("CanManageCatalog", policy => policy.RequireAssertion(ctx => StaffPermissions.HasPermission(ctx.User, StaffPermissions.ManageCatalog)));
    options.AddPolicy("CanViewReports", policy => policy.RequireAssertion(ctx => StaffPermissions.HasPermission(ctx.User, StaffPermissions.ViewReports)));
});
builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/admin/login";
    options.AccessDeniedPath = "/admin/login";
    options.Events.OnRedirectToLogin = context =>
    {
        var redirectUri = context.Request.Path.StartsWithSegments("/account", StringComparison.OrdinalIgnoreCase)
            ? context.RedirectUri.Replace("/admin/login", "/account/login", StringComparison.OrdinalIgnoreCase)
            : context.RedirectUri;
        context.Response.Redirect(redirectUri);
        return Task.CompletedTask;
    };
});

var app = builder.Build();

if (shouldSeedDevelopmentData)
{
    if (!app.Environment.IsDevelopment())
    {
        throw new InvalidOperationException("Chỉ được seed dữ liệu mẫu khi môi trường là Development.");
    }

    using var seedScope = app.Services.CreateScope();
    var dbContext = seedScope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await dbContext.Database.EnsureCreatedAsync();
    var identitySeeder = seedScope.ServiceProvider.GetRequiredService<IdentitySeeder>();
    await identitySeeder.SeedDevelopmentOwnerAsync();
    await seedScope.ServiceProvider.GetRequiredService<DevelopmentFieldSeeder>().SeedAsync();
    await seedScope.ServiceProvider.GetRequiredService<DevelopmentCommerceSeeder>().SeedAsync();
    await seedScope.ServiceProvider.GetRequiredService<DevelopmentOperationsSeeder>().SeedAsync();
    return;
}

if (!app.Environment.IsDevelopment() && !app.Environment.IsEnvironment("Testing"))
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

var hasHttpsRedirectPort = !string.IsNullOrWhiteSpace(app.Configuration["HTTPS_PORT"])
    || !string.IsNullOrWhiteSpace(app.Configuration["ASPNETCORE_HTTPS_PORTS"])
    || !string.IsNullOrWhiteSpace(app.Configuration["HttpsRedirection:HttpsPort"]);
if (!app.Environment.IsDevelopment() && hasHttpsRedirectPort)
{
    app.UseHttpsRedirection();
}
app.UseRouting();
app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

app.MapStaticAssets();

app.MapControllerRoute(
    name: "admin",
    pattern: "{area:exists}/{controller=Dashboard}/{action=Index}/{id?}")
    .WithStaticAssets();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();


app.Run();

public partial class Program;
