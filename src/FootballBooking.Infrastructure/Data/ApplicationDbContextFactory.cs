using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace FootballBooking.Infrastructure.Data;

public sealed class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    private const string DefaultDevelopmentConnectionString =
        "Server=localhost;Port=3306;Database=football_booking;User=footballbooking;Password=footballbooking;SslMode=Preferred;AllowPublicKeyRetrieval=True";

    public ApplicationDbContext CreateDbContext(string[] args)
    {
        var connectionString = Environment.GetEnvironmentVariable("FOOTBALLBOOKING_CONNECTION_STRING")
            ?? DefaultDevelopmentConnectionString;
        var serverVersion = Environment.GetEnvironmentVariable("FOOTBALLBOOKING_MYSQL_VERSION")
            ?? new DatabaseOptions().ServerVersion;

        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        MySqlDatabaseConfiguration.Configure(
            optionsBuilder,
            connectionString,
            new DatabaseOptions
            {
                ServerVersion = serverVersion,
                EnableRetryOnFailure = false
            });

        return new ApplicationDbContext(optionsBuilder.Options);
    }
}
