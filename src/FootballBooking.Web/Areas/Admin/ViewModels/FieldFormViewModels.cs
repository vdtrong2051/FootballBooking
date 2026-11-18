using System.ComponentModel.DataAnnotations;
using System.Globalization;
using FootballBooking.Application.Fields;
using FootballBooking.Domain.Fields;

namespace FootballBooking.Web.Areas.Admin.ViewModels;

public sealed class FieldFormViewModel
{
    public Guid? Id { get; set; }

    [Display(Name = "Phân khu")]
    public Guid? ZoneId { get; set; }

    [Required(ErrorMessage = "Vui lòng nhập mã sân.")]
    [Display(Name = "Mã sân")]
    public string Code { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vui lòng nhập tên sân.")]
    [Display(Name = "Tên sân")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vui lòng nhập đường dẫn công khai.")]
    [Display(Name = "Đường dẫn công khai")]
    public string Slug { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vui lòng nhập loại sân.")]
    [Display(Name = "Loại sân")]
    public string FieldType { get; set; } = string.Empty;

    [Display(Name = "Sức chứa")]
    public int? Capacity { get; set; }

    [Display(Name = "Mô tả")]
    public string? Description { get; set; }

    [Display(Name = "Địa chỉ")]
    public string? Address { get; set; }

    [Display(Name = "Tiện ích")]
    public string AmenitiesText { get; set; } = string.Empty;

    [Display(Name = "Thời lượng tối thiểu")]
    public int MinimumBookingMinutes { get; set; } = 60;

    [Display(Name = "Bước khung giờ")]
    public int SlotStepMinutes { get; set; } = 30;

    [Display(Name = "Trạng thái")]
    public FieldStatus Status { get; set; } = FieldStatus.Active;

    public List<FieldImageFormViewModel> Images { get; set; } = [];
    public List<FieldOperatingHourFormViewModel> OperatingHours { get; set; } = [];
    public List<PricingRuleFormViewModel> PricingRules { get; set; } = [];

    public FieldEditorCommand ToCommand()
        => new(
            Code,
            Name,
            Slug,
            FieldType,
            Capacity,
            Description,
            Address,
            AmenitiesText.Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries),
            MinimumBookingMinutes,
            SlotStepMinutes,
            Status,
            Images.Select(image => new FieldImageCommand(image.StoragePath, image.AltText, image.SortOrder, image.IsCover)).ToArray(),
            OperatingHours.Select(hour => new FieldOperatingHourCommand(hour.DayOfWeek, hour.IsClosed, hour.OpenMinute, hour.CloseMinute)).ToArray(),
            PricingRules.Select(rule => new PricingRuleCommand(rule.Name, rule.RuleType, rule.SpecificDate, rule.DayOfWeek, rule.EffectiveFrom, rule.EffectiveTo, rule.StartMinute, rule.EndMinute, rule.PricePerHour, rule.Priority, rule.IsActive)).ToArray(),
            ZoneId);

    public static FieldFormViewModel CreateDefault()
        => new()
        {
            Status = FieldStatus.Active,
            Address = "12 đường D5, Phường 25, Quận Bình Thạnh",
            AmenitiesText = "Cỏ nhân tạo, Đèn LED, Gửi xe miễn phí, Khu vực thay đồ",
            Images =
            [
                new() { StoragePath = "/images/fields/san-5a.svg", AltText = "Ảnh sân bóng", SortOrder = 1, IsCover = true }
            ],
            OperatingHours = Enumerable.Range(0, 7)
                .Select(day => new FieldOperatingHourFormViewModel { DayOfWeek = day, IsClosed = false, OpenMinute = 360, CloseMinute = 1380 })
                .ToList(),
            PricingRules =
            [
                new() { Name = "Giá ban ngày", RuleType = PricingRuleType.Weekday, EffectiveFrom = new DateOnly(2026, 1, 1), StartMinute = 360, EndMinute = 1080, PricePerHour = 200000, Priority = 10, IsActive = true },
                new() { Name = "Giá buổi tối", RuleType = PricingRuleType.Weekday, EffectiveFrom = new DateOnly(2026, 1, 1), StartMinute = 1080, EndMinute = 1380, PricePerHour = 250000, Priority = 20, IsActive = true }
            ]
        };

    public static FieldFormViewModel FromDetail(FieldDetailDto detail)
        => new()
        {
            Id = detail.Id,
            ZoneId = detail.ZoneId,
            Code = detail.Code,
            Name = detail.Name,
            Slug = detail.Slug,
            FieldType = detail.FieldType,
            Capacity = detail.Capacity,
            Description = detail.Description,
            Address = detail.Address,
            AmenitiesText = string.Join(", ", detail.Amenities),
            MinimumBookingMinutes = detail.MinimumBookingMinutes,
            SlotStepMinutes = detail.SlotStepMinutes,
            Status = detail.Status,
            Images = detail.Images.Select(image => new FieldImageFormViewModel { StoragePath = image.StoragePath, AltText = image.AltText, SortOrder = image.SortOrder, IsCover = image.IsCover }).ToList(),
            OperatingHours = detail.OperatingHours.Select(hour => new FieldOperatingHourFormViewModel { DayOfWeek = hour.DayOfWeek, IsClosed = hour.IsClosed, OpenMinute = hour.OpenMinute, CloseMinute = hour.CloseMinute }).ToList(),
            PricingRules = detail.PricingRules.Select(rule => new PricingRuleFormViewModel { Name = rule.Name, RuleType = rule.RuleType, SpecificDate = rule.SpecificDate, DayOfWeek = rule.DayOfWeek, EffectiveFrom = rule.EffectiveFrom, EffectiveTo = rule.EffectiveTo, StartMinute = rule.StartMinute, EndMinute = rule.EndMinute, PricePerHour = rule.PricePerHour, Priority = rule.Priority, IsActive = rule.IsActive }).ToList()
        };
}

public sealed class FieldImageFormViewModel
{
    public string StoragePath { get; set; } = string.Empty;
    public string? AltText { get; set; }
    public int SortOrder { get; set; }
    public bool IsCover { get; set; }
}

public sealed class FieldOperatingHourFormViewModel
{
    public int DayOfWeek { get; set; }
    public bool IsClosed { get; set; }
    public int? OpenMinute { get; set; }
    public int? CloseMinute { get; set; }
}

public sealed class PricingRuleFormViewModel
{
    public string Name { get; set; } = string.Empty;
    public PricingRuleType RuleType { get; set; } = PricingRuleType.Weekday;
    public DateOnly? SpecificDate { get; set; }
    public int? DayOfWeek { get; set; }
    public DateOnly EffectiveFrom { get; set; } = new(2026, 1, 1);
    public DateOnly? EffectiveTo { get; set; }
    public int StartMinute { get; set; }
    public int EndMinute { get; set; }
    public long PricePerHour { get; set; }
    public int Priority { get; set; }
    public bool IsActive { get; set; } = true;
}

public sealed class FieldBlockFormViewModel
{
    public Guid FieldId { get; set; }

    [Required(ErrorMessage = "Vui lòng nhập ngày khóa sân.")]
    public string BlockDateText { get; set; } = new DateOnly(2026, 7, 25).ToString("dd/MM/yyyy", CultureInfo.InvariantCulture);

    public int StartMinute { get; set; } = 1080;
    public int EndMinute { get; set; } = 1200;
    public FieldBlockType BlockType { get; set; } = FieldBlockType.Maintenance;
    public string Reason { get; set; } = string.Empty;

    public DateOnly? ParseBlockDate()
        => DateOnly.TryParseExact(BlockDateText, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out var blockDate)
            ? blockDate
            : null;
}
