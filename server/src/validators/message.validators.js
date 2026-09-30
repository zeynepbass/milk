import { MESSAGE_MAX_LENGTH } from "../models/Message.js";
import { z, objectId, requiredText } from "./common.js";

export const sendMessageBody = z.object({
  receiverId: objectId,
  text: requiredText(MESSAGE_MAX_LENGTH),
});

export const sendMessageSchema = { body: sendMessageBody };

export const conversationWithSchema = {
  params: z.object({ userId: objectId }),
};

export const notificationIdSchema = {
  params: z.object({ id: objectId }),
};
