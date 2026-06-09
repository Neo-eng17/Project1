import { initAuthModal } from "./modules/auth.js";
import { initLazySections } from "./modules/lazy.js";
import { initLeadCapture, initNewsletter } from "./modules/lead.js";
import { initSeoRuntime } from "./modules/seo.js";
import { initNavigation } from "./modules/ui.js";

initNavigation();
initLazySections();
initSeoRuntime();
initLeadCapture();
initNewsletter();
initAuthModal();
