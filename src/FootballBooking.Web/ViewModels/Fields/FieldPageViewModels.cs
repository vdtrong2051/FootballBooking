using FootballBooking.Application.Fields;

namespace FootballBooking.Web.ViewModels.Fields;

public sealed record FieldListPageViewModel(IReadOnlyList<FieldSummaryDto> Fields)
{
    public IReadOnlyList<FieldZoneDto> Zones { get; init; } = [];
    public Guid? ZoneId { get; init; }
    public string? FieldType { get; init; }
    public string? Date { get; init; }
    public string? Time { get; init; }
    public int DurationMinutes { get; init; } = 60;
    public IReadOnlyList<ZoneAvailableCountDto> ZoneCounts { get; init; } = [];
}

public sealed record ZoneAvailableCountDto(Guid ZoneId, int TotalFields, int AvailableFields);

public sealed record FieldDetailPageViewModel(FieldDetailDto Field);
