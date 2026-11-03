using System.Collections.Concurrent;
using FootballBooking.Application.Bookings;

namespace FootballBooking.Infrastructure.Bookings;

public sealed class SqliteBookingWriteLock : IBookingWriteLock
{
    private static readonly ConcurrentDictionary<string, SemaphoreSlim> Locks = new(StringComparer.Ordinal);

    public async Task<IAsyncDisposable?> TryAcquireAsync(
        Guid fieldId,
        DateOnly bookingDate,
        TimeSpan timeout,
        CancellationToken cancellationToken)
    {
        var key = $"football-booking:{fieldId:N}:{bookingDate:yyyyMMdd}";
        var semaphore = Locks.GetOrAdd(key, static _ => new SemaphoreSlim(1, 1));
        var acquired = await semaphore.WaitAsync(timeout, cancellationToken);
        return acquired ? new Releaser(semaphore) : null;
    }

    private sealed class Releaser(SemaphoreSlim semaphore) : IAsyncDisposable
    {
        private int _disposed;

        public ValueTask DisposeAsync()
        {
            if (Interlocked.Exchange(ref _disposed, 1) == 0)
            {
                semaphore.Release();
            }

            return ValueTask.CompletedTask;
        }
    }
}
