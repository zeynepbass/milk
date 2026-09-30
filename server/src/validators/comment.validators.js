import { z, idParams, requiredText } from "./common.js";

export const addCommentSchema = {
  params: idParams,
  body: z.object({ text: requiredText(500) }),
};

export const commentIdSchema = { params: idParams };
