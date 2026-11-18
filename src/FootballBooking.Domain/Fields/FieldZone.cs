namespace FootballBooking.Domain.Fields;

public sealed class FieldZone
{
    private FieldZone() { }

    public FieldZone(Guid id, string code, string name, string? description,
        int sortOrder, bool isActive, DateTimeOffset now)
    {
        Id = id;
        CreatedAtUtc = now;
        Update(code, name, description, sortOrder, isActive, now);
    }

    public Guid Id { get; private set; }
    public string Code { get; private set; } = string.Empty;
    public string Name { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public int SortOrder { get; private set; }
    public bool IsActive { get; private set; }
    public DateTimeOffset CreatedAtUtc { get; private set; }
    public DateTimeOffset UpdatedAtUtc { get; private set; }

    public void Update(string code, string name, string? description,
        int sortOrder, bool isActive, DateTimeOffset now)
    {
        if (string.IsNullOrWhiteSpace(code) || code.Trim().Length > 20
            || !System.Text.RegularExpressions.Regex.IsMatch(code.Trim(), @"^[A-Za-z0-9-]+$"))
            throw new ArgumentException("Mã khu chỉ gồm chữ, số và dấu gạch ngang (tối đa 20 ký tự).");
        if (string.IsNullOrWhiteSpace(name) || name.Trim().Length > 100)
            throw new ArgumentException("Tên khu phải có từ 1 đến 100 ký tự.");
        if (description?.Length > 500)
            throw new ArgumentException("Mô tả khu tối đa 500 ký tự.");
        if (sortOrder < 0 || sortOrder > 10000)
            throw new ArgumentOutOfRangeException(nameof(sortOrder));
        Code = code.Trim().ToUpperInvariant();
        Name = name.Trim();
        Description = string.IsNullOrWhiteSpace(description) ? null : description.Trim();
        SortOrder = sortOrder;
        IsActive = isActive;
        UpdatedAtUtc = now;
    }

    public void SetActive(bool isActive, DateTimeOffset now)
    {
        IsActive = isActive;
        UpdatedAtUtc = now;
    }
}
