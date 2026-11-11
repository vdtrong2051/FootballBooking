/* FootballBooking GĐ1 — progressive enhancement. The server is authoritative. */
(() => {
  'use strict';
  const form = document.getElementById('gd1-booking-form');
  if (!form) return;

  const byId = (id) => document.getElementById(id);
  const field = byId('FieldId');
  const date = byId('BookingDateText');
  const duration = byId('DurationMinutes');
  const slots = byId('gd1-slots');
  const slotStatus = byId('gd1-slot-status');
  const quoteStatus = byId('gd1-quote-status');
  const quoteErrors = byId('gd1-quote-errors');
  const submit = byId('gd1-submit');
  const phone = byId('CustomerPhone');
  const promotion = byId('PromotionCode');
  const requestToken = form.querySelector('input[name="__RequestVerificationToken"]')?.value;
  const prices = {
    court: byId('gd1-price-court'), services: byId('gd1-price-services'),
    discount: byId('gd1-price-discount'), total: byId('gd1-price-total'),
  };
  const money = (value) => `${new Intl.NumberFormat('vi-VN').format(Number(value) || 0)} ₫`;
  const minute = (value) => `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;
  const isDate = (value) => /^\d{2}\/\d{2}\/\d{4}$/.test(value.trim());
  let revision = 0;
  let availabilityAbort = null;
  let quoteAbort = null;
  let timer = null;
  let hasValidQuote = !submit.disabled;

  function selectedStart() {
    const input = slots.querySelector('input[name="StartMinute"]:checked:not(:disabled)');
    return input ? Number(input.value) : -1;
  }

  function enableSubmit(valid) {
    hasValidQuote = valid;
    submit.disabled = !valid;
    submit.setAttribute('aria-disabled', String(!valid));
  }

  function showErrors(messages) {
    quoteErrors.replaceChildren();
    for (const message of messages || []) {
      const item = document.createElement('li');
      item.textContent = String(message);
      quoteErrors.append(item);
    }
  }

  function clearQuote(message) {
    enableSubmit(false);
    quoteStatus.textContent = message;
    showErrors([]);
    byId('gd1-price-segments').replaceChildren();
    prices.court.textContent = money(0);
    prices.services.textContent = money(0);
    prices.discount.textContent = `-${money(0)}`;
    prices.total.textContent = money(0);
    byId('gd1-mobile-total').textContent = money(0);
  }

  function updateSummary() {
    const name = field.options[field.selectedIndex]?.textContent || 'Chưa chọn';
    byId('gd1-summary-field').textContent = name;
    byId('gd1-summary-date').textContent = date.value.trim();
    const start = selectedStart();
    byId('gd1-summary-time').textContent = start < 0
      ? 'Chưa chọn'
      : `${minute(start)} – ${minute(start + Number(duration.value))}`;
  }

  function renderSlots(items) {
    slots.replaceChildren();
    if (!Array.isArray(items) || items.length === 0) {
      slotStatus.textContent = 'Không có khung giờ phù hợp. Hãy đổi ngày, sân hoặc thời lượng.';
      return;
    }
    slotStatus.textContent = 'Chọn một khung giờ màu xanh. Khung giờ xám không còn khả dụng.';
    for (const item of items) {
      const label = document.createElement('label');
      label.className = 'flex min-w-0 items-center gap-2 rounded-ui border px-3 py-2 text-xs font-medium ' +
        (item.isAvailable ? 'cursor-pointer border-green-200 bg-green-50 text-green-900' : 'cursor-not-allowed border-slate-200 bg-slate-50 text-muted');
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'StartMinute';
      input.value = String(item.startMinute);
      input.disabled = !item.isAvailable;
      input.className = 'h-4 w-4 shrink-0 accent-green-700';
      input.setAttribute('aria-label', `${minute(item.startMinute)} đến ${minute(item.endMinute)}${item.unavailableReason ? ': ' + item.unavailableReason : ''}`);
      const text = document.createElement('span');
      text.textContent = minute(item.startMinute);
      label.append(input, text);
      slots.append(label);
    }
  }

  async function updateAvailability() {
    const myRevision = ++revision;
    availabilityAbort?.abort();
    quoteAbort?.abort();
    const startDate = date.value.trim();
    slots.replaceChildren();
    updateSummary();
    clearQuote('Đang cập nhật khung giờ...');
    if (!field.value || !isDate(startDate)) {
      slotStatus.textContent = 'Nhập ngày theo định dạng dd/MM/yyyy để xem giờ trống.';
      return;
    }
    const controller = new AbortController();
    availabilityAbort = controller;
    try {
      const url = `/fields/${encodeURIComponent(field.value)}/availability?date=${encodeURIComponent(startDate)}&durationMinutes=${encodeURIComponent(duration.value)}`;
      const response = await fetch(url, { signal: controller.signal, cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (myRevision !== revision) return;
      renderSlots(Array.isArray(data) ? data : data.slots);
      quoteStatus.textContent = 'Chọn một khung giờ để xem giá dự kiến.';
    } catch (error) {
      if (error.name === 'AbortError' || myRevision !== revision) return;
      slotStatus.textContent = 'Không tải được khung giờ. Kiểm tra kết nối rồi đổi lại ngày hoặc sân để thử lại.';
      quoteStatus.textContent = 'Không có báo giá do chưa tải được lịch.';
    }
  }

  function servicesFromForm() {
    return [...form.querySelectorAll('input[name^="Services["][name$=".ServiceId"]')]
      .map((idInput) => {
        const quantityName = idInput.name.replace('.ServiceId', '.Quantity');
        const quantity = Number(form.elements.namedItem(quantityName)?.value || 0);
        return { serviceId: idInput.value, quantity };
      }).filter((item) => item.quantity > 0);
  }

  function renderPrice(data) {
    const segmentBox = byId('gd1-price-segments');
    segmentBox.replaceChildren();
    for (const segment of data.segments || []) {
      const row = document.createElement('div');
      row.className = 'flex justify-between gap-2';
      const caption = document.createElement('span');
      caption.textContent = `${minute(segment.startMinute)}–${minute(segment.endMinute)} · ${segment.ruleName || ''}`;
      const sum = document.createElement('span');
      sum.textContent = money(segment.amount);
      row.append(caption, sum);
      segmentBox.append(row);
    }
    prices.court.textContent = money(data.courtAmount);
    prices.services.textContent = money(data.serviceAmount);
    prices.discount.textContent = `-${money(data.discountAmount)}`;
    prices.total.textContent = money(data.totalAmount);
    byId('gd1-mobile-total').textContent = money(data.totalAmount);
  }

  async function updateQuote() {
    quoteAbort?.abort();
    const myRevision = ++revision;
    const start = selectedStart();
    updateSummary();
    if (start < 0 || !isDate(date.value)) {
      clearQuote('Chọn một khung giờ trống để xem báo giá.');
      return;
    }
    clearQuote('Đang tính lại báo giá...');
    const controller = new AbortController();
    quoteAbort = controller;
    const body = {
      fieldId: field.value,
      bookingDateText: date.value.trim(),
      startMinute: start,
      durationMinutes: Number(duration.value),
      customerPhone: phone.value,
      promotionCode: promotion.value,
      services: servicesFromForm(),
    };
    try {
      const response = await fetch('/booking/quote', {
        method: 'POST', cache: 'no-store', signal: controller.signal,
        headers: { 'Content-Type': 'application/json', 'RequestVerificationToken': requestToken || '' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (myRevision !== revision) return;
      if (!response.ok) {
        clearQuote(data.message || 'Dữ liệu báo giá không hợp lệ.');
        return;
      }
      renderPrice(data);
      showErrors(data.errors);
      enableSubmit(Boolean(data.isValid));
      quoteStatus.textContent = data.isValid
        ? 'Báo giá cập nhật. Giá cuối cùng sẽ được kiểm tra lại khi xác nhận.'
        : 'Không thể đặt với các lựa chọn hiện tại. Vui lòng kiểm tra thông báo bên dưới.';
    } catch (error) {
      if (error.name === 'AbortError' || myRevision !== revision) return;
      clearQuote('Không tải được báo giá. Kiểm tra kết nối và thử lại.');
    }
  }

  function debounceQuote() {
    enableSubmit(false);
    quoteStatus.textContent = 'Đang cập nhật báo giá...';
    clearTimeout(timer);
    timer = setTimeout(updateQuote, 300);
  }

  slots.addEventListener('change', (event) => {
    if (event.target.matches('input[name="StartMinute"]')) updateQuote();
  });
  field.addEventListener('change', updateAvailability);
  duration.addEventListener('change', updateAvailability);
  date.addEventListener('input', () => {
    enableSubmit(false);
    quoteStatus.textContent = 'Đang kiểm tra ngày và khung giờ...';
    clearTimeout(timer);
    timer = setTimeout(updateAvailability, 350);
  });
  promotion.addEventListener('input', debounceQuote);
  phone.addEventListener('input', debounceQuote);
  form.addEventListener('input', (event) => {
    if (event.target.matches('input[name^="Services["][name$=".Quantity"]')) debounceQuote();
  });
  form.addEventListener('submit', (event) => {
    if (!hasValidQuote || selectedStart() < 0) {
      event.preventDefault();
      quoteStatus.textContent = 'Vui lòng chọn khung giờ hợp lệ và chờ báo giá trước khi xác nhận.';
    }
  });
  updateSummary();
})();
