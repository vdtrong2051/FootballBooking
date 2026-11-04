using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace FootballBooking.Infrastructure.Data.Converters;

/// <summary>
/// Nullable counterpart of <see cref="DateOnlyConverter"/>.
/// </summary>
public sealed class NullableDateOnlyConverter()
    : ValueConverter<DateOnly?, DateTime?>(
        date => date.HasValue ? date.Value.ToDateTime(TimeOnly.MinValue) : null,
        value => value.HasValue ? DateOnly.FromDateTime(value.Value) : null);
