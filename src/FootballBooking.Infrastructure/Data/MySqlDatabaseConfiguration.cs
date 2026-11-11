using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace FootballBooking.Infrastructure.Data;

internal static class MySqlDatabaseConfiguration
{
    private const string ConnectionStringName = "DefaultConnection";

    public static string GetConnectionString(IConfiguration configuration)
        => configuration.GetConnectionString(ConnectionStringName)
            ?? throw new InvalidOperationException(
                $"Thiếu connection string '{ConnectionStringName}'. Hãy cấu hình MySQL bằng appsettings, user secrets hoặc biến môi trường.");

    public static Version ParseServerVersion(string value)
    {
        if (!Version.TryParse(value, out var version))
        {
            throw new InvalidOperationException(
                $"Database:ServerVersion '{value}' không hợp lệ. Ví dụ hợp lệ: '8.4.0'.");
        }

        return version;
    }

    public static void Configure(
        DbContextOptionsBuilder options,
        string connectionString,
        DatabaseOptions databaseOptions)
    {
        databaseOptions.Validate();

        if (!connectionString.Contains("Server=", StringComparison.OrdinalIgnoreCase)
            || connectionString.Contains("Data Source=", StringComparison.OrdinalIgnoreCase)
            || connectionString.Contains("DataSource=", StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException("GĐ0: chỉ hỗ trợ MySQL; không dùng SQLite connection string.");
        }

        _ = ParseServerVersion(databaseOptions.ServerVersion);

        options.UseMySQL(
            connectionString,
            mySqlOptions =>
            {
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
