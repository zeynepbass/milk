import { POST_CATEGORIES } from "../models/Post.js";
import { z, idParams, limitQuery, requiredText, optionalText } from "./common.js";

export const listPostsSchema = {
  query: limitQuery.extend({
    district: optionalText(60),
    category: z.enum(POST_CATEGORIES).optional(),
    title: optionalText(100),
  }),
};

export const createPostSchema = {
  body: z.object({
    title: requiredText(120),
    description: optionalText(2000),
    category: z.enum(POST_CATEGORIES),
    province: optionalText(60),
    district: optionalText(60),
  }),
};

export const updatePostSchema = {
  params: idParams,
  body: z.object({
    title: requiredText(120).optional(),
    description: optionalText(2000),
    category: z.enum(POST_CATEGORIES).optional(),
    province: optionalText(60),
    district: optionalText(60),
  }),
};

export const postIdSchema = { params: idParams };

export const limitOnlySchema = { query: limitQuery };
