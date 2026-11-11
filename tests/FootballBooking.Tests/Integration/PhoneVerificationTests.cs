using FootballBooking.Application.Common.Time;
using FootballBooking.Domain.Users;
using FootballBooking.Infrastructure.Data;
using FootballBooking.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace FootballBooking.Tests.Integration;

public sealed class PhoneVerificationTests
{
    [Theory]
    [InlineData("0901 234 567", "0901234567")]
    [InlineData("+84 901 234 567", "0901234567")]
    [InlineData("123456", null)]
    public void NormalizePhone_ParsesVietnameseNumbers(string input, string? expected)
        => Assert.Equal(expected, VietnamPhone.Normalize(input));

    [Fact]
    public async Task AccountVerification_WhenCodeCorrect_ActivatesOtherwiseInactiveUser()
    {
        await using var db = await MySqlTestDatabase.CreateCleanContextAsync();
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddSingleton(new FixedClock());
        services.AddSingleton<ISystemClock>(sp => sp.GetRequiredService<FixedClock>());
        services.AddSingleton<IPhoneSmsSender, CapturingSms>();
        services.AddDbContext<ApplicationDbContext>(o => o.UseMySQL(MySqlTestDatabase.ConnectionString));
        services.AddIdentity<ApplicationUser, IdentityRole<Guid>>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();
        services.AddScoped<PhoneOtpService>();
        await using var provider = services.BuildServiceProvider();
        await using var scope = provider.CreateAsyncScope();
        var users = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var service = scope.ServiceProvider.GetRequiredService<PhoneOtpService>();
        var capture = scope.ServiceProvider.GetRequiredService<IPhoneSmsSender>() as CapturingSms;
        var now = DateTimeOffset.UtcNow;
        var user = new ApplicationUser
        {
            Id = Guid.NewGuid(), UserName = "otp@example.local", Email = "otp@example.local",
            FullName = "Test OTP", PhoneNumber = "0901234567", AccountStatus = AccountStatus.Inactive,
            EmailConfirmed = false, PhoneNumberConfirmed = false, CreatedAtUtc = now, UpdatedAtUtc = now
        };
        Assert.True((await users.CreateAsync(user, "Password1!")).Succeeded);
        Assert.True((await service.SendAsync(user)).Success);
        Assert.NotNull(capture);
        Assert.NotNull(capture!.LastMessage);
        // The actual OTP is the six-digit code embedded in the captured SMS body.
        var match = System.Text.RegularExpressions.Regex.Match(capture.LastMessage!, @"\b\d{6}\b");
        Assert.True(match.Success);
        Assert.False((await service.VerifyAsync(user, "000000" == match.Value ? "111111" : "000000")).Success);
        Assert.False(user.PhoneNumberConfirmed);
        Assert.True((await service.VerifyAsync(user, match.Value)).Success);
        Assert.True(user.PhoneNumberConfirmed);
        Assert.Equal(AccountStatus.Active, user.AccountStatus);
    }

    private sealed class FixedClock : ISystemClock
    {
        public DateTimeOffset UtcNow => DateTimeOffset.UtcNow;
    }

    private sealed class CapturingSms : IPhoneSmsSender
    {
        public bool IsConfigured => true;
        public string? LastMessage { get; private set; }
        public Task SendAsync(string phone, string message, CancellationToken cancellationToken = default)
        {
            LastMessage = message;
            return Task.CompletedTask;
        }
    }
}
