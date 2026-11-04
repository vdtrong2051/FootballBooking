using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace FootballBooking.Infrastructure.Data.Converters;

/// <summary>
/// Converts domain dates to <see cref="DateTime"/> for providers that return
/// MySQL DATE columns as DateTime instead of DateOnly.
/// </summary>
public sealed class DateOnlyConverter()
    : ValueConverter<DateOnly, DateTime>(
        date => date.ToDateTime(TimeOnly.MinValue),
        value => DateOnly.FromDateTime(value));
