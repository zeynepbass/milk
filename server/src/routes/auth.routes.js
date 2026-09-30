import { login, logout, refresh, register } from "../controllers/auth.controller.js";
import { authLimiter, loginLimiter, refreshLimiter } from "../middleware/rateLimiter.js";
import { requireAllowedOrigin } from "../middleware/originCheck.js";
import { loginSchema, registerSchema } from "../validators/auth.validators.js";
import { defineRoutes } from "./defineRoutes.js";

const routes = defineRoutes("/api/auth", "Auth");

routes.post(
  "/register",
  { summary: "Yeni hesap oluştur", auth: false, before: [authLimiter], schemas: registerSchema, status: 201 },
  register
);
routes.post(
  "/login",
  { summary: "Giriş yap", auth: false, before: [authLimiter, loginLimiter], schemas: loginSchema },
  login
);
routes.post(
  "/refresh",
  { summary: "Refresh cookie ile oturumu yenile", auth: false, before: [refreshLimiter, requireAllowedOrigin] },
  refresh
);
routes.post(
  "/logout",
  { summary: "Oturumu kapat", auth: false, before: [requireAllowedOrigin], status: 204 },
  logout
);

export default routes.router;
