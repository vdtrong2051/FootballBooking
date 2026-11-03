using FootballBooking.Infrastructure.Identity;
using FootballBooking.Domain.Bookings;
using FootballBooking.Domain.Fields;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FootballBooking.Infrastructure.Data;

public sealed class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>(options)
{
    public DbSet<Field> Fields => Set<Field>();
    public DbSet<FieldImage> FieldImages => Set<FieldImage>();
    public DbSet<FieldOperatingHour> FieldOperatingHours => Set<FieldOperatingHour>();
    public DbSet<FieldBlock> FieldBlocks => Set<FieldBlock>();
    public DbSet<PricingRule> PricingRules => Set<PricingRule>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<ServiceItem> Services => Set<ServiceItem>();
    public DbSet<BookingServiceLine> BookingServices => Set<BookingServiceLine>();
    public DbSet<PaymentRecord> Payments => Set<PaymentRecord>();
    public DbSet<PromoCode> PromoCodes => Set<PromoCode>();
    public DbSet<PromoCodeUsage> PromoCodeUsages => Set<PromoCodeUsage>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

        builder.Entity<ApplicationUser>(entity =>
        {
            entity.Property(user => user.FullName)
                .HasMaxLength(120)
                .IsRequired();

            entity.Property(user => user.AccountStatus)
                .HasConversion<int>()
                .IsRequired();

            entity.Property(user => user.CommissionPercent)
                .HasPrecision(5, 2);
        });
    }
}
