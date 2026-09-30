import * as conversations from "../controllers/conversation.controller.js";
import {
  conversationIdSchema,
  conversationMessagesSchema,
  conversationWithSchema,
} from "../validators/message.validators.js";
import { defineRoutes } from "./defineRoutes.js";

const routes = defineRoutes("/api/conversations", "Mesajlaşma");

routes.get("/", { summary: "Sohbetler ve okunmamış sayıları" }, conversations.getMyConversations);
routes.get(
  "/with/:userId",
  { summary: "Bir kullanıcıyla olan sohbet", schemas: conversationWithSchema },
  conversations.getConversationWithUser
);
routes.get(
  "/:id/messages",
  { summary: "Sohbet mesajları", schemas: conversationMessagesSchema },
  conversations.getMessages
);
routes.patch(
  "/:id/read",
  { summary: "Sohbeti okundu yap", schemas: conversationIdSchema },
  conversations.markConversationRead
);

export default routes.router;
