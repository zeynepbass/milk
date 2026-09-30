import { RULES } from "./rules.js";
import { z, idParams, objectId, paginationQuery, requiredText } from "./common.js";

export const sendMessageBody = z.object({
  receiverId: objectId,
  text: requiredText(RULES.message.max),
});

export const sendMessageSchema = { body: sendMessageBody };

export const conversationWithSchema = {
  params: z.object({ userId: objectId }),
};

export const conversationMessagesSchema = {
  params: idParams,
  query: paginationQuery,
};

export const conversationIdSchema = { params: idParams };

export const conversationReadBody = z.object({ conversationId: objectId });
