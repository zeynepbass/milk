import { sendMessage } from "../controllers/message.controller.js";
import { sendMessageSchema } from "../validators/message.validators.js";
import { defineRoutes } from "./defineRoutes.js";

const routes = defineRoutes("/api/messages", "Mesajlaşma");

routes.post("/", { summary: "Mesaj gönder", schemas: sendMessageSchema, status: 201 }, sendMessage);

export default routes.router;
