using FootballBooking.Application.Bookings;
using FootballBooking.Application.Fields;
using FootballBooking.Application.Reports;
using Microsoft.Extensions.DependencyInjection;

namespace FootballBooking.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(
        this IServiceCollection services,
        BookingPolicyOptions bookingPolicy)
    {
        services.AddSingleton(bookingPolicy);
        services.AddScoped<IFieldService, FieldService>();
        services.AddScoped<IReportService, ReportService>();
        services.AddScoped<IBookingService, BookingService>();

        return services;
    }
}
