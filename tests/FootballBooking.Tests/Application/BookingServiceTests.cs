using FootballBooking.Application.Bookings;
using FootballBooking.Application.Common.Time;
using FootballBooking.Domain.Bookings;
using FootballBooking.Domain.Fields;

namespace FootballBooking.Tests.Application;

public sealed class BookingServiceTests
{
    [Fact]
    public async Task CreateBookingAsync_WhenGuestBookingIsValid_CreatesPendingHoldWithVietnameseSafeCode()
    {
        var store = new InMemoryBookingStore(CreateField());
        var service = new BookingService(store, new ImmediateBookingWriteLock(), new FixedClock());

        var result = await service.CreateBookingAsync(ValidGuestCommand());

        Assert.True(result.Succeeded);
        Assert.StartsWith("FB-260726-", result.BookingCode);
        var booking = Assert.Single(store.Bookings);
        Assert.Equal(BookingStatus.PendingPayment, booking.Status);
        Assert.Equal(PaymentStatus.Unpaid, booking.PaymentStatus);
        Assert.Equal(300000, booking.TotalAmount);
        Assert.Null(booking.CustomerUserId);
    }

    [Fact]
    public async Task CreateBookingAsync_WhenSourceIsCustomerAccount_CreatesPendingPaymentWithCustomerUserId()
    {
        var store = new InMemoryBookingStore(CreateField());
        var service = new BookingService(store, new ImmediateBookingWriteLock(), new FixedClock());
        var customerId = Guid.NewGuid();

        var result = await service.CreateBookingAsync(ValidGuestCommand() with
        {
            Source = BookingSource.CustomerAccount,
            CustomerUserId = customerId,
            PreferredPaymentMethod = PaymentMethod.MoMo
        });

        Assert.True(result.Succeeded);
        var booking = Assert.Single(store.Bookings);
        Assert.Equal(BookingStatus.PendingPayment, booking.Status);
        Assert.NotNull(booking.ExpiresAtUtc);
        Assert.Equal(customerId, booking.CustomerUserId);
        Assert.Contains("Ví MoMo", booking.Note);
        var detail = await service.GetBookingByCodeAsync(result.BookingCode!);
        Assert.NotNull(detail);
        Assert.Equal(PaymentMethod.MoMo, detail!.PreferredPaymentMethod);
    }

    [Fact]
    public void PaymentMethodLabels_WhenNewMethodsProvided_ReturnsVietnameseLabels()
    {
        Assert.Equal("Quét mã VietQR", BookingLabels.PaymentMethod(PaymentMethod.VietQr));
        Assert.Equal("Ví MoMo", BookingLabels.PaymentMethod(PaymentMethod.MoMo));
        Assert.Equal("Ví ZaloPay", BookingLabels.PaymentMethod(PaymentMethod.ZaloPay));
        Assert.Equal("Thẻ ngân hàng", BookingLabels.PaymentMethod(PaymentMethod.Card));
    }

    [Fact]
    public async Task ListScheduleEventsAsync_WhenFilteredByStatus_ReturnsMatchingBookingEventsOnly()
    {
        var field = CreateField();
        var store = new InMemoryBookingStore(field);
        store.Bookings.Add(CreateExistingBooking(field.Id, 1080, 1140, BookingStatus.Confirmed));
        store.Bookings.Add(CreateExistingBooking(field.Id, 1140, 1200, BookingStatus.PendingPayment));
        store.Bookings.Add(CreateExistingBooking(field.Id, 1200, 1260, BookingStatus.Cancelled));
        var service = new BookingService(store, new ImmediateBookingWriteLock(), new FixedClock());

        var events = await service.ListScheduleEventsAsync(new DateOnly(2026, 7, 26), new DateOnly(2026, 7, 27), null, BookingStatus.PendingPayment);
        var cancelledEvents = await service.ListScheduleEventsAsync(new DateOnly(2026, 7, 26), new DateOnly(2026, 7, 27), null, BookingStatus.Cancelled);

        var scheduleEvent = Assert.Single(events);
        Assert.Equal(BookingStatus.PendingPayment, scheduleEvent.Status);
        var cancelledEvent = Assert.Single(cancelledEvents);
        Assert.Equal(BookingStatus.Cancelled, cancelledEvent.Status);
    }

    [Fact]
    public async Task ListCustomerBookingsAsync_WhenOnlyPhoneMatches_DoesNotReturnOtherUsersBookings()
    {
        var field = CreateField();
        var store = new InMemoryBookingStore(field);
        var customerId = Guid.NewGuid();
        store.Bookings.Add(CreateExistingBooking(field.Id, 1080, 1140, BookingStatus.Confirmed));
        var service = new BookingService(store, new ImmediateBookingWriteLock(), new FixedClock());

        var bookings = await service.ListCustomerBookingsAsync(customerId, "0902 345 678");

        Assert.Empty(bookings);
    }

    [Fact]
    public async Task CreateBookingAsync_WhenAdjacentToConfirmedBooking_AllowsBooking()
    {
        var field = CreateField();
        var store = new InMemoryBookingStore(field);
        store.Bookings.Add(CreateExistingBooking(field.Id, 1080, 1140, BookingStatus.Confirmed));
        var service = new BookingService(store, new ImmediateBookingWriteLock(), new FixedClock());

        var result = await service.CreateBookingAsync(ValidGuestCommand() with { StartMinute = 1140, EndMinute = 1200 });

        Assert.True(result.Succeeded);
    }

    [Fact]
    public async Task CreateBookingAsync_WhenOverlapsConfirmedBooking_ReturnsConflict()
    {
        var field = CreateField();
        var store = new InMemoryBookingStore(field);
        store.Bookings.Add(CreateExistingBooking(field.Id, 1080, 1140, BookingStatus.Confirmed));
        var service = new BookingService(store, new ImmediateBookingWriteLock(), new FixedClock());

        var result = await service.CreateBookingAsync(ValidGuestCommand() with { StartMinute = 1110, EndMinute = 1170 });

        Assert.False(result.Succeeded);
        Assert.Contains("Khung giờ này đã có booking khác.", result.Errors);
    }

    [Fact]
    public async Task CreateBookingAsync_WhenFieldBlockOverlaps_ReturnsBlockMessage()
    {
        var field = CreateField();
        field.AddBlock(new FieldBlock(Guid.NewGuid(), field.Id, new DateOnly(2026, 7, 26), 1080, 1140, FieldBlockType.Maintenance, "Bảo trì mặt sân", Guid.NewGuid(), new FixedClock().UtcNow));
        var store = new InMemoryBookingStore(field);
        var service = new BookingService(store, new ImmediateBookingWriteLock(), new FixedClock());

        var result = await service.CreateBookingAsync(ValidGuestCommand());

        Assert.False(result.Succeeded);
        Assert.Contains("Khung giờ này đang được khóa để bảo trì hoặc sự kiện nội bộ.", result.Errors);
    }

    [Fact]
    public async Task GetPricingQuoteAsync_WhenBookingCrossesTwoIntervals_ReturnsSegmentedAmount()
    {
        var store = new InMemoryBookingStore(CreateField());
        var service = new BookingService(store, new ImmediateBookingWriteLock(), new FixedClock());

        var quote = await service.GetPricingQuoteAsync(store.Field.Id, new DateOnly(2026, 7, 27), 1050, 1110);

        Assert.NotNull(quote);
        Assert.Equal(225000, quote.CourtAmount);
        Assert.Equal(2, quote.Segments.Count);
    }

    [Fact]
    public async Task LookupBookingAsync_WhenPhoneDoesNotMatch_ReturnsNull()
    {
        var field = CreateField();
        var store = new InMemoryBookingStore(field);
        store.Bookings.Add(CreateExistingBooking(field.Id, 1080, 1140, BookingStatus.Confirmed));
        var service = new BookingService(store, new ImmediateBookingWriteLock(), new FixedClock());

        var result = await service.LookupBookingAsync(new BookingLookupQuery("FB-260726-TEST", "0999 999 999"));

        Assert.Null(result);
    }

    [Fact]
    public async Task CreateBookingAsync_WhenServicesAndPromotionAreValid_SnapshotsAmounts()
    {
        var field = CreateField();
        var store = new InMemoryBookingStore(field);
        var serviceItem = new ServiceItem(Guid.NewGuid(), "BALL", "Thuê bóng", "Bóng thi đấu size 5.", "quả", 30000, true, 10, true, 10, new FixedClock().UtcNow);
        store.Services.Add(serviceItem);
        store.Promotions.Add(new PromoCode(Guid.NewGuid(), "ANPHU50", "Giảm 50.000 ₫", PromoDiscountType.FixedAmount, 50000, null, 300000, new FixedClock().UtcNow.AddDays(-1), new FixedClock().UtcNow.AddDays(30), 10, 1, null, null, null, true, new FixedClock().UtcNow));
        var service = new BookingService(store, new ImmediateBookingWriteLock(), new FixedClock());

        var result = await service.CreateBookingAsync(ValidGuestCommand() with
        {
            FieldId = field.Id,
            Services = [new BookingServiceSelectionCommand(serviceItem.Id, 2)],
            PromotionCode = "ANPHU50"
        });

        Assert.True(result.Succeeded);
        var booking = Assert.Single(store.Bookings);
        Assert.Equal(60000, booking.ServiceAmount);
        Assert.Equal(50000, booking.DiscountAmount);
        Assert.Equal(310000, booking.TotalAmount);
        Assert.Equal("ANPHU50", booking.PromoCodeSnapshot);
        Assert.Single(booking.ServiceLines);
        Assert.Single(store.PromotionUsages);
    }

    [Fact]
    public async Task RecordPaymentAsync_WhenDepositRecorded_ConfirmsPendingBookingAndMarksPartiallyPaid()
    {
        var field = CreateField();
        var store = new InMemoryBookingStore(field);
        var booking = CreateExistingBooking(field.Id, 1080, 1140, BookingStatus.PendingPayment);
        store.Bookings.Add(booking);
        var service = new BookingService(store, new ImmediateBookingWriteLock(), new FixedClock());

        var result = await service.RecordPaymentAsync(new BookingPaymentCommand(booking.Id, PaymentRecordType.Payment, PaymentMethod.BankTransfer, 100000, "CK001", "Khách đặt cọc", null));

        Assert.True(result.Succeeded);
        Assert.Equal(BookingStatus.Confirmed, booking.Status);
        Assert.Equal(PaymentStatus.PartiallyPaid, booking.PaymentStatus);
        Assert.Equal(100000, booking.PaidAmount);
        Assert.Single(booking.Payments);
    }

    [Fact]
    public async Task CancelPublicBookingAsync_WhenWithinPolicy_ReturnsVietnamesePolicyMessage()
    {
        var field = CreateField();
        var store = new InMemoryBookingStore(field);
        var booking = CreateExistingBooking(field.Id, 1080, 1140, BookingStatus.Confirmed);
        store.Bookings.Add(booking);
        var service = new BookingService(store, new ImmediateBookingWriteLock(), new FixedClock());

        var result = await service.CancelPublicBookingAsync(new PublicBookingCancellationCommand(booking.BookingCode, booking.CustomerPhone, "Đội đổi lịch"));

        Assert.True(result.Succeeded);
        Assert.Equal(BookingStatus.Cancelled, booking.Status);
        Assert.Equal("Đội đổi lịch", booking.CancellationReason);
    }

    [Fact]
    public async Task ChangeStatusAsync_WhenOperationalFlowIsValid_ProgressesToCompleted()
    {
        var field = CreateField();
        var store = new InMemoryBookingStore(field);
        var booking = CreateExistingBooking(field.Id, 1080, 1140, BookingStatus.Confirmed);
        store.Bookings.Add(booking);
        var service = new BookingService(store, new ImmediateBookingWriteLock(), new FixedClock());

        Assert.True((await service.ChangeStatusAsync(booking.Id, BookingStatus.CheckedIn)).Succeeded);
        Assert.True((await service.ChangeStatusAsync(booking.Id, BookingStatus.InProgress)).Succeeded);
        Assert.True((await service.ChangeStatusAsync(booking.Id, BookingStatus.Completed)).Succeeded);

        Assert.Equal(BookingStatus.Completed, booking.Status);
    }

    [Fact]
    public async Task ChangeStatusAsync_WhenCompletedBackToInProgress_ReturnsVietnameseError()
    {
        var field = CreateField();
        var store = new InMemoryBookingStore(field);
        var booking = CreateExistingBooking(field.Id, 1080, 1140, BookingStatus.Completed);
        store.Bookings.Add(booking);
        var service = new BookingService(store, new ImmediateBookingWriteLock(), new FixedClock());

        var result = await service.ChangeStatusAsync(booking.Id, BookingStatus.InProgress);

        Assert.False(result.Succeeded);
        Assert.Contains("Không thể chuyển booking sang trạng thái đã chọn.", result.Errors);
        Assert.Equal(BookingStatus.Completed, booking.Status);
    }

    [Fact]
    public async Task ChangeStatusAsync_WhenNoShowBeforeGrace_ReturnsPolicyMessage()
    {
        var field = CreateField();
        var store = new InMemoryBookingStore(field);
        var booking = CreateExistingBooking(field.Id, 1080, 1140, BookingStatus.Confirmed);
        store.Bookings.Add(booking);
        var service = new BookingService(store, new ImmediateBookingWriteLock(), new FixedClock());

        var result = await service.ChangeStatusAsync(booking.Id, BookingStatus.NoShow);

        Assert.False(result.Succeeded);
        Assert.Contains("Chỉ có thể ghi nhận khách không đến sau giờ bắt đầu và thời gian chờ theo chính sách.", result.Errors);
    }

    [Fact]
    public async Task ChangeStatusAsync_WhenNoShowAfterGrace_MarksNoShow()
    {
        var field = CreateField();
        var store = new InMemoryBookingStore(field);
        var booking = CreateExistingBooking(field.Id, 1080, 1140, BookingStatus.Confirmed, new DateOnly(2026, 7, 24));
        store.Bookings.Add(booking);
        var service = new BookingService(store, new ImmediateBookingWriteLock(), new FixedClock());

        var result = await service.ChangeStatusAsync(booking.Id, BookingStatus.NoShow);

        Assert.True(result.Succeeded);
        Assert.Equal(BookingStatus.NoShow, booking.Status);
    }

    [Fact]
    public async Task ListScheduleEventsAsync_WhenBookingExists_ReturnsVietnameseScheduleEvent()
    {
        var field = CreateField();
        var store = new InMemoryBookingStore(field);
        store.Bookings.Add(CreateExistingBooking(field.Id, 1080, 1140, BookingStatus.Confirmed));
        var service = new BookingService(store, new ImmediateBookingWriteLock(), new FixedClock());

        var events = await service.ListScheduleEventsAsync(new DateOnly(2026, 7, 26), new DateOnly(2026, 7, 27), null);

        var scheduleEvent = Assert.Single(events);
        Assert.Contains("Trần Quốc Huy", scheduleEvent.Title);
        Assert.Equal("Đã xác nhận · Chưa thanh toán", scheduleEvent.Description);
        Assert.False(scheduleEvent.IsBackground);
    }

    [Fact]
    public async Task SaveServiceAsync_WhenCodeIsBlank_GeneratesVietnameseServiceCode()
    {
        var store = new InMemoryBookingStore(CreateField());
        var service = new BookingService(store, new ImmediateBookingWriteLock(), new FixedClock());

        var result = await service.SaveServiceAsync(new ServiceItemUpsertCommand(null, null, "Nước suối", "Chai 500ml.", "chai", 10000, true, 200, true, 20));

        Assert.True(result.Succeeded);
        Assert.StartsWith("DV-", result.BookingCode);
        Assert.Single(store.Services);
    }

    [Fact]
    public async Task SavePromotionAsync_WhenPercentageIsTooHigh_ReturnsVietnameseError()
    {
        var store = new InMemoryBookingStore(CreateField());
        var service = new BookingService(store, new ImmediateBookingWriteLock(), new FixedClock());

        var result = await service.SavePromotionAsync(new PromoCodeUpsertCommand(null, "KMTEST", "Giảm quá mức", PromoDiscountType.Percentage, 12000, null, 0, new FixedClock().UtcNow, new FixedClock().UtcNow.AddDays(7), 10, 1, true));

        Assert.False(result.Succeeded);
        Assert.Contains("Phần trăm giảm không được vượt quá 100%.", result.Errors);
    }

    [Fact]
    public async Task RecordPaymentAsync_WhenHoldExpired_RejectsAndExpiresBooking()
    {
        var field = CreateField();
        var store = new InMemoryBookingStore(field);
        var booking = new Booking(Guid.NewGuid(), "FB-260726-EXPIRED", field.Id,
            new DateOnly(2026, 7, 26), 1080, 1140, "Test", "0901234567", "0901234567",
            null, null, null, BookingSource.GuestWeb, BookingStatus.PendingPayment,
            PaymentStatus.Unpaid, 250000, 0, 0, 250000,
            new FixedClock().UtcNow.AddMinutes(-1), new FixedClock().UtcNow.AddMinutes(-20), null);
        store.Bookings.Add(booking);
        var service = new BookingService(store, new ImmediateBookingWriteLock(), new FixedClock());
        var result = await service.RecordPaymentAsync(new BookingPaymentCommand(booking.Id,
            PaymentRecordType.Payment, PaymentMethod.BankTransfer, 100000, "LATE", null, null));
        Assert.False(result.Succeeded);
        Assert.Equal(BookingStatus.Expired, booking.Status);
        Assert.Empty(booking.Payments);
    }

    [Fact]
    public async Task RecordPaymentAsync_WhenTransactionReferenceRepeated_RejectsDuplicate()
    {
        var field = CreateField();
        var store = new InMemoryBookingStore(field);
        var booking = CreateExistingBooking(field.Id, 1080, 1140, BookingStatus.Confirmed);
        store.Bookings.Add(booking);
        var service = new BookingService(store, new ImmediateBookingWriteLock(), new FixedClock());
        var command = new BookingPaymentCommand(booking.Id, PaymentRecordType.Payment,
            PaymentMethod.BankTransfer, 100000, "UNIQUE-REF", null, null);
        Assert.True((await service.RecordPaymentAsync(command)).Succeeded);
        Assert.False((await service.RecordPaymentAsync(command)).Succeeded);
        Assert.Single(booking.Payments);
    }

    private static BookingCreateCommand ValidGuestCommand()
        => new(
            FieldId: Guid.Empty,
            BookingDate: new DateOnly(2026, 7, 26),
            StartMinute: 1080,
            EndMinute: 1140,
            CustomerName: "Nguyễn Minh Tuấn",
            CustomerPhone: "0901 234 567",
            CustomerEmail: "tuan@example.local",
            Note: "Đội đến sớm 10 phút",
            Source: BookingSource.GuestWeb,
            CreatedByUserId: null);

    private static Field CreateField()
    {
        var now = new FixedClock().UtcNow;
        var fieldId = Guid.NewGuid();
        var field = new Field(fieldId, "F5A", "Sân 5A", "san-5a", "Sân 5 người", 10, "Sân cỏ nhân tạo.", "12 đường D5", null, 60, 30, FieldStatus.Active, now);
        field.ReplaceOperatingHours(Enumerable.Range(0, 7).Select(day => new FieldOperatingHour(Guid.NewGuid(), fieldId, day, false, 360, 1380)));
        field.ReplaceImages([new FieldImage(Guid.NewGuid(), fieldId, "/images/fields/san-5a.svg", "Ảnh Sân 5A", 1, true, now)]);
        field.ReplacePricingRules([
            new PricingRule(Guid.NewGuid(), fieldId, "Giá ban ngày", PricingRuleType.Weekday, null, null, new DateOnly(2026, 1, 1), null, 360, 1080, 200000, 10, true, now),
            new PricingRule(Guid.NewGuid(), fieldId, "Giá buổi tối", PricingRuleType.Weekday, null, null, new DateOnly(2026, 1, 1), null, 1080, 1380, 250000, 20, true, now),
            new PricingRule(Guid.NewGuid(), fieldId, "Giá cuối tuần", PricingRuleType.Weekend, null, null, new DateOnly(2026, 1, 1), null, 360, 1380, 300000, 30, true, now)
        ]);
        return field;
    }

    private static Booking CreateExistingBooking(Guid fieldId, int startMinute, int endMinute, BookingStatus status, DateOnly? bookingDate = null)
        => new(
            Guid.NewGuid(),
            "FB-260726-TEST",
            fieldId,
            bookingDate ?? new DateOnly(2026, 7, 26),
            startMinute,
            endMinute,
            "Trần Quốc Huy",
            "0902 345 678",
            "0902345678",
            null,
            null,
            null,
            BookingSource.Staff,
            status,
            PaymentStatus.Unpaid,
            250000,
            0,
            0,
            250000,
            status == BookingStatus.PendingPayment ? new FixedClock().UtcNow.AddMinutes(10) : null,
            new FixedClock().UtcNow,
            null);

    private sealed class FixedClock : ISystemClock
    {
        public DateTimeOffset UtcNow => new(2026, 7, 25, 0, 0, 0, TimeSpan.Zero);
    }

    private sealed class ImmediateBookingWriteLock : IBookingWriteLock
    {
        public Task<IAsyncDisposable?> TryAcquireAsync(Guid fieldId, DateOnly bookingDate, TimeSpan timeout, CancellationToken cancellationToken)
            => Task.FromResult<IAsyncDisposable?>(new Releaser());

        private sealed class Releaser : IAsyncDisposable
        {
            public ValueTask DisposeAsync() => ValueTask.CompletedTask;
        }
    }

    private sealed class InMemoryBookingStore(Field field) : IBookingStore
    {
        public Field Field { get; } = field;
        public List<Booking> Bookings { get; } = [];
        public List<ServiceItem> Services { get; } = [];
        public List<PromoCode> Promotions { get; } = [];
        public List<PromoCodeUsage> PromotionUsages { get; } = [];

        public Task<Field?> GetFieldForBookingAsync(Guid fieldId, CancellationToken cancellationToken)
            => Task.FromResult<Field?>(Field);

        public Task<Field?> GetFieldForBookingBySlugAsync(string slug, CancellationToken cancellationToken)
            => Task.FromResult<Field?>(Field.Slug == slug ? Field : null);

        public Task<IReadOnlyList<ServiceItem>> ListActiveServicesAsync(CancellationToken cancellationToken)
            => Task.FromResult<IReadOnlyList<ServiceItem>>(Services.Where(service => service.IsActive).ToArray());

        public Task<IReadOnlyList<ServiceItem>> ListServicesAsync(CancellationToken cancellationToken)
            => Task.FromResult<IReadOnlyList<ServiceItem>>(Services.ToArray());

        public Task<ServiceItem?> GetServiceAsync(Guid id, CancellationToken cancellationToken)
            => Task.FromResult(Services.FirstOrDefault(service => service.Id == id));

        public Task<ServiceItem?> GetServiceByCodeAsync(string code, CancellationToken cancellationToken)
            => Task.FromResult(Services.FirstOrDefault(service => service.Code == code.Trim().ToUpperInvariant()));

        public Task<IReadOnlyList<PromoCode>> ListPromotionsAsync(CancellationToken cancellationToken)
            => Task.FromResult<IReadOnlyList<PromoCode>>(Promotions.ToArray());

        public Task<PromoCode?> GetPromotionAsync(Guid id, CancellationToken cancellationToken)
            => Task.FromResult(Promotions.FirstOrDefault(promotion => promotion.Id == id));

        public Task<PromoCode?> GetPromotionByCodeAsync(string code, CancellationToken cancellationToken)
            => Task.FromResult(Promotions.FirstOrDefault(promotion => promotion.Code == code.Trim().ToUpperInvariant()));

        public Task<int> CountPromotionUsagesAsync(Guid promoCodeId, string? phoneNormalized, CancellationToken cancellationToken)
            => Task.FromResult(PromotionUsages.Count(usage => usage.PromoCodeId == promoCodeId && (phoneNormalized is null || usage.CustomerPhoneNormalized == phoneNormalized)));

        public Task<IReadOnlyList<Booking>> ListBookingsForFieldDateAsync(Guid fieldId, DateOnly bookingDate, CancellationToken cancellationToken)
            => Task.FromResult<IReadOnlyList<Booking>>(Bookings.Where(booking => booking.BookingDate == bookingDate).ToArray());

        public Task<IReadOnlyList<BookingSummaryDto>> ListBookingsAsync(DateOnly? bookingDate, Guid? fieldId, BookingStatus? status, CancellationToken cancellationToken)
            => Task.FromResult<IReadOnlyList<BookingSummaryDto>>([]);

        public Task<IReadOnlyList<BookingSummaryDto>> ListCustomerBookingsAsync(Guid customerUserId, string? customerPhoneNormalized, CancellationToken cancellationToken)
            => Task.FromResult<IReadOnlyList<BookingSummaryDto>>(Bookings
                .Where(booking => booking.CustomerUserId == customerUserId)
                .Select(ToSummary)
                .ToArray());

        public Task<IReadOnlyList<BookingSummaryDto>> ListScheduleBookingsAsync(DateOnly startDate, DateOnly endDateExclusive, Guid? fieldId, CancellationToken cancellationToken)
            => Task.FromResult<IReadOnlyList<BookingSummaryDto>>(Bookings
                .Where(booking => booking.BookingDate >= startDate && booking.BookingDate < endDateExclusive)
                .Where(booking => fieldId is null || booking.FieldId == fieldId.Value)
                .Select(ToSummary)
                .ToArray());

        public Task<IReadOnlyList<ScheduleBlockDto>> ListScheduleBlocksAsync(DateOnly startDate, DateOnly endDateExclusive, Guid? fieldId, CancellationToken cancellationToken)
            => Task.FromResult<IReadOnlyList<ScheduleBlockDto>>([]);

        public Task<BookingDetailDto?> GetBookingDetailByCodeAsync(string bookingCode, CancellationToken cancellationToken)
        {
            var booking = Bookings.FirstOrDefault(item => item.BookingCode == bookingCode);
            return Task.FromResult(booking is null ? null : ToDetail(booking));
        }

        public Task<BookingDetailDto?> GetBookingDetailByIdAsync(Guid id, CancellationToken cancellationToken)
            => Task.FromResult<BookingDetailDto?>(null);

        public Task<Booking?> GetBookingForUpdateAsync(Guid id, CancellationToken cancellationToken)
            => Task.FromResult(Bookings.FirstOrDefault(booking => booking.Id == id));

        public Task<Booking?> GetBookingForPaymentAsync(Guid id, CancellationToken cancellationToken)
            => Task.FromResult(Bookings.FirstOrDefault(booking => booking.Id == id));

        public Task AddServiceAsync(ServiceItem service, CancellationToken cancellationToken)
        {
            Services.Add(service);
            return Task.CompletedTask;
        }

        public Task AddPromotionAsync(PromoCode promotion, CancellationToken cancellationToken)
        {
            Promotions.Add(promotion);
            return Task.CompletedTask;
        }

        public Task AddBookingAsync(Booking booking, CancellationToken cancellationToken)
        {
            var fixedBooking = booking.FieldId == Guid.Empty
                ? new Booking(booking.Id, booking.BookingCode, Field.Id, booking.BookingDate, booking.StartMinute, booking.EndMinute, booking.CustomerName, booking.CustomerPhone, booking.CustomerPhoneNormalized, booking.CustomerEmail, booking.CustomerUserId, booking.CreatedByUserId, booking.Source, booking.Status, booking.PaymentStatus, booking.CourtAmount, booking.ServiceAmount, booking.DiscountAmount, booking.TotalAmount, booking.ExpiresAtUtc, booking.CreatedAtUtc, booking.Note)
                : booking;
            Bookings.Add(fixedBooking);
            return Task.CompletedTask;
        }

        public Task AddPaymentAsync(PaymentRecord payment, CancellationToken cancellationToken)
            => Task.CompletedTask;

        public Task AddPromotionUsageAsync(PromoCodeUsage usage, CancellationToken cancellationToken)
        {
            PromotionUsages.Add(usage);
            return Task.CompletedTask;
        }

        public Task<bool> BookingCodeExistsAsync(string bookingCode, CancellationToken cancellationToken)
            => Task.FromResult(Bookings.Any(booking => booking.BookingCode == bookingCode));

        public Task SaveChangesAsync(CancellationToken cancellationToken) => Task.CompletedTask;

        private BookingDetailDto ToDetail(Booking booking)
            => new(
                booking.Id,
                booking.BookingCode,
                Field.Id,
                Field.Name,
                Field.Slug,
                booking.BookingDate,
                booking.StartMinute,
                booking.EndMinute,
                booking.CustomerName,
                booking.CustomerPhone,
                booking.CustomerEmail,
                booking.Source,
                booking.Status,
                booking.PaymentStatus,
                booking.CourtAmount,
                booking.ServiceAmount,
                booking.DiscountAmount,
                booking.CancellationFeeAmount,
                booking.RefundedAmount,
                booking.TotalAmount,
                booking.PaidAmount,
                booking.PromoCodeSnapshot,
                booking.CancellationReason,
                booking.ExpiresAtUtc,
                booking.Note,
                booking.CreatedAtUtc,
                [],
                booking.ServiceLines.Select(line => new BookingServiceLineDto(line.ServiceCodeSnapshot, line.ServiceNameSnapshot, line.UnitNameSnapshot, line.UnitPrice, line.Quantity, line.LineTotal)).ToArray(),
                booking.Payments.Select(payment => new PaymentRecordDto(payment.Id, payment.PaymentType, payment.Method, payment.Amount, payment.Status, payment.TransactionCode, payment.Note, payment.ProcessedAtUtc, payment.CreatedAtUtc)).ToArray());

        private BookingSummaryDto ToSummary(Booking booking)
            => new(
                booking.Id,
                booking.BookingCode,
                Field.Name,
                booking.BookingDate,
                booking.StartMinute,
                booking.EndMinute,
                booking.CustomerName,
                booking.CustomerPhone,
                booking.Status,
                booking.PaymentStatus,
                booking.TotalAmount,
                booking.CreatedAtUtc);
    }
}
