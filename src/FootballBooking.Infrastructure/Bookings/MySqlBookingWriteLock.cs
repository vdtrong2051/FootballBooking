using FootballBooking.Application.Bookings;
using MySqlConnector;

namespace FootballBooking.Infrastructure.Bookings;

public sealed class MySqlBookingWriteLock : IBookingWriteLock
{
    private const int MySqlLockNameMaxLength = 64;
    private readonly string _lockConnectionString;

    public MySqlBookingWriteLock(string connectionString)
    {
        var builder = new MySqlConnectionStringBuilder(connectionString)
        {
            Pooling = false
        };
        _lockConnectionString = builder.ConnectionString;
    }

    public async Task<IAsyncDisposable?> TryAcquireAsync(
        Guid fieldId,
        DateOnly bookingDate,
        TimeSpan timeout,
        CancellationToken cancellationToken)
    {
        var connection = new MySqlConnection(_lockConnectionString);
        try
        {
            await connection.OpenAsync(cancellationToken);

            var lockName = CreateLockName(fieldId, bookingDate);
            await using var command = connection.CreateCommand();
            command.CommandText = "SELECT GET_LOCK(@lockName, @timeoutSeconds);";
            command.Parameters.AddWithValue("@lockName", lockName);
            command.Parameters.AddWithValue("@timeoutSeconds", Math.Max(0, (int)Math.Ceiling(timeout.TotalSeconds)));

            var result = await command.ExecuteScalarAsync(cancellationToken);
            if (result is null or DBNull || Convert.ToInt32(result) != 1)
            {
                await connection.DisposeAsync();
                return null;
            }

            return new Releaser(connection, lockName);
        }
        catch
        {
            await connection.DisposeAsync();
            throw;
        }
    }

    private static string CreateLockName(Guid fieldId, DateOnly bookingDate)
    {
        var lockName = $"football-booking:{fieldId:N}:{bookingDate:yyyyMMdd}";
        return lockName.Length <= MySqlLockNameMaxLength
            ? lockName
            : lockName[..MySqlLockNameMaxLength];
    }

    private sealed class Releaser(MySqlConnection connection, string lockName) : IAsyncDisposable
    {
        private int _disposed;

        public async ValueTask DisposeAsync()
        {
            if (Interlocked.Exchange(ref _disposed, 1) != 0)
            {
                return;
            }

            try
            {
                await using var command = connection.CreateCommand();
                command.CommandText = "SELECT RELEASE_LOCK(@lockName);";
                command.Parameters.AddWithValue("@lockName", lockName);
                await command.ExecuteScalarAsync();
            }
            finally
            {
                await connection.DisposeAsync();
            }
        }
    }
}
