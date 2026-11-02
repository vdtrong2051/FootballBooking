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

        services.AddDbContext<ApplicationDbContext>(options =>
            MySqlDatabaseConfiguration.Configure(options, connectionString, databaseOptions));

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
        if (isSqlite)
        {
            services.AddSingleton<IBookingWriteLock, SqliteBookingWriteLock>();
        }
        else
        {
            services.AddSingleton<IBookingWriteLock>(_ => new MySqlBookingWriteLock(connectionString));
        }

        services.AddScoped<IFieldStore, EfFieldStore>();
        services.AddScoped<IBookingStore, EfBookingStore>();
        services.AddScoped<IReportStore, EfReportStore>();

        services.AddScoped<DevelopmentFieldSeeder>();
        services.AddScoped<DevelopmentCommerceSeeder>();
        services.AddScoped<DevelopmentOperationsSeeder>();

        return services;
    }
}
