namespace FootballBooking.Domain.Fields;

public sealed class Field
{
    private readonly List<FieldImage> _images = [];
    private readonly List<FieldOperatingHour> _operatingHours = [];
    private readonly List<FieldBlock> _blocks = [];
    private readonly List<PricingRule> _pricingRules = [];

    private Field()
    {
    }

    public Field(
        Guid id,
        string code,
        string name,
        string slug,
        string fieldType,
        int? capacity,
        string? description,
        string? address,
        string? amenitiesJson,
        int minimumBookingMinutes,
        int slotStepMinutes,
        FieldStatus status,
        DateTimeOffset utcNow)
    {
        Id = id;
        UpdateDetails(code, name, slug, fieldType, capacity, description, address, amenitiesJson, minimumBookingMinutes, slotStepMinutes, status, utcNow);
        CreatedAtUtc = utcNow;
    }

    public Guid Id { get; private set; }
    public Guid? ZoneId { get; private set; }
    public FieldZone? Zone { get; private set; }
    public string Code { get; private set; } = string.Empty;
    public string Name { get; private set; } = string.Empty;
    public string Slug { get; private set; } = string.Empty;
    public string FieldType { get; private set; } = string.Empty;
    public int? Capacity { get; private set; }
    public string? Description { get; private set; }
    public string? Address { get; private set; }
    public string? AmenitiesJson { get; private set; }
    public int MinimumBookingMinutes { get; private set; }
    public int SlotStepMinutes { get; private set; }
    public FieldStatus Status { get; private set; }
    public DateTimeOffset CreatedAtUtc { get; private set; }
    public DateTimeOffset UpdatedAtUtc { get; private set; }

    public IReadOnlyCollection<FieldImage> Images => _images;
    public IReadOnlyCollection<FieldOperatingHour> OperatingHours => _operatingHours;
    public IReadOnlyCollection<FieldBlock> Blocks => _blocks;
    public IReadOnlyCollection<PricingRule> PricingRules => _pricingRules;

    public void UpdateDetails(
        string code,
        string name,
        string slug,
        string fieldType,
        int? capacity,
        string? description,
        string? address,
        string? amenitiesJson,
        int minimumBookingMinutes,
        int slotStepMinutes,
        FieldStatus status,
        DateTimeOffset utcNow)
    {
        Code = code.Trim();
        Name = name.Trim();
        Slug = slug.Trim();
        FieldType = fieldType.Trim();
        Capacity = capacity;
        Description = string.IsNullOrWhiteSpace(description) ? null : description.Trim();
        Address = string.IsNullOrWhiteSpace(address) ? null : address.Trim();
        AmenitiesJson = string.IsNullOrWhiteSpace(amenitiesJson) ? null : amenitiesJson.Trim();
        MinimumBookingMinutes = minimumBookingMinutes;
        SlotStepMinutes = slotStepMinutes;
        Status = status;
        UpdatedAtUtc = utcNow;
    }

    public void AssignZone(Guid? zoneId, DateTimeOffset now)
    {
        ZoneId = zoneId;
        UpdatedAtUtc = now;
    }

    public void ReplaceImages(IEnumerable<FieldImage> images)
    {
        _images.Clear();
        _images.AddRange(images.OrderBy(image => image.SortOrder));
    }

    public void ReplaceOperatingHours(IEnumerable<FieldOperatingHour> operatingHours)
    {
        _operatingHours.Clear();
        _operatingHours.AddRange(operatingHours.OrderBy(hour => hour.DayOfWeek));
    }

    public void ReplacePricingRules(IEnumerable<PricingRule> pricingRules)
    {
        _pricingRules.Clear();
        _pricingRules.AddRange(pricingRules.OrderBy(rule => rule.StartMinute));
    }

    public void AddBlock(FieldBlock block)
    {
        _blocks.Add(block);
    }
}
