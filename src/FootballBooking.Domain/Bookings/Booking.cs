using FootballBooking.Domain.Fields;

namespace FootballBooking.Domain.Bookings;

public sealed class Booking
{
    private readonly List<BookingServiceLine> _serviceLines = [];
    private readonly List<PaymentRecord> _payments = [];

    private Booking()
    {
    }

    public Booking(
        Guid id,
        string bookingCode,
        Guid fieldId,
        DateOnly bookingDate,
        int startMinute,
        int endMinute,
        string customerName,
        string customerPhone,
        string customerPhoneNormalized,
        string? customerEmail,
        Guid? customerUserId,
        Guid? createdByUserId,
        BookingSource source,
        BookingStatus status,
        PaymentStatus paymentStatus,
        long courtAmount,
        long serviceAmount,
        long discountAmount,
        long totalAmount,
        DateTimeOffset? expiresAtUtc,
        DateTimeOffset utcNow,
        string? note)
        : this(
            id,
            bookingCode,
            fieldId,
            bookingDate,
            startMinute,
            endMinute,
            customerName,
            customerPhone,
            customerPhoneNormalized,
            customerEmail,
            customerUserId,
            createdByUserId,
            source,
            status,
            paymentStatus,
            courtAmount,
            serviceAmount,
            discountAmount,
            totalAmount,
            null,
            null,
            expiresAtUtc,
            utcNow,
            note)
    {
    }

    public Booking(
        Guid id,
        string bookingCode,
        Guid fieldId,
        DateOnly bookingDate,
        int startMinute,
        int endMinute,
        string customerName,
        string customerPhone,
        string customerPhoneNormalized,
        string? customerEmail,
        Guid? customerUserId,
        Guid? createdByUserId,
        BookingSource source,
        BookingStatus status,
        PaymentStatus paymentStatus,
        long courtAmount,
        long serviceAmount,
        long discountAmount,
        long totalAmount,
        Guid? promoCodeId,
        string? promoCodeSnapshot,
        DateTimeOffset? expiresAtUtc,
        DateTimeOffset utcNow,
        string? note)
    {
        Id = id;
        BookingCode = bookingCode.Trim();
        FieldId = fieldId;
        BookingDate = bookingDate;
        StartMinute = startMinute;
        EndMinute = endMinute;
        CustomerName = customerName.Trim();
        CustomerPhone = customerPhone.Trim();
        CustomerPhoneNormalized = customerPhoneNormalized.Trim();
        CustomerEmail = string.IsNullOrWhiteSpace(customerEmail) ? null : customerEmail.Trim();
        CustomerUserId = customerUserId;
        CreatedByUserId = createdByUserId;
        Source = source;
        Status = status;
        PaymentStatus = paymentStatus;
        CourtAmount = courtAmount;
        ServiceAmount = serviceAmount;
        DiscountAmount = discountAmount;
        TotalAmount = totalAmount;
        PromoCodeId = promoCodeId;
        PromoCodeSnapshot = string.IsNullOrWhiteSpace(promoCodeSnapshot) ? null : promoCodeSnapshot.Trim().ToUpperInvariant();
        ExpiresAtUtc = expiresAtUtc;
        Note = string.IsNullOrWhiteSpace(note) ? null : note.Trim();
        CreatedAtUtc = utcNow;
        UpdatedAtUtc = utcNow;
    }

    public Guid Id { get; private set; }
    public string BookingCode { get; private set; } = string.Empty;
    public Guid FieldId { get; private set; }
    public Field Field { get; private set; } = null!;
    public DateOnly BookingDate { get; private set; }
    public int StartMinute { get; private set; }
    public int EndMinute { get; private set; }
    public string CustomerName { get; private set; } = string.Empty;
    public string CustomerPhone { get; private set; } = string.Empty;
    public string CustomerPhoneNormalized { get; private set; } = string.Empty;
    public string? CustomerEmail { get; private set; }
    public Guid? CustomerUserId { get; private set; }
    public Guid? CreatedByUserId { get; private set; }
    public BookingSource Source { get; private set; }
    public BookingStatus Status { get; private set; }
    public PaymentStatus PaymentStatus { get; private set; }
    public long CourtAmount { get; private set; }
    public long ServiceAmount { get; private set; }
    public long DiscountAmount { get; private set; }
    public long CancellationFeeAmount { get; private set; }
    public long RefundedAmount { get; private set; }
    public long TotalAmount { get; private set; }
    public long PaidAmount { get; private set; }
    public Guid? PromoCodeId { get; private set; }
    public PromoCode? PromoCode { get; private set; }
    public string? PromoCodeSnapshot { get; private set; }
    public DateTimeOffset? ExpiresAtUtc { get; private set; }
    public string? Note { get; private set; }
    public DateTimeOffset CreatedAtUtc { get; private set; }
    public DateTimeOffset UpdatedAtUtc { get; private set; }
    public DateTimeOffset? CancelledAtUtc { get; private set; }
    public string? CancellationReason { get; private set; }
    public IReadOnlyCollection<BookingServiceLine> ServiceLines => _serviceLines;
    public IReadOnlyCollection<PaymentRecord> Payments => _payments;

    public bool BlocksAvailability(DateTimeOffset utcNow)
        => Status is BookingStatus.Confirmed or BookingStatus.CheckedIn or BookingStatus.InProgress
            || (Status == BookingStatus.PendingPayment && ExpiresAtUtc > utcNow);

    public bool Overlaps(DateOnly bookingDate, int startMinute, int endMinute)
        => BookingDate == bookingDate
            && startMinute < EndMinute
            && endMinute > StartMinute;

    public bool ExpireIfNeeded(DateTimeOffset utcNow)
    {
        if (Status != BookingStatus.PendingPayment || ExpiresAtUtc is null || ExpiresAtUtc > utcNow)
            return false;
        Status = BookingStatus.Expired;
        UpdatedAtUtc = utcNow;
        return true;
    }

    public void Confirm(DateTimeOffset utcNow)
    {
        if (Status != BookingStatus.PendingPayment)
        {
            return;
        }

        Status = BookingStatus.Confirmed;
        ExpiresAtUtc = null;
        UpdatedAtUtc = utcNow;
    }

    public void MarkCheckedIn(DateTimeOffset utcNow)
    {
        if (Status != BookingStatus.Confirmed)
        {
            return;
        }

        Status = BookingStatus.CheckedIn;
        UpdatedAtUtc = utcNow;
    }

    public void Start(DateTimeOffset utcNow)
    {
        if (Status != BookingStatus.CheckedIn)
        {
            return;
        }

        Status = BookingStatus.InProgress;
        UpdatedAtUtc = utcNow;
    }

    public void Complete(DateTimeOffset utcNow)
    {
        if (Status != BookingStatus.InProgress)
        {
            return;
        }

        Status = BookingStatus.Completed;
        UpdatedAtUtc = utcNow;
    }

    public void MarkNoShow(DateTimeOffset utcNow)
    {
        if (Status != BookingStatus.Confirmed)
        {
            return;
        }

        Status = BookingStatus.NoShow;
        UpdatedAtUtc = utcNow;
    }

    public void ApplyCommercialSnapshot(
        IReadOnlyList<BookingServiceLine> serviceLines,
        Guid? promoCodeId,
        string? promoCodeSnapshot,
        long serviceAmount,
        long discountAmount,
        DateTimeOffset utcNow)
    {
        if (serviceAmount < 0 || discountAmount < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(serviceAmount), "Số tiền dịch vụ và giảm giá không được âm.");
        }

        _serviceLines.Clear();
        _serviceLines.AddRange(serviceLines);
        PromoCodeId = promoCodeId;
        PromoCodeSnapshot = string.IsNullOrWhiteSpace(promoCodeSnapshot) ? null : promoCodeSnapshot.Trim().ToUpperInvariant();
        ServiceAmount = serviceAmount;
        DiscountAmount = Math.Min(discountAmount, CourtAmount + serviceAmount);
        TotalAmount = Math.Max(0, CourtAmount + ServiceAmount - DiscountAmount + CancellationFeeAmount);
        RecalculatePaymentStatus();
        UpdatedAtUtc = utcNow;
    }

    public PaymentRecord RecordPayment(
        PaymentRecordType paymentType,
        PaymentMethod method,
        long amount,
        PaymentRecordStatus status,
        string? transactionCode,
        string? note,
        Guid? recordedByUserId,
        DateTimeOffset utcNow)
    {
        var payment = new PaymentRecord(Guid.NewGuid(), Id, paymentType, method, amount, status, transactionCode, note, recordedByUserId, utcNow);
        _payments.Add(payment);
        RecalculateFinancialTotals();
        UpdatedAtUtc = utcNow;
        return payment;
    }

    public void RecalculateFinancialTotals()
    {
        var succeededPayments = _payments.Where(payment => payment.Status == PaymentRecordStatus.Succeeded).ToArray();
        PaidAmount = succeededPayments
            .Where(payment => payment.PaymentType == PaymentRecordType.Payment)
            .Sum(payment => payment.Amount);
        RefundedAmount = succeededPayments
            .Where(payment => payment.PaymentType == PaymentRecordType.Refund)
            .Sum(payment => payment.Amount);
        RecalculatePaymentStatus();
    }

    public void Cancel(DateTimeOffset utcNow, string? reason = null, long cancellationFeeAmount = 0)
    {
        if (Status is BookingStatus.Completed or BookingStatus.Cancelled or BookingStatus.NoShow or BookingStatus.Expired)
        {
            return;
        }

        Status = BookingStatus.Cancelled;
        CancellationFeeAmount = Math.Max(0, cancellationFeeAmount);
        TotalAmount = Math.Max(0, CourtAmount + ServiceAmount - DiscountAmount + CancellationFeeAmount);
        CancellationReason = string.IsNullOrWhiteSpace(reason) ? null : reason.Trim();
        CancelledAtUtc = utcNow;
        RecalculatePaymentStatus();
        UpdatedAtUtc = utcNow;
    }

    private void RecalculatePaymentStatus()
    {
        var hasRefundPending = _payments.Any(payment => payment.PaymentType == PaymentRecordType.Refund && payment.Status == PaymentRecordStatus.Pending);
        var netPaid = PaidAmount - RefundedAmount;

        PaymentStatus = hasRefundPending
            ? PaymentStatus.RefundPending
            : PaidAmount > 0 && RefundedAmount >= PaidAmount
                ? PaymentStatus.Refunded
                : RefundedAmount > 0
                    ? PaymentStatus.PartiallyRefunded
                    : netPaid >= TotalAmount && TotalAmount > 0
                        ? PaymentStatus.Paid
                        : netPaid > 0
                            ? PaymentStatus.PartiallyPaid
                            : PaymentStatus.Unpaid;
    }
}
