// GĐ3 navigation and bookings filtering. No account or payment data is fetched by JS.
export function initializeAccountCenter() {
  const menus = [...document.querySelectorAll("[data-account-menu]")];
  document.addEventListener("pointerdown", (event) => {
    for (const menu of menus) {
      if (!menu.contains(event.target)) menu.open = false;
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    for (const menu of menus) {
      if (!menu.open) continue;
      menu.open = false;
      menu.querySelector("summary")?.focus();
    }
  });
  const list = document.querySelector("[data-bookings-list]");
  if (!list) return;
  const buttons = [...document.querySelectorAll("[data-booking-filter]")];
  const rows = [...list.querySelectorAll("[data-booking-row]")];
  const empty = document.querySelector("[data-booking-filter-empty]");
  const search = document.querySelector("[data-booking-search-input]");
  let selected = "all";
  function update() {
    const term = (search?.value ?? "").trim().toLocaleLowerCase("vi");
    let shown = 0;
    for (const row of rows) {
      const matchesGroup = selected === "all" || row.dataset.bookingGroup === selected;
      const matchesText = (row.dataset.bookingSearch ?? "").toLocaleLowerCase("vi").includes(term);
      row.hidden = !(matchesGroup && matchesText);
      if (!row.hidden) shown++;
    }
    for (const button of buttons) button.setAttribute("aria-pressed", String(button.dataset.bookingFilter === selected));
    if (empty) empty.hidden = shown !== 0;
  }
  for (const button of buttons) button.addEventListener("click", () => {
    selected = button.dataset.bookingFilter ?? "all";
    update();
  });
  search?.addEventListener("input", update);
  update();
}
