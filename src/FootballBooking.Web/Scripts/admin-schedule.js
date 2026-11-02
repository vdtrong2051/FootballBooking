import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import viLocale from "@fullcalendar/core/locales/vi";

const calendarElement = document.getElementById("admin-schedule-calendar");

const vietnameseButtons = {
  today: "Hôm nay",
  month: "Tháng",
  week: "Tuần",
  day: "Ngày",
  list: "Danh sách",
};

if (calendarElement) {
  const eventsUrl = calendarElement.dataset.eventsUrl;
  const createUrl = calendarElement.dataset.createUrl || "/admin/bookings/create";
  const fieldId = calendarElement.dataset.fieldId;
  const status = calendarElement.dataset.status;
  const initialDate = calendarElement.dataset.initialDate;

  const calendar = new Calendar(calendarElement, {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: window.matchMedia("(max-width: 640px)").matches ? "timeGridDay" : "timeGridWeek",
    initialDate,
    locale: viLocale,
    firstDay: 1,
    nowIndicator: true,
    selectable: true,
    allDaySlot: false,
    slotMinTime: "06:00:00",
    slotMaxTime: "23:30:00",
    slotDuration: "00:30:00",
    height: "auto",
    expandRows: true,
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    buttonText: vietnameseButtons,
    events: (info, successCallback, failureCallback) => {
      const url = new URL(eventsUrl, window.location.origin);
      url.searchParams.set("start", info.startStr);
      url.searchParams.set("end", info.endStr);
      if (fieldId) {
        url.searchParams.set("fieldId", fieldId);
      }
      if (status) {
        url.searchParams.set("status", status);
      }

      fetch(url, { headers: { Accept: "application/json" } })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Không tải được lịch sân.");
          }

          return response.json();
        })
        .then(successCallback)
        .catch((error) => {
          calendarElement.innerHTML = `<div class="rounded-ui border border-red-200 bg-red-50 p-4 text-sm text-red-800">${error.message}</div>`;
          failureCallback(error);
        });
    },
    dateClick: (info) => {
      const clickedDate = info.date;
      const yyyyMmDd = clickedDate.toISOString().slice(0, 10);
      const startMinute = clickedDate.getHours() * 60 + clickedDate.getMinutes();
      const targetUrl = new URL(createUrl, window.location.origin);
      if (fieldId) {
        targetUrl.searchParams.set("fieldId", fieldId);
      }
      targetUrl.searchParams.set("date", yyyyMmDd);
      if (startMinute >= 360 && startMinute <= 1350) {
        targetUrl.searchParams.set("startMinute", String(startMinute));
      }
      window.location.assign(targetUrl.toString());
    },
    eventClick: (info) => {
      if (info.event.url) {
        info.jsEvent.preventDefault();
        window.location.assign(info.event.url);
      }
    },
    eventDidMount: (info) => {
      const props = info.event.extendedProps;
      const details = [
        props.description,
        props.customerPhone ? `SĐT: ${props.customerPhone}` : null,
        props.paymentStatusLabel ? `TT: ${props.paymentStatusLabel}` : null,
      ]
        .filter(Boolean)
        .join(" | ");
      if (details) {
        info.el.setAttribute("title", details);
      }
    },
  });

  calendar.render();
}
