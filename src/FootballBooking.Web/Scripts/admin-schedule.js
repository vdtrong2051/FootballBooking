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
  const calendarError = document.getElementById("fb4c-calendar-error");
  let compactView = window.matchMedia("(max-width: 767px)").matches;

  const calendar = new Calendar(calendarElement, {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: compactView ? "timeGridDay" : "timeGridWeek",
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
    windowResize: () => {
      const small = window.matchMedia("(max-width: 767px)").matches;
      if (small === compactView) return;
      compactView = small;
      calendar.setOption("headerToolbar", {
        left: "prev,next today",
        center: "title",
        right: small ? "timeGridDay,dayGridMonth" : "dayGridMonth,timeGridWeek,timeGridDay",
      });
      calendar.changeView(small ? "timeGridDay" : "timeGridWeek");
    },
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: compactView ? "timeGridDay,dayGridMonth" : "dayGridMonth,timeGridWeek,timeGridDay",
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
        .then((events) => {
          if (calendarError) {
            calendarError.hidden = true;
            calendarError.textContent = "";
          }
          successCallback(events);
        })
        .catch((error) => {
          // Keep FullCalendar mounted: display a separate accessible error instead.
          if (calendarError) {
            calendarError.textContent = error.message;
            calendarError.hidden = false;
          }
          failureCallback(error);
        });
    },
    dateClick: (info) => {
      const clickedDate = info.date;
      const yyyyMmDd = `${clickedDate.getFullYear()}-${String(clickedDate.getMonth() + 1).padStart(2, "0")}-${String(clickedDate.getDate()).padStart(2, "0")}`;
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
