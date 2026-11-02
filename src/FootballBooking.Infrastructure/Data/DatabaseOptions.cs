namespace FootballBooking.Infrastructure.Data;

public sealed class DatabaseOptions
{
    public const string SectionName = "Database";

    public string ServerVersion { get; init; } = "8.4.0";

    public bool EnableRetryOnFailure { get; init; } = true;

    public int MaxRetryCount { get; init; } = 5;

    public int MaxRetryDelaySeconds { get; init; } = 10;

    internal void Validate()
    {
        if (MaxRetryCount < 0)
        {
            throw new InvalidOperationException("Database:MaxRetryCount không được âm.");
        }

        if (MaxRetryDelaySeconds <= 0)
        {
            throw new InvalidOperationException("Database:MaxRetryDelaySeconds phải lớn hơn 0.");
        }
    }
}
