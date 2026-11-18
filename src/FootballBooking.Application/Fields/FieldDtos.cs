using FootballBooking.Domain.Fields;

namespace FootballBooking.Application.Fields;

public sealed record FieldSummaryDto(
    Guid Id,
    string Code,
    string Name,
    string Slug,
    string FieldType,
    int? Capacity,
    string? Address,
    FieldStatus Status,
    string? CoverImagePath,
    string? CoverImageAltText,
    long? PriceFrom,
    IReadOnlyList<string> Amenities,
    Guid? ZoneId = null, string? ZoneName = null);

public sealed record FieldImageDto(string StoragePath, string? AltText, int SortOrder, bool IsCover);

public sealed record FieldOperatingHourDto(int DayOfWeek, bool IsClosed, int? OpenMinute, int? CloseMinute);

public sealed record PricingRuleDto(
    Guid Id,
    string Name,
    PricingRuleType RuleType,
    DateOnly? SpecificDate,
    int? DayOfWeek,
    DateOnly EffectiveFrom,
    DateOnly? EffectiveTo,
    int StartMinute,
    int EndMinute,
    long PricePerHour,
    int Priority,
    bool IsActive);

public sealed record FieldBlockDto(
    Guid Id,
    DateOnly BlockDate,
    int StartMinute,
    int EndMinute,
    FieldBlockType BlockType,
    string Reason);

public sealed record FieldDetailDto(
    Guid Id,
    string Code,
    string Name,
    string Slug,
    string FieldType,
    int? Capacity,
    string? Description,
    string? Address,
    int MinimumBookingMinutes,
    int SlotStepMinutes,
    FieldStatus Status,
    IReadOnlyList<string> Amenities,
    IReadOnlyList<FieldImageDto> Images,
    IReadOnlyList<FieldOperatingHourDto> OperatingHours,
    IReadOnlyList<PricingRuleDto> PricingRules,
    IReadOnlyList<FieldBlockDto> Blocks,
    Guid? ZoneId = null, string? ZoneName = null);
