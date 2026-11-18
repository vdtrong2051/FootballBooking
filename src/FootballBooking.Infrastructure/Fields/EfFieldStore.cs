using System.Text.Json;
using FootballBooking.Application.Fields;
using FootballBooking.Domain.Fields;
using FootballBooking.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FootballBooking.Infrastructure.Fields;

public sealed class EfFieldStore(ApplicationDbContext dbContext) : IFieldStore
{
    public async Task<IReadOnlyList<FieldSummaryDto>> ListPublicFieldsAsync(CancellationToken cancellationToken)
    {
        var fields = await QueryFields()
            .Where(field => field.Status == FieldStatus.Active && (field.ZoneId == null || field.Zone!.IsActive))
            .OrderBy(field => field.Name)
            .ToListAsync(cancellationToken);

        return fields.Select(ToSummaryDto).ToArray();
    }

    public async Task<IReadOnlyList<FieldSummaryDto>> ListAdminFieldsAsync(CancellationToken cancellationToken)
    {
        var fields = await QueryFields()
            .OrderBy(field => field.Code)
            .ToListAsync(cancellationToken);

        return fields.Select(ToSummaryDto).ToArray();
    }

    public async Task<FieldDetailDto?> GetFieldDetailBySlugAsync(string slug, CancellationToken cancellationToken)
    {
        var field = await QueryFields()
            .FirstOrDefaultAsync(field => field.Slug == slug, cancellationToken);

        return field is null ? null : ToDetailDto(field);
    }

    public async Task<FieldDetailDto?> GetFieldDetailByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var field = await QueryFields()
            .FirstOrDefaultAsync(field => field.Id == id, cancellationToken);

        return field is null ? null : ToDetailDto(field);
    }

    public Task<Field?> GetFieldForUpdateAsync(Guid id, CancellationToken cancellationToken)
        => dbContext.Fields
            .Include(field => field.Zone)
            .Include(field => field.Images)
            .Include(field => field.OperatingHours)
            .Include(field => field.Blocks)
            .Include(field => field.PricingRules)
            .FirstOrDefaultAsync(field => field.Id == id, cancellationToken);

    public Task<bool> CodeExistsAsync(string code, Guid? exceptFieldId, CancellationToken cancellationToken)
        => dbContext.Fields.AnyAsync(
            field => field.Code == code && (exceptFieldId == null || field.Id != exceptFieldId.Value),
            cancellationToken);

    public Task<bool> SlugExistsAsync(string slug, Guid? exceptFieldId, CancellationToken cancellationToken)
        => dbContext.Fields.AnyAsync(
            field => field.Slug == slug && (exceptFieldId == null || field.Id != exceptFieldId.Value),
            cancellationToken);

    public async Task AddFieldAsync(Field field, CancellationToken cancellationToken)
        => await dbContext.Fields.AddAsync(field, cancellationToken);

    public Task SaveChangesAsync(CancellationToken cancellationToken)
        => dbContext.SaveChangesAsync(cancellationToken);

    private IQueryable<Field> QueryFields()
        => dbContext.Fields
            .AsNoTracking()
            .Include(field => field.Zone)
            .Include(field => field.Images)
            .Include(field => field.OperatingHours)
            .Include(field => field.Blocks)
            .Include(field => field.PricingRules);

    private static FieldSummaryDto ToSummaryDto(Field field)
    {
        var cover = field.Images.OrderByDescending(image => image.IsCover).ThenBy(image => image.SortOrder).FirstOrDefault();
        var priceFrom = field.PricingRules
            .Where(rule => rule.IsActive)
            .OrderBy(rule => rule.PricePerHour)
            .Select(rule => (long?)rule.PricePerHour)
            .FirstOrDefault();

        return new FieldSummaryDto(
            field.Id,
            field.Code,
            field.Name,
            field.Slug,
            field.FieldType,
            field.Capacity,
            field.Address,
            field.Status,
            cover?.StoragePath,
            cover?.AltText,
            priceFrom,
            ParseAmenities(field.AmenitiesJson), field.ZoneId, field.Zone?.Name);
    }

    private static FieldDetailDto ToDetailDto(Field field)
        => new(
            field.Id,
            field.Code,
            field.Name,
            field.Slug,
            field.FieldType,
            field.Capacity,
            field.Description,
            field.Address,
            field.MinimumBookingMinutes,
            field.SlotStepMinutes,
            field.Status,
            ParseAmenities(field.AmenitiesJson),
            field.Images.OrderBy(image => image.SortOrder).Select(image => new FieldImageDto(image.StoragePath, image.AltText, image.SortOrder, image.IsCover)).ToArray(),
            field.OperatingHours.OrderBy(hour => hour.DayOfWeek).Select(hour => new FieldOperatingHourDto(hour.DayOfWeek, hour.IsClosed, hour.OpenMinute, hour.CloseMinute)).ToArray(),
            field.PricingRules.OrderBy(rule => rule.StartMinute).Select(rule => new PricingRuleDto(rule.Id, rule.Name, rule.RuleType, rule.SpecificDate, rule.DayOfWeek, rule.EffectiveFrom, rule.EffectiveTo, rule.StartMinute, rule.EndMinute, rule.PricePerHour, rule.Priority, rule.IsActive)).ToArray(),
            field.Blocks.OrderByDescending(block => block.BlockDate).ThenBy(block => block.StartMinute).Select(block => new FieldBlockDto(block.Id, block.BlockDate, block.StartMinute, block.EndMinute, block.BlockType, block.Reason)).ToArray(),
            field.ZoneId, field.Zone?.Name);

    private static IReadOnlyList<string> ParseAmenities(string? amenitiesJson)
    {
        if (string.IsNullOrWhiteSpace(amenitiesJson))
        {
            return [];
        }

        try
        {
            return JsonSerializer.Deserialize<string[]>(amenitiesJson) ?? [];
        }
        catch (JsonException)
        {
            return [];
        }
    }
}
