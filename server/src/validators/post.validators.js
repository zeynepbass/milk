import { POST_CATEGORIES, RULES } from "./rules.js";
import { z, idParams, paginationQuery, requiredText, optionalText } from "./common.js";

const imageUrl = z.string().trim().min(1).max(500);

const toArray = (value) => {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
};

export const listPostsSchema = {
  query: paginationQuery.extend({
    district: optionalText(RULES.location.max),
    category: z.enum(POST_CATEGORIES).optional(),
    title: optionalText(RULES.searchTitle.max),
  }),
};

export const feedSchema = { query: paginationQuery };

export const createPostSchema = {
  body: z.object({
    title: requiredText(RULES.postTitle.max),
    description: optionalText(RULES.postDescription.max),
    category: z.enum(POST_CATEGORIES),
    province: optionalText(RULES.location.max),
    district: optionalText(RULES.location.max),
  }),
};

export const updatePostSchema = {
  params: idParams,
  body: z.object({
    title: requiredText(RULES.postTitle.max).optional(),
    description: optionalText(RULES.postDescription.max),
    category: z.enum(POST_CATEGORIES).optional(),
    province: optionalText(RULES.location.max),
    district: optionalText(RULES.location.max),
    removeImages: z
      .union([uploadUrl, z.array(uploadUrl).max(RULES.postImages.max)])
      .optional()
      .transform(toArray),
  }),
};

export const postIdSchema = { params: idParams };
