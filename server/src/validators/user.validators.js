import { FEEDBACK_TYPES, ROLES, RULES } from "./rules.js";
import { z, email, password, idParams, paginationQuery, requiredText, optionalText } from "./common.js";

export const updateMeSchema = {
  body: z
    .strictObject({
      name: requiredText(RULES.name.max).optional(),
      surname: requiredText(RULES.name.max).optional(),
      province: optionalText(RULES.location.max),
      district: optionalText(RULES.location.max),
      organic: optionalText(RULES.organic.max),
    })
    .refine((body) => Object.keys(body).length > 0, "Güncellenecek alan yok"),
};

export const changePasswordSchema = {
  body: z.strictObject({
    currentPassword: z.string().min(1, "Mevcut şifre zorunludur"),
    newPassword: password,
  }),
};

export const changeEmailSchema = {
  body: z.strictObject({
    email,
    currentPassword: z.string().min(1, "Mevcut şifre zorunludur"),
  }),
};

export const deleteMeSchema = {
  body: z.strictObject({
    password: z.string().min(1, "Şifre zorunludur"),
  }),
};

export const userIdSchema = { params: idParams };

export const followListSchema = { params: idParams, query: paginationQuery };

export const listUsersSchema = { query: paginationQuery };

export const organicStatusSchema = {
  body: z.strictObject({
    userId: idParams.shape.id,
    organicStatus: z.boolean(),
  }),
};

export const changeRoleSchema = {
  params: idParams,
  body: z.strictObject({ role: z.enum(ROLES) }),
};

export const createFeedbackSchema = {
  body: z.object({
    type: z.enum(FEEDBACK_TYPES),
    message: requiredText(RULES.feedback.max),
  }),
};
