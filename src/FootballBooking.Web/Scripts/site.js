import "preline";

const initializePreline = () => {
  if (window.HSStaticMethods?.autoInit) {
    window.HSStaticMethods.autoInit();
  }
};

import { initializeAccountCenter } from "./account-center.js";

document.addEventListener("DOMContentLoaded", () => {
  initializePreline();
  initializeAccountCenter();
});
