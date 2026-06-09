import { initDashboard } from "../modules/auth.js";

initDashboard().catch((error) => {
  document.querySelector("[data-dashboard-status]").textContent = error.message;
});
