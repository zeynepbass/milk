import * as notifications from "../controllers/notification.controller.js";
import { listNotificationsSchema, notificationIdSchema } from "../validators/notification.validators.js";
import { defineRoutes } from "./defineRoutes.js";

const routes = defineRoutes("/api/notifications", "Bildirimler");

routes.get("/", { summary: "Bildirimler", schemas: listNotificationsSchema }, notifications.getNotifications);
routes.get("/unread-count", { summary: "Okunmamış bildirim sayısı" }, notifications.getUnreadCount);
routes.patch("/read-all", { summary: "Tümünü okundu yap" }, notifications.markAllAsRead);
routes.patch("/:id/read", { summary: "Okundu yap", schemas: notificationIdSchema }, notifications.markAsRead);

export default routes.router;
