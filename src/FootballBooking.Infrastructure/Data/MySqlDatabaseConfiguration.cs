using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;

namespace FootballBooking.Infrastructure.Data;

internal static class MySqlDatabaseConfiguration
{
    private const string ConnectionStringName = "DefaultConnection";

    public static string GetConnectionString(IConfiguration configuration)
        => configuration.GetConnectionString(ConnectionStringName)
            ?? throw new InvalidOperationException(
                $"Thiếu connection string '{ConnectionStringName}'. Hãy cấu hình MySQL bằng appsettings, user secrets hoặc biến môi trường.");

    public static ServerVersion ParseServerVersion(string value)
    {
        if (!Version.TryParse(value, out var version))
        {
            throw new InvalidOperationException(
                $"Database:ServerVersion '{value}' không hợp lệ. Ví dụ hợp lệ: '8.4.0'.");
        }

        return new MySqlServerVersion(version);
    }

    public static void Configure(
        DbContextOptionsBuilder options,
        string connectionString,
        DatabaseOptions databaseOptions)
    {
        databaseOptions.Validate();

        options.UseMySql(
            connectionString,
            ParseServerVersion(databaseOptions.ServerVersion),
            mySqlOptions =>
            {
                mySqlOptions.SchemaBehavior(MySqlSchemaBehavior.Ignore);

                if (databaseOptions.EnableRetryOnFailure)
                {
                    mySqlOptions.EnableRetryOnFailure(
                        databaseOptions.MaxRetryCount,
                        TimeSpan.FromSeconds(databaseOptions.MaxRetryDelaySeconds),
                        null);
                }
            });
    }
}
