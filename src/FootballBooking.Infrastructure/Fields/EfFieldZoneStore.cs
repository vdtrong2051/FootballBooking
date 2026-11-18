using FootballBooking.Application.Fields;
using FootballBooking.Domain.Fields;
using FootballBooking.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FootballBooking.Infrastructure.Fields;

public sealed class EfFieldZoneStore(ApplicationDbContext db) : IFieldZoneStore
{
    public async Task<IReadOnlyList<FieldZoneDto>> ListAsync(bool includeInactive, CancellationToken ct)
    {
        var query = db.FieldZones.AsNoTracking().AsQueryable();
        if (!includeInactive) query = query.Where(x => x.IsActive);
        var zones = await query.OrderBy(x => x.SortOrder).ThenBy(x => x.Code).ToListAsync(ct);
        // Materialize only minimal columns. Avoid provider-specific GroupBy translations.
        var fields = await db.Fields.AsNoTracking()
            .Select(x => new { x.ZoneId, x.Status }).ToListAsync(ct);
        return zones.Select(zone => new FieldZoneDto(zone.Id, zone.Code, zone.Name,
            zone.Description, zone.SortOrder, zone.IsActive,
            fields.Count(x => x.ZoneId == zone.Id),
            fields.Count(x => x.ZoneId == zone.Id && x.Status == FieldStatus.Active))).ToArray();
    }

    public Task<FieldZone?> FindAsync(Guid id, CancellationToken ct)
        => db.FieldZones.FirstOrDefaultAsync(x => x.Id == id, ct);

    public Task<bool> IsActiveAsync(Guid id, CancellationToken ct)
        => db.FieldZones.AnyAsync(x => x.Id == id && x.IsActive, ct);

    public Task<bool> CodeExistsAsync(string code, Guid? exceptId, CancellationToken ct)
        => db.FieldZones.AnyAsync(x => x.Code == code && (exceptId == null || x.Id != exceptId.Value), ct);

    public async Task AddAsync(FieldZone zone, CancellationToken ct)
        => await db.FieldZones.AddAsync(zone, ct);

    public Task SaveAsync(CancellationToken ct) => db.SaveChangesAsync(ct);
}
