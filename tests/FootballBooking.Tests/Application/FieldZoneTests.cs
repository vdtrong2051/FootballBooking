using FootballBooking.Domain.Fields;

namespace FootballBooking.Tests.Application;

public sealed class FieldZoneTests
{
    private static readonly DateTimeOffset Now = new(2026, 11, 18, 7, 0, 0, TimeSpan.Zero);

    [Fact]
    public void Zone_Create_NormalizesCodeAndTracksState()
    {
        var zone = new FieldZone(Guid.NewGuid(), "a", "Khu A", "Sân phía Đông", 1, true, Now);
        Assert.Equal("A", zone.Code);
        Assert.Equal("Khu A", zone.Name);
        Assert.True(zone.IsActive);
        zone.SetActive(false, Now.AddMinutes(1));
        Assert.False(zone.IsActive);
    }

    [Theory]
    [InlineData("A B")]
    [InlineData("/")]
    [InlineData("")]
    public void Zone_InvalidCode_Rejects(string value)
    {
        Assert.Throws<ArgumentException>(() =>
            new FieldZone(Guid.NewGuid(), value, "Khu A", null, 0, true, Now));
    }

    [Fact]
    public void ReassigningFieldZone_DoesNotChangeFieldIdentity()
    {
        var field = new Field(Guid.NewGuid(), "A1", "Sân A1", "a1", "Sân 5 người", 10,
            null, null, null, 60, 30, FieldStatus.Active, Now);
        var originalId = field.Id;
        var zoneId = Guid.NewGuid();
        field.AssignZone(zoneId, Now.AddMinutes(1));
        Assert.Equal(originalId, field.Id);
        Assert.Equal(zoneId, field.ZoneId);
    }
}
