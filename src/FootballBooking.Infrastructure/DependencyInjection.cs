using FootballBooking.Application.Bookings;
using FootballBooking.Application.Common.Time;
using FootballBooking.Application.Fields;
using FootballBooking.Application.Reports;
using FootballBooking.Infrastructure.Bookings;
using FootballBooking.Infrastructure.Data;
using FootballBooking.Infrastructure.Fields;
using FootballBooking.Infrastructure.Identity;
using FootballBooking.Infrastructure.Reports;
using FootballBooking.Infrastructure.SeedData;
using FootballBooking.Infrastructure.Time;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace FootballBooking.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var databaseOptions = configuration
            .GetSection(DatabaseOptions.SectionName)
            .Get<DatabaseOptions>() ?? new DatabaseOptions();
        var connectionString = MySqlDatabaseConfiguration.GetConnectionString(configuration);
        var isSqlite = MySqlDatabaseConfiguration.IsSqlite(connectionString, databaseOptions);

        var dbOptionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        MySqlDatabaseConfiguration.Configure(dbOptionsBuilder, connectionString, databaseOptions);
        services.AddSingleton(dbOptionsBuilder.Options);
        services.AddSingleton<DbContextOptions>(sp => sp.GetRequiredService<DbContextOptions<ApplicationDbContext>>());
        services.AddDbContext<ApplicationDbContext>();

        services
            .AddIdentity<ApplicationUser, IdentityRole<Guid>>(options =>
            {
                options.User.RequireUniqueEmail = true;
                options.SignIn.RequireConfirmedAccount = false;
            })
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        services.Configure<DevelopmentOwnerOptions>(configuration.GetSection("SeedOwner"));
        services.Configure<DevelopmentInternalUsersOptions>(configuration.GetSection("SeedInternalUsers"));
        services.AddScoped<IdentitySeeder>();

        services.AddSingleton<ISystemClock, SystemClock>();
        services.AddSingleton<SqliteBookingWriteLock>();
        services.AddSingleton<IBookingWriteLock>(sp =>
        {
            var options = sp.GetService<DbContextOptions<ApplicationDbContext>>();
            var usesSqlite = isSqlite || (options?.Extensions.Any(ext => ext.GetType().Name.Contains("Sqlite", StringComparison.OrdinalIgnoreCase)) ?? false);
            return usesSqlite
                ? sp.GetRequiredService<SqliteBookingWriteLock>()
                : new MySqlBookingWriteLock(connectionString);
        });

        services.AddScoped<IFieldStore, EfFieldStore>();
        services.AddScoped<IBookingStore, EfBookingStore>();
        services.AddScoped<IReportStore, EfReportStore>();

        services.AddScoped<DevelopmentFieldSeeder>();
        services.AddScoped<DevelopmentCommerceSeeder>();
        services.AddScoped<DevelopmentOperationsSeeder>();

        return services;
    }
}
