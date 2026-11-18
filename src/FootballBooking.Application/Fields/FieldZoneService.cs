using FootballBooking.Application.Common.Time;
using FootballBooking.Domain.Fields;

namespace FootballBooking.Application.Fields;

public sealed record FieldZoneDto(Guid Id, string Code, string Name,
    string? Description, int SortOrder, bool IsActive, int TotalFields, int ActiveFields);

public sealed record FieldZoneEditorCommand(Guid? Id, string Code, string Name,
    string? Description, int SortOrder, bool IsActive);

public sealed record FieldZoneResult(bool Succeeded, IReadOnlyList<string> Errors)
{
    public static FieldZoneResult Ok() => new(true, []);
    public static FieldZoneResult Fail(string error) => new(false, [error]);
}

public interface IFieldZoneStore
{
    Task<IReadOnlyList<FieldZoneDto>> ListAsync(bool includeInactive, CancellationToken ct);
    Task<FieldZone?> FindAsync(Guid id, CancellationToken ct);
    Task<bool> IsActiveAsync(Guid id, CancellationToken ct);
    Task<bool> CodeExistsAsync(string code, Guid? exceptId, CancellationToken ct);
    Task AddAsync(FieldZone zone, CancellationToken ct);
    Task SaveAsync(CancellationToken ct);
}

public interface IFieldZoneService
{
    Task<IReadOnlyList<FieldZoneDto>> ListAsync(bool includeInactive = false, CancellationToken ct = default);
    Task<bool> IsActiveAsync(Guid id, CancellationToken ct = default);
    Task<FieldZoneResult> SaveAsync(FieldZoneEditorCommand command, CancellationToken ct = default);
    Task<FieldZoneResult> SetActiveAsync(Guid id, bool enabled, CancellationToken ct = default);
}

public sealed class FieldZoneService(IFieldZoneStore store, ISystemClock clock) : IFieldZoneService
{
    public Task<IReadOnlyList<FieldZoneDto>> ListAsync(bool includeInactive = false, CancellationToken ct = default)
        => store.ListAsync(includeInactive, ct);

    public Task<bool> IsActiveAsync(Guid id, CancellationToken ct = default)
        => store.IsActiveAsync(id, ct);

    public async Task<FieldZoneResult> SaveAsync(FieldZoneEditorCommand command, CancellationToken ct = default)
    {
        if (command.Id == Guid.Empty) return FieldZoneResult.Fail("ID khu không hợp lệ.");
        if (string.IsNullOrWhiteSpace(command.Code) || string.IsNullOrWhiteSpace(command.Name))
            return FieldZoneResult.Fail("Mã và tên khu không được để trống.");
        var code = command.Code.Trim().ToUpperInvariant();
        if (await store.CodeExistsAsync(code, command.Id, ct))
            return FieldZoneResult.Fail("Mã khu đã tồn tại.");
        var now = clock.UtcNow;
        try
        {
            if (command.Id is null)
            {
                var zone = new FieldZone(Guid.NewGuid(), code, command.Name, command.Description,
                    command.SortOrder, command.IsActive, now);
                await store.AddAsync(zone, ct);
            }
            else
            {
                var zone = await store.FindAsync(command.Id.Value, ct);
                if (zone is null) return FieldZoneResult.Fail("Không tìm thấy phân khu.");
                zone.Update(code, command.Name, command.Description, command.SortOrder,
                    command.IsActive, now);
            }
        }
        catch (ArgumentException ex) { return FieldZoneResult.Fail(ex.Message); }
        await store.SaveAsync(ct);
        return FieldZoneResult.Ok();
    }

    public async Task<FieldZoneResult> SetActiveAsync(Guid id, bool enabled, CancellationToken ct = default)
    {
        var zone = await store.FindAsync(id, ct);
        if (zone is null) return FieldZoneResult.Fail("Không tìm thấy phân khu.");
        zone.SetActive(enabled, clock.UtcNow);
        await store.SaveAsync(ct);
        return FieldZoneResult.Ok();
    }
}
