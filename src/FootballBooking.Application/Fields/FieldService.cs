using System.Text.Encodings.Web;
using System.Text.Json;
using FootballBooking.Application.Common.Time;
using FootballBooking.Application.Bookings;
using FootballBooking.Domain.Fields;

namespace FootballBooking.Application.Fields;

public sealed class FieldService(IFieldStore store, ISystemClock clock,
    IFieldZoneStore? zoneStore = null, IBookingStore? bookingStore = null,
    IBookingWriteLock? writeLock = null) : IFieldService
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
    };

    public Task<IReadOnlyList<FieldSummaryDto>> ListPublicFieldsAsync(CancellationToken cancellationToken = default)
        => store.ListPublicFieldsAsync(cancellationToken);

    public Task<IReadOnlyList<FieldSummaryDto>> ListAdminFieldsAsync(CancellationToken cancellationToken = default)
        => store.ListAdminFieldsAsync(cancellationToken);

    public Task<FieldDetailDto?> GetFieldDetailBySlugAsync(string slug, CancellationToken cancellationToken = default)
        => store.GetFieldDetailBySlugAsync(slug, cancellationToken);

    public Task<FieldDetailDto?> GetFieldDetailByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => store.GetFieldDetailByIdAsync(id, cancellationToken);

    public async Task<FieldCommandResult> CreateFieldAsync(FieldEditorCommand command, CancellationToken cancellationToken = default)
    {
        var errors = await ValidateEditorAsync(command, null, cancellationToken);
        if (errors.Count > 0)
        {
            return FieldCommandResult.Failure(errors);
        }

        var now = clock.UtcNow;
        var fieldId = Guid.NewGuid();
        var field = new Field(
            fieldId,
            command.Code,
            command.Name,
            command.Slug,
            command.FieldType,
            command.Capacity,
            command.Description,
            command.Address,
            SerializeAmenities(command.Amenities),
            command.MinimumBookingMinutes,
            command.SlotStepMinutes,
            command.Status,
            now);

        field.AssignZone(command.ZoneId, now);
        ReplaceChildren(field, command, fieldId, now);

        await store.AddFieldAsync(field, cancellationToken);
        await store.SaveChangesAsync(cancellationToken);

        return FieldCommandResult.Success(field.Id);
    }

    public async Task<FieldCommandResult> UpdateFieldAsync(Guid fieldId, FieldEditorCommand command, CancellationToken cancellationToken = default)
    {
        var field = await store.GetFieldForUpdateAsync(fieldId, cancellationToken);
        if (field is null)
        {
            return FieldCommandResult.Failure(["Không tìm thấy sân cần cập nhật."]);
        }

        var errors = await ValidateEditorAsync(command, fieldId, cancellationToken);
        if (errors.Count > 0)
        {
            return FieldCommandResult.Failure(errors);
        }

        var now = clock.UtcNow;
        field.UpdateDetails(
            command.Code,
            command.Name,
            command.Slug,
            command.FieldType,
            command.Capacity,
            command.Description,
            command.Address,
            SerializeAmenities(command.Amenities),
            command.MinimumBookingMinutes,
            command.SlotStepMinutes,
            command.Status,
            now);
        field.AssignZone(command.ZoneId, now);
        ReplaceChildren(field, command, fieldId, now);

        await store.SaveChangesAsync(cancellationToken);

        return FieldCommandResult.Success(field.Id);
    }

    public async Task<FieldCommandResult> AddBlockAsync(FieldBlockCommand command, CancellationToken cancellationToken = default)
    {
        var errors = ValidateBlock(command);
        if (errors.Count > 0) return FieldCommandResult.Failure(errors);
        if (bookingStore is null || writeLock is null)
            return FieldCommandResult.Failure(["Không thể kiểm tra lịch booking để khóa sân an toàn."]);

        // GĐ5-C: same MySQL field/date lock as BookingService.CreateBookingAsync.
        await using var guard = await writeLock.TryAcquireAsync(command.FieldId,
            command.BlockDate, TimeSpan.FromSeconds(5), cancellationToken);
        if (guard is null) return FieldCommandResult.Failure(["Sân đang có thao tác đặt lịch khác."]);
        var field = await store.GetFieldForUpdateAsync(command.FieldId, cancellationToken);
        if (field is null) return FieldCommandResult.Failure(["Không tìm thấy sân cần khóa lịch."]);
        if (field.Blocks.Any(x => x.BlockDate == command.BlockDate
            && command.StartMinute < x.EndMinute && command.EndMinute > x.StartMinute))
            return FieldCommandResult.Failure(["Khung giờ đã có lịch khóa sân khác."]);
        var bookings = await bookingStore.ListBookingsForFieldDateAsync(
            command.FieldId, command.BlockDate, cancellationToken);
        if (bookings.Any(x => x.BlocksAvailability(clock.UtcNow)
            && x.Overlaps(command.BlockDate, command.StartMinute, command.EndMinute)))
            return FieldCommandResult.Failure(["Khung giờ đang có booking; không thể khóa sân khi chưa xử lý booking hiện hữu."]);

        field.AddBlock(new FieldBlock(
            Guid.NewGuid(),
            command.FieldId,
            command.BlockDate,
            command.StartMinute,
            command.EndMinute,
            command.BlockType,
            command.Reason,
            command.CreatedByUserId,
            clock.UtcNow));

        await store.SaveChangesAsync(cancellationToken);

        return FieldCommandResult.Success(field.Id);
    }

    private static void ReplaceChildren(Field field, FieldEditorCommand command, Guid fieldId, DateTimeOffset now)
    {
        field.ReplaceImages(command.Images.Select(image => new FieldImage(Guid.NewGuid(), fieldId, image.StoragePath, image.AltText, image.SortOrder, image.IsCover, now)));
        field.ReplaceOperatingHours(command.OperatingHours.Select(hour => new FieldOperatingHour(Guid.NewGuid(), fieldId, hour.DayOfWeek, hour.IsClosed, hour.OpenMinute, hour.CloseMinute)));
        field.ReplacePricingRules(command.PricingRules.Select(rule => CreatePricingRule(fieldId, rule, now)));
    }

    private async Task<List<string>> ValidateEditorAsync(FieldEditorCommand command, Guid? fieldId, CancellationToken cancellationToken)
    {
        var errors = new List<string>();

        Required(command.Code, "Vui lòng nhập mã sân.", errors);
        Required(command.Name, "Vui lòng nhập tên sân.", errors);
        Required(command.Slug, "Vui lòng nhập đường dẫn công khai.", errors);
        Required(command.FieldType, "Vui lòng nhập loại sân.", errors);

        if (command.Code.Length > 30)
        {
            errors.Add("Mã sân tối đa 30 ký tự.");
        }

        if (command.Name.Length > 120)
        {
            errors.Add("Tên sân tối đa 120 ký tự.");
        }

        if (command.Slug.Length > 160)
        {
            errors.Add("Đường dẫn công khai tối đa 160 ký tự.");
        }

        if (command.MinimumBookingMinutes <= 0)
        {
            errors.Add("Thời lượng đặt tối thiểu phải lớn hơn 0.");
        }

        if (command.SlotStepMinutes <= 0)
        {
            errors.Add("Bước khung giờ phải lớn hơn 0.");
        }

        if (command.Capacity is <= 0)
        {
            errors.Add("Sức chứa phải lớn hơn 0 nếu có nhập.");
        }

        if (await store.CodeExistsAsync(command.Code.Trim(), fieldId, cancellationToken))
        {
            errors.Add("Mã sân đã tồn tại.");
        }

        if (await store.SlugExistsAsync(command.Slug.Trim(), fieldId, cancellationToken))
        {
            errors.Add("Đường dẫn công khai đã tồn tại.");
        }

        if (command.ZoneId is null || command.ZoneId == Guid.Empty)
            errors.Add("Vui lòng chọn phân khu cho sân.");
        else if (zoneStore is null || !await zoneStore.IsActiveAsync(command.ZoneId.Value, cancellationToken))
            errors.Add("Phân khu không tồn tại hoặc đã ngừng nhận đặt.");

        ValidateImages(command.Images, errors);
        ValidateOperatingHours(command.OperatingHours, errors);
        ValidatePricingRules(command.PricingRules, errors);

        return errors;
    }

    private static void ValidateImages(IReadOnlyList<FieldImageCommand> images, List<string> errors)
    {
        if (images.Count == 0)
        {
            errors.Add("Vui lòng cấu hình ít nhất một ảnh sân.");
            return;
        }

        if (images.Count(image => image.IsCover) != 1)
        {
            errors.Add("Mỗi sân cần đúng một ảnh đại diện.");
        }
    }

    private static void ValidateOperatingHours(IReadOnlyList<FieldOperatingHourCommand> hours, List<string> errors)
    {
        if (hours.Count != 7 || hours.Select(hour => hour.DayOfWeek).Distinct().Count() != 7)
        {
            errors.Add("Giờ hoạt động cần đủ 7 ngày trong tuần.");
        }

        foreach (var hour in hours)
        {
            if (hour.DayOfWeek is < 0 or > 6)
            {
                errors.Add("Ngày trong tuần phải từ 0 đến 6.");
            }

            if (hour.IsClosed)
            {
                continue;
            }

            if (hour.OpenMinute is null || hour.CloseMinute is null || !IsValidInterval(hour.OpenMinute.Value, hour.CloseMinute.Value))
            {
                errors.Add("Giờ hoạt động phải nằm trong khoảng 00:00 đến 24:00 và giờ mở nhỏ hơn giờ đóng.");
            }
        }
    }

    private static void ValidatePricingRules(IReadOnlyList<PricingRuleCommand> rules, List<string> errors)
    {
        if (rules.Count == 0)
        {
            errors.Add("Vui lòng cấu hình ít nhất một quy tắc giá.");
            return;
        }

        foreach (var rule in rules)
        {
            Required(rule.Name, "Vui lòng nhập tên quy tắc giá.", errors);
            if (!IsValidInterval(rule.StartMinute, rule.EndMinute))
            {
                errors.Add("Khung giờ giá phải hợp lệ.");
            }

            if (rule.PricePerHour < 0)
            {
                errors.Add("Giá theo giờ không được âm.");
            }

            if (rule.EffectiveTo is not null && rule.EffectiveTo < rule.EffectiveFrom)
            {
                errors.Add("Ngày kết thúc hiệu lực phải sau ngày bắt đầu.");
            }

            if (rule.DayOfWeek is < 0 or > 6)
            {
                errors.Add("Ngày áp dụng giá phải từ 0 đến 6 nếu có nhập.");
            }
        }
    }

    private static List<string> ValidateBlock(FieldBlockCommand command)
    {
        var errors = new List<string>();

        if (!IsValidInterval(command.StartMinute, command.EndMinute))
        {
            errors.Add("Khung giờ khóa sân không hợp lệ.");
        }

        Required(command.Reason, "Vui lòng nhập lý do khóa sân.", errors);
        if (command.CreatedByUserId == Guid.Empty)
        {
            errors.Add("Không xác định được người tạo lịch khóa sân.");
        }

        return errors;
    }

    private static PricingRule CreatePricingRule(Guid fieldId, PricingRuleCommand rule, DateTimeOffset now)
        => new(
            Guid.NewGuid(),
            fieldId,
            rule.Name,
            rule.RuleType,
            rule.SpecificDate,
            rule.DayOfWeek,
            rule.EffectiveFrom,
            rule.EffectiveTo,
            rule.StartMinute,
            rule.EndMinute,
            rule.PricePerHour,
            rule.Priority,
            rule.IsActive,
            now);

    private static string? SerializeAmenities(IReadOnlyList<string> amenities)
    {
        var cleaned = amenities
            .Select(amenity => amenity.Trim())
            .Where(amenity => amenity.Length > 0)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToArray();

        return cleaned.Length == 0 ? null : JsonSerializer.Serialize(cleaned, JsonOptions);
    }

    private static bool IsValidInterval(int startMinute, int endMinute)
        => startMinute >= 0 && startMinute < endMinute && endMinute <= 1440;

    private static void Required(string? value, string message, List<string> errors)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            errors.Add(message);
        }
    }
}
