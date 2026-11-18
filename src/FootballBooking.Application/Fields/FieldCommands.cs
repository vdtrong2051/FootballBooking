using FootballBooking.Domain.Fields;

namespace FootballBooking.Application.Fields;

public sealed record FieldImageCommand(string StoragePath, string? AltText, int SortOrder, bool IsCover);

public sealed record FieldOperatingHourCommand(int DayOfWeek, bool IsClosed, int? OpenMinute, int? CloseMinute);

public sealed record PricingRuleCommand(
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

public sealed record FieldEditorCommand(
    string Code,
    string Name,
    string Slug,
    string FieldType,
    int? Capacity,
    string? Description,
    string? Address,
    IReadOnlyList<string> Amenities,
    int MinimumBookingMinutes,
    int SlotStepMinutes,
    FieldStatus Status,
    IReadOnlyList<FieldImageCommand> Images,
    IReadOnlyList<FieldOperatingHourCommand> OperatingHours,
    IReadOnlyList<PricingRuleCommand> PricingRules,
    Guid? ZoneId = null);

public sealed record FieldBlockCommand(
    Guid FieldId,
    DateOnly BlockDate,
    int StartMinute,
    int EndMinute,
    FieldBlockType BlockType,
    string Reason,
    Guid CreatedByUserId);

public sealed record FieldCommandResult(bool Succeeded, Guid? FieldId, IReadOnlyList<string> Errors)
{
    public static FieldCommandResult Success(Guid fieldId) => new(true, fieldId, []);

    public static FieldCommandResult Failure(IEnumerable<string> errors) => new(false, null, errors.ToArray());
}
