using FootballBooking.Application.Common.Time;
using FootballBooking.Application.Fields;
using FootballBooking.Domain.Fields;

namespace FootballBooking.Tests.Application;

public sealed class FieldZoneServiceTests
{
    private sealed class FixedClock : ISystemClock
    {
        public DateTimeOffset UtcNow => new(2026, 11, 18, 7, 0, 0, TimeSpan.Zero);
    }
    private sealed class ZoneStore : IFieldZoneStore
    {
        public List<FieldZone> Zones { get; } = [];
        public Task<IReadOnlyList<FieldZoneDto>> ListAsync(bool includeInactive, CancellationToken ct)
            => Task.FromResult<IReadOnlyList<FieldZoneDto>>(Zones
                .Where(z => includeInactive || z.IsActive)
                .Select(z => new FieldZoneDto(z.Id,z.Code,z.Name,z.Description,z.SortOrder,z.IsActive,0,0))
                .ToArray());
        public Task<FieldZone?> FindAsync(Guid id, CancellationToken ct)
            => Task.FromResult(Zones.FirstOrDefault(z => z.Id == id));
        public Task<bool> IsActiveAsync(Guid id, CancellationToken ct)
            => Task.FromResult(Zones.Any(z => z.Id == id && z.IsActive));
        public Task<bool> CodeExistsAsync(string code, Guid? exceptId, CancellationToken ct)
            => Task.FromResult(Zones.Any(z => z.Code == code && z.Id != exceptId));
        public Task AddAsync(FieldZone zone, CancellationToken ct)
        {
            Zones.Add(zone);
            return Task.CompletedTask;
        }
        public Task SaveAsync(CancellationToken ct) => Task.CompletedTask;
    }

    [Fact]
    public async Task CreateZone_ThenDisable_ChangesPublicVisibility()
    {
        var store = new ZoneStore();
        var service = new FieldZoneService(store, new FixedClock());
        var result = await service.SaveAsync(new FieldZoneEditorCommand(null,"a","Khu A",null,0,true));
        Assert.True(result.Succeeded);
        var zone = Assert.Single(store.Zones);
        Assert.Equal("A", zone.Code);
        Assert.Single(await service.ListAsync());
        Assert.True((await service.SetActiveAsync(zone.Id,false)).Succeeded);
        Assert.Empty(await service.ListAsync());
        Assert.Single(await service.ListAsync(true));
    }

    [Fact]
    public async Task DuplicateZoneCode_IsRejected()
    {
        var store = new ZoneStore();
        var service = new FieldZoneService(store, new FixedClock());
        Assert.True((await service.SaveAsync(new FieldZoneEditorCommand(null,"A","Khu A",null,0,true))).Succeeded);
        var result = await service.SaveAsync(new FieldZoneEditorCommand(null,"a","Khác",null,1,true));
        Assert.False(result.Succeeded);
        Assert.Contains("Mã khu đã tồn tại.", result.Errors);
        Assert.Single(store.Zones);
    }
}
