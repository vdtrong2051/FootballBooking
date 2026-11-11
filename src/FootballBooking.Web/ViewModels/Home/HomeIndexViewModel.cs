using FootballBooking.Application.Bookings;
using FootballBooking.Application.Fields;

namespace FootballBooking.Web.ViewModels.Home;

public sealed record HomeIndexViewModel(
    IReadOnlyList<FieldSummaryDto> Fields,
    IReadOnlyList<ServiceItemDto> Services,
    IReadOnlyList<PromoCodeDto> Promotions,
    string DefaultBookingDateText);
