using FootballBooking.Infrastructure;
using FootballBooking.Infrastructure.Data;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace FootballBooking.Tests.Integration;

public sealed class ProviderSelectionTests
{
    [Fact]
    public void AddInfrastructure_WhenSqliteConnectionGiven_FailsClosed()
    {
        var settings = new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string?>
        {
            ["ConnectionStrings:DefaultConnection"] = "Data Source=football-booking.db"
        }).Build();
        var services = new ServiceCollection();
        services.AddLogging();
        Assert.Throws<InvalidOperationException>(() => services.AddInfrastructure(settings));
    }
}
