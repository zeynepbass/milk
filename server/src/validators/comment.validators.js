import { RULES } from "./rules.js";
import { z, idParams, paginationQuery, requiredText } from "./common.js";

export const listCommentsSchema = { params: idParams, query: paginationQuery };

export const addCommentSchema = {
  params: idParams,
  body: z.object({ text: requiredText(RULES.comment.max) }),
};

export const commentIdSchema = { params: idParams };
