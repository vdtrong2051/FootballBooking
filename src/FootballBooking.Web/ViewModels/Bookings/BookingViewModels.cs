using System.ComponentModel.DataAnnotations;
using System.Globalization;
using FootballBooking.Application.Bookings;
using FootballBooking.Application.Fields;
using FootballBooking.Domain.Bookings;

namespace FootballBooking.Web.ViewModels.Bookings;

public sealed class BookingCreateViewModel
{
    [Required(ErrorMessage = "Vui lòng chọn sân.")]
    public Guid FieldId { get; set; }

    [Required(ErrorMessage = "Vui lòng nhập ngày đặt sân.")]
    public string BookingDateText { get; set; } = DateOnly.FromDateTime(DateTimeOffset.UtcNow.ToOffset(TimeSpan.FromHours(7)).AddDays(1).DateTime).ToString("dd/MM/yyyy", CultureInfo.InvariantCulture);

    [Range(0, 1439, ErrorMessage = "Vui lòng chọn khung giờ trống.")]
    public int StartMinute { get; set; } = -1;

    [Range(60, 120, ErrorMessage = "Thời lượng không hợp lệ.")]
    public int DurationMinutes { get; set; } = 60;

    // Public booking never binds a manually entered end time.
    public int EndMinute => StartMinute + DurationMinutes;

    [Required(ErrorMessage = "Vui lòng nhập họ tên khách.")]
    [Display(Name = "Họ tên")]
    public string CustomerName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vui lòng nhập số điện thoại.")]
    [Display(Name = "Số điện thoại")]
    public string CustomerPhone { get; set; } = string.Empty;

    [EmailAddress(ErrorMessage = "Email chưa hợp lệ.")]
    [Display(Name = "Email")]
    public string? CustomerEmail { get; set; }

    [Display(Name = "Ghi chú")]
    public string? Note { get; set; }

    [Display(Name = "Mã khuyến mãi")]
    public string? PromotionCode { get; set; }

    [Display(Name = "Phương thức thanh toán")]
    public PaymentMethod PreferredPaymentMethod { get; set; } = PaymentMethod.VietQr;

    public List<BookingServiceSelectionViewModel> Services { get; set; } = [];
    public IReadOnlyList<FieldSummaryDto> Fields { get; set; } = [];
    public IReadOnlyList<BookingSlotDto> Slots { get; set; } = [];
    public PricingQuoteDto? Quote { get; set; }
    public BookingPricePreviewDto? QuotePreview { get; set; }

    public long ServiceAmount => Services.Sum(service => service.LineTotal);
    public long EstimatedTotal => Quote is null ? ServiceAmount : Math.Max(0, Quote.CourtAmount + ServiceAmount);

    public DateOnly? ParseBookingDate()
        => DateOnly.TryParseExact(BookingDateText, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out var bookingDate)
            ? bookingDate
            : null;
}

public sealed class BookingServiceSelectionViewModel
{
    public Guid ServiceId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string UnitName { get; set; } = string.Empty;
    public long UnitPrice { get; set; }
    [Range(0, 20, ErrorMessage = "Số lượng dịch vụ phải từ 0 đến 20.")]
    public int Quantity { get; set; }
    public long LineTotal => UnitPrice * Math.Max(0, Quantity);
}

public sealed class BookingQuoteRequestViewModel
{
    public Guid FieldId { get; set; }
    public string BookingDateText { get; set; } = string.Empty;
    public int StartMinute { get; set; }
    public int DurationMinutes { get; set; }
    public string? CustomerPhone { get; set; }
    public string? PromotionCode { get; set; }
    public List<BookingQuoteServiceRequestViewModel> Services { get; set; } = [];
}

public sealed class BookingQuoteServiceRequestViewModel
{
    public Guid ServiceId { get; set; }
    public int Quantity { get; set; }
}

public sealed class BookingSuccessViewModel
{
    public required BookingDetailDto Booking { get; init; }
}

public sealed class BookingLookupViewModel
{
    [Required(ErrorMessage = "Vui lòng nhập mã booking.")]
    public string BookingCode { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vui lòng nhập số điện thoại.")]
    public string CustomerPhone { get; set; } = string.Empty;

    public BookingDetailDto? Result { get; set; }
    public bool HasSearched { get; set; }
    public string? CancellationReason { get; set; }
}

public sealed class AdminBookingListViewModel
{
    public IReadOnlyList<BookingSummaryDto> Bookings { get; set; } = [];
    public IReadOnlyList<FieldSummaryDto> Fields { get; set; } = [];
    public string? BookingDateText { get; set; }
    public Guid? FieldId { get; set; }
    public BookingStatus? Status { get; set; }
}

public sealed class AdminBookingDetailViewModel
{
    public required BookingDetailDto Booking { get; init; }
    public PaymentFormViewModel PaymentForm { get; init; } = new();
    public CancellationFormViewModel CancellationForm { get; init; } = new();
}

public sealed class AdminBookingSettlementViewModel
{
    public required BookingDetailDto Booking { get; init; }
    public PaymentFormViewModel PaymentForm { get; init; } = new();
}

public sealed class PaymentFormViewModel
{
    [Required(ErrorMessage = "Vui lòng nhập số tiền.")]
    [Range(1, long.MaxValue, ErrorMessage = "Số tiền phải lớn hơn 0.")]
    [Display(Name = "Số tiền")]
    public long Amount { get; set; }

    [Required(ErrorMessage = "Vui lòng chọn hình thức thanh toán.")]
    [Display(Name = "Hình thức")]
    public PaymentMethod Method { get; set; } = PaymentMethod.Cash;

    [Display(Name = "Mã giao dịch")]
    public string? TransactionCode { get; set; }

    [Display(Name = "Ghi chú")]
    public string? Note { get; set; }
}

public sealed class CancellationFormViewModel
{
    [Required(ErrorMessage = "Vui lòng nhập lý do hủy.")]
    [StringLength(500, ErrorMessage = "Lý do hủy tối đa 500 ký tự.")]
    [Display(Name = "Lý do hủy")]
    public string? Reason { get; set; }
}

public sealed class ServiceListViewModel
{
    public IReadOnlyList<ServiceItemDto> Services { get; set; } = [];
}

public sealed class ServiceFormViewModel
{
    public Guid? Id { get; set; }

    [StringLength(30, ErrorMessage = "Mã dịch vụ tối đa 30 ký tự.")]
    [Display(Name = "Mã dịch vụ")]
    public string? Code { get; set; }

    [Required(ErrorMessage = "Vui lòng nhập tên dịch vụ.")]
    [StringLength(120, ErrorMessage = "Tên dịch vụ tối đa 120 ký tự.")]
    [Display(Name = "Tên dịch vụ")]
    public string Name { get; set; } = string.Empty;

    [StringLength(1000, ErrorMessage = "Mô tả tối đa 1000 ký tự.")]
    [Display(Name = "Mô tả")]
    public string? Description { get; set; }

    [Required(ErrorMessage = "Vui lòng nhập đơn vị tính.")]
    [StringLength(50, ErrorMessage = "Đơn vị tính tối đa 50 ký tự.")]
    [Display(Name = "Đơn vị tính")]
    public string UnitName { get; set; } = string.Empty;

    [Range(0, long.MaxValue, ErrorMessage = "Đơn giá không được âm.")]
    [Display(Name = "Đơn giá")]
    public long UnitPrice { get; set; }

    [Display(Name = "Theo dõi số lượng khả dụng")]
    public bool IsQuantityTracked { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "Số lượng khả dụng không được âm.")]
    [Display(Name = "Số lượng khả dụng")]
    public int? AvailableQuantity { get; set; }

    [Display(Name = "Đang sử dụng")]
    public bool IsActive { get; set; } = true;

    [Display(Name = "Thứ tự hiển thị")]
    public int SortOrder { get; set; } = 100;

    public static ServiceFormViewModel FromDto(ServiceItemDto service)
        => new()
        {
            Id = service.Id,
            Code = service.Code,
            Name = service.Name,
            Description = service.Description,
            UnitName = service.UnitName,
            UnitPrice = service.UnitPrice,
            IsQuantityTracked = service.IsQuantityTracked,
            AvailableQuantity = service.AvailableQuantity,
            IsActive = service.IsActive,
            SortOrder = service.SortOrder
        };
}

public sealed class PromotionListViewModel
{
    public IReadOnlyList<PromoCodeDto> Promotions { get; set; } = [];
}

public sealed class PromotionFormViewModel
{
    public Guid? Id { get; set; }

    [StringLength(50, ErrorMessage = "Mã khuyến mãi tối đa 50 ký tự.")]
    [Display(Name = "Mã khuyến mãi")]
    public string? Code { get; set; }

    [Required(ErrorMessage = "Vui lòng nhập tên khuyến mãi.")]
    [StringLength(150, ErrorMessage = "Tên khuyến mãi tối đa 150 ký tự.")]
    [Display(Name = "Tên khuyến mãi")]
    public string Name { get; set; } = string.Empty;

    [Display(Name = "Loại giảm")]
    public PromoDiscountType DiscountType { get; set; } = PromoDiscountType.FixedAmount;

    [Range(0.01, 1000000000, ErrorMessage = "Giá trị giảm phải lớn hơn 0.")]
    [Display(Name = "Giá trị giảm")]
    public decimal DiscountValueInput { get; set; }

    [Range(0, long.MaxValue, ErrorMessage = "Mức giảm tối đa không được âm.")]
    [Display(Name = "Mức giảm tối đa")]
    public long? MaximumDiscountAmount { get; set; }

    [Range(0, long.MaxValue, ErrorMessage = "Đơn tối thiểu không được âm.")]
    [Display(Name = "Đơn tối thiểu")]
    public long MinimumOrderAmount { get; set; }

    [Required(ErrorMessage = "Vui lòng nhập thời gian bắt đầu.")]
    [Display(Name = "Bắt đầu")]
    public string StartsAtText { get; set; } = DateTimeOffset.UtcNow.ToString("yyyy-MM-ddTHH:mm", CultureInfo.InvariantCulture);

    [Required(ErrorMessage = "Vui lòng nhập thời gian kết thúc.")]
    [Display(Name = "Kết thúc")]
    public string EndsAtText { get; set; } = DateTimeOffset.UtcNow.AddMonths(1).ToString("yyyy-MM-ddTHH:mm", CultureInfo.InvariantCulture);

    [Range(0, int.MaxValue, ErrorMessage = "Tổng lượt dùng không được âm.")]
    [Display(Name = "Tổng lượt dùng")]
    public int? TotalUsageLimit { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "Lượt dùng mỗi số điện thoại không được âm.")]
    [Display(Name = "Lượt dùng mỗi số điện thoại")]
    public int? PerPhoneUsageLimit { get; set; }

    [Display(Name = "Đang áp dụng")]
    public bool IsActive { get; set; } = true;

    public DateTimeOffset? ParseStartsAt()
        => DateTimeOffset.TryParse(StartsAtText, CultureInfo.InvariantCulture, DateTimeStyles.AssumeLocal, out var value)
            ? value.ToUniversalTime()
            : null;

    public DateTimeOffset? ParseEndsAt()
        => DateTimeOffset.TryParse(EndsAtText, CultureInfo.InvariantCulture, DateTimeStyles.AssumeLocal, out var value)
            ? value.ToUniversalTime()
            : null;

    public long ToDiscountValue()
        => DiscountType == PromoDiscountType.Percentage
            ? (long)Math.Round(DiscountValueInput * 100m, MidpointRounding.AwayFromZero)
            : (long)Math.Round(DiscountValueInput, MidpointRounding.AwayFromZero);

    public static PromotionFormViewModel FromDto(PromoCodeDto promotion)
        => new()
        {
            Id = promotion.Id,
            Code = promotion.Code,
            Name = promotion.Name,
            DiscountType = promotion.DiscountType,
            DiscountValueInput = promotion.DiscountType == PromoDiscountType.Percentage ? promotion.DiscountValue / 100m : promotion.DiscountValue,
            MaximumDiscountAmount = promotion.MaximumDiscountAmount,
            MinimumOrderAmount = promotion.MinimumOrderAmount,
            StartsAtText = promotion.StartsAtUtc.ToLocalTime().ToString("yyyy-MM-ddTHH:mm", CultureInfo.InvariantCulture),
            EndsAtText = promotion.EndsAtUtc.ToLocalTime().ToString("yyyy-MM-ddTHH:mm", CultureInfo.InvariantCulture),
            TotalUsageLimit = promotion.TotalUsageLimit,
            PerPhoneUsageLimit = promotion.PerPhoneUsageLimit,
            IsActive = promotion.IsActive
        };
}

public sealed class PaymentListViewModel
{
    public IReadOnlyList<BookingSummaryDto> Bookings { get; set; } = [];
}

public sealed class AdminScheduleViewModel
{
    public IReadOnlyList<FieldSummaryDto> Fields { get; set; } = [];
    public IReadOnlyList<AdminScheduleWorkItemViewModel> WorkItems { get; set; } = [];
    public Guid? FieldId { get; set; }
    public string InitialDateText { get; set; } = DateOnly.FromDateTime(DateTime.UtcNow).ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
    public BookingStatus? Status { get; set; }
}

public sealed class AdminScheduleWorkItemViewModel
{
    public required string Title { get; init; }
    public required string Description { get; init; }
    public required string Tone { get; init; }
    public required string Url { get; init; }
}
