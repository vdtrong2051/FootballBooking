using FootballBooking.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;

namespace FootballBooking.Tests.Integration;

internal static class MySqlTestDatabase
{
    private const string RequiredName = "football_booking_gd0_test";
    public static string ConnectionString
    {
        get
        {
            var value = Environment.GetEnvironmentVariable("FOOTBALLBOOKING_TEST_CONNECTION");
            if (string.IsNullOrWhiteSpace(value))
                throw new InvalidOperationException("Set FOOTBALLBOOKING_TEST_CONNECTION to a local MySQL database 'football_booking_gd0_test' before running integration tests.");
            var parsed = new MySqlConnectionStringBuilder(value);
            if (!string.Equals(parsed.Database, RequiredName, StringComparison.OrdinalIgnoreCase)
                || parsed.Server is not ("localhost" or "127.0.0.1"))
                throw new InvalidOperationException("Safety guard: integration tests may only modify football_booking_gd0_test on localhost/127.0.0.1.");
            return parsed.ConnectionString;
        }
    }

    public static DbContextOptions<ApplicationDbContext> Options()
        => new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseMySQL(ConnectionString)
            .Options;

    // Create ONLY the dedicated local integration-test database. Never touch football_booking.
    public static async Task EnsureDatabaseExistsAsync()
    {
        var builder = new MySqlConnectionStringBuilder(ConnectionString)
        {
            Database = string.Empty
        };
        await using var connection = new MySqlConnection(builder.ConnectionString);
        await connection.OpenAsync();
        await using var command = connection.CreateCommand();
        command.CommandText = "CREATE DATABASE IF NOT EXISTS `football_booking_gd0_test`";
        await command.ExecuteNonQueryAsync();
    }

    public static async Task<ApplicationDbContext> CreateCleanContextAsync()
    {
        await EnsureDatabaseExistsAsync();
        var context = new ApplicationDbContext(Options());
        // Explicit safety invariant: never reset football_booking or any other database.
        await context.Database.EnsureDeletedAsync();
        await context.Database.EnsureCreatedAsync();
        return context;
    }
}
