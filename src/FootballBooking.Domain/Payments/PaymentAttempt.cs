using FootballBooking.Domain.Bookings;

namespace FootballBooking.Domain.Payments;

/// <summary>One payment instruction or gateway attempt, NOT proof that money was received.</summary>
public sealed class PaymentAttempt
{
    private PaymentAttempt() { }

    public PaymentAttempt(Guid id, Guid bookingId, PaymentMethod method, long amount,
        string requestCode, DateTimeOffset expiresAtUtc, DateTimeOffset utcNow)
    {
        if (id == Guid.Empty || bookingId == Guid.Empty) throw new ArgumentException("Invalid payment identifier.");
        if (amount <= 0) throw new ArgumentOutOfRangeException(nameof(amount));
        if (string.IsNullOrWhiteSpace(requestCode) || requestCode.Length > 64)
            throw new ArgumentException("Invalid request code.", nameof(requestCode));
        if (expiresAtUtc <= utcNow) throw new ArgumentException("Attempt must expire in the future.");
        Id = id;
        BookingId = bookingId;
        Method = method;
        Amount = amount;
        RequestCode = requestCode;
        ExpiresAtUtc = expiresAtUtc;
        CreatedAtUtc = utcNow;
        UpdatedAtUtc = utcNow;
        Status = PaymentAttemptStatus.Pending;
    }

    public Guid Id { get; private set; }
    public Guid BookingId { get; private set; }
    public PaymentMethod Method { get; private set; }
    public long Amount { get; private set; }
    public string RequestCode { get; private set; } = string.Empty;
    public PaymentAttemptStatus Status { get; private set; }
    public string? ExternalReference { get; private set; }
    public long? ReportedAmount { get; private set; }
    public string? Note { get; private set; }
    public Guid? VerifiedByUserId { get; private set; }
    public DateTimeOffset ExpiresAtUtc { get; private set; }
    public DateTimeOffset CreatedAtUtc { get; private set; }
    public DateTimeOffset UpdatedAtUtc { get; private set; }
    public DateTimeOffset? ProcessedAtUtc { get; private set; }

    public bool IsLive(DateTimeOffset now) => Status == PaymentAttemptStatus.Pending && ExpiresAtUtc > now;

    public void Expire(DateTimeOffset now)
    {
        if (Status == PaymentAttemptStatus.Pending && ExpiresAtUtc <= now)
        {
            Status = PaymentAttemptStatus.Expired;
            UpdatedAtUtc = now;
        }
    }

    public void Cancel(DateTimeOffset now)
    {
        if (Status != PaymentAttemptStatus.Pending) return;
        Status = PaymentAttemptStatus.Cancelled;
        UpdatedAtUtc = now;
    }

    public void Confirm(string reference, long receivedAmount, Guid? verifiedBy, DateTimeOffset now)
    {
        if (!IsLive(now)) throw new InvalidOperationException("Payment attempt is no longer live.");
        if (string.IsNullOrWhiteSpace(reference) || reference.Trim().Length > 100)
            throw new ArgumentException("A verified bank/gateway reference is required.", nameof(reference));
        if (receivedAmount != Amount) throw new ArgumentException("Received amount does not match the attempt.");
        ExternalReference = reference.Trim();
        ReportedAmount = receivedAmount;
        VerifiedByUserId = verifiedBy;
        ProcessedAtUtc = now;
        UpdatedAtUtc = now;
        Status = PaymentAttemptStatus.Succeeded;
    }

    public void FlagForReconciliation(string reference, long? receivedAmount, string reason, DateTimeOffset now)
    {
        if (Status == PaymentAttemptStatus.Succeeded) throw new InvalidOperationException("Succeeded attempt cannot be flagged.");
        if (string.IsNullOrWhiteSpace(reference) || reference.Trim().Length > 100)
            throw new ArgumentException("A transaction reference is required.", nameof(reference));
        ExternalReference = reference.Trim();
        ReportedAmount = receivedAmount;
        Note = reason.Length <= 500 ? reason : reason[..500];
        Status = PaymentAttemptStatus.NeedsReconciliation;
        UpdatedAtUtc = now;
        ProcessedAtUtc = now;
    }
}
