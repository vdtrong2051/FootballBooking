/* GĐ5-A: staff booking availability refresher. Server validates under MySQL lock. */
(() => {
  'use strict';
  const form = document.getElementById('gd5a-admin-booking-form');
  if (!form) return;
  const field = form.querySelector('#FieldId');
  const date = form.querySelector('#BookingDateText');
  const duration = form.querySelector('#DurationMinutes');
  const start = form.querySelector('#StartMinute');
  const status = form.querySelector('#gd5a-admin-slot-status');
  if (!field || !date || !duration || !start || !status) return;
  let working = false;
  let verified = false;
  let generation = 0;
  let timer = null;

  async function refresh({ quiet = false } = {}) {
    if (verified || working) return false;
    const selectedStart = start.value;
    const mine = ++generation;
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(date.value.trim())) {
      status.textContent = 'Nhập ngày dd/MM/yyyy để xem giờ trống.';
      return false;
    }
    try {
      const url = `/fields/${encodeURIComponent(field.value)}/availability?date=${encodeURIComponent(date.value.trim())}&durationMinutes=${encodeURIComponent(duration.value)}`;
      const response = await fetch(url, { cache: 'no-store', credentials: 'same-origin' });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const result = await response.json();
      if (mine !== generation) return false;
      const slots = Array.isArray(result) ? result : result.slots;
      if (!Array.isArray(slots)) throw new Error('Invalid availability response');
      start.replaceChildren();
      start.add(new Option('Chọn khung giờ trống', '-1'));
      for (const slot of slots) {
        const option = new Option(slot.label + (slot.isAvailable ? '' : ' (đã kín)'), String(slot.startMinute));
        option.disabled = !slot.isAvailable;
        start.add(option);
      }
      const keep = [...start.options].find(option => option.value === selectedStart && !option.disabled);
      start.value = keep ? selectedStart : '-1';
      status.textContent = keep && selectedStart !== '-1'
        ? 'Giờ đã chọn vẫn còn trống.'
        : 'Đã cập nhật lịch. Vui lòng chọn khung giờ trống.';
      return !!keep && selectedStart !== '-1';
    } catch {
      if (!quiet) status.textContent = 'Không tải được giờ trống. Thử lại sau.';
      return false;
    }
  }

  function scheduleRefresh() {
    clearTimeout(timer);
    timer = setTimeout(() => refresh(), 350);
  }
  field.addEventListener('change', scheduleRefresh);
  duration.addEventListener('change', scheduleRefresh);
  date.addEventListener('input', scheduleRefresh);
  window.addEventListener('focus', () => { if (!document.hidden) refresh({ quiet: true }); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh({ quiet: true }); });
  setInterval(() => { if (!document.hidden) refresh({ quiet: true }); }, 15000);

  form.addEventListener('submit', async (event) => {
    if (verified) return;
    event.preventDefault();
    if (working || start.value === '-1') {
      status.textContent = 'Chọn khung giờ còn trống trước khi lưu.';
      return;
    }
    working = true;
    status.textContent = 'Đang kiểm tra lại giờ trống trước khi lưu...';
    try {
      const url = `/fields/${encodeURIComponent(field.value)}/availability?date=${encodeURIComponent(date.value.trim())}&durationMinutes=${encodeURIComponent(duration.value)}`;
      const response = await fetch(url, { cache: 'no-store', credentials: 'same-origin' });
      if (!response.ok) throw new Error('Availability unavailable');
      const result = await response.json();
      const slots = Array.isArray(result) ? result : result.slots;
      if (!Array.isArray(slots) || !slots.some(x => x.isAvailable && String(x.startMinute) === start.value)) {
        status.textContent = 'Giờ đã chọn vừa hết chỗ. Chọn giờ khác.';
        return;
      }
      if (!form.reportValidity()) return;
      verified = true;
      form.requestSubmit();
    } catch {
      status.textContent = 'Chưa xác minh được giờ trống; không gửi booking.';
    } finally {
      working = false;
    }
  });
  refresh({ quiet: true });
})();
