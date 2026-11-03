using FootballBooking.Domain.Users;
using Microsoft.AspNetCore.Identity;

namespace FootballBooking.Infrastructure.Identity;

public sealed class ApplicationUser : IdentityUser<Guid>
{
    public string FullName { get; set; } = string.Empty;

    public AccountStatus AccountStatus { get; set; } = AccountStatus.Active;

    public long BaseSalary { get; set; }

    public long HourlyRate { get; set; }

    public int StandardHoursPerMonth { get; set; } = 160;

    public decimal CommissionPercent { get; set; }

    public DateTimeOffset? LastLoginAtUtc { get; set; }

    public DateTimeOffset CreatedAtUtc { get; set; }

    public DateTimeOffset UpdatedAtUtc { get; set; }
}
