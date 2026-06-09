import { handleOAuthCallback } from "../modules/auth.js";

handleOAuthCallback().catch((error) => {
  document.querySelector("[data-callback-status]").textContent = error.message;
});
