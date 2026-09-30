import { USER_ROLES } from "../models/User.js";
import { FEEDBACK_TYPES } from "../models/Feedback.js";
import { z, email, password, idParams, limitQuery, requiredText, optionalText } from "./common.js";

export const updateMeSchema = {
  body: z
    .strictObject({
      name: requiredText(50).optional(),
      surname: requiredText(50).optional(),
      province: optionalText(60),
      district: optionalText(60),
      organic: optionalText(500),
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

export const followSchema = { params: idParams };

export const listUsersSchema = { query: limitQuery };

export const organicStatusSchema = {
  body: z.strictObject({
    userId: idParams.shape.id,
    organicStatus: z.boolean(),
  }),
};

export const changeRoleSchema = {
  params: idParams,
  body: z.strictObject({ role: z.enum(USER_ROLES) }),
};

export const createFeedbackSchema = {
  body: z.object({
    type: z.enum(FEEDBACK_TYPES),
    message: requiredText(2000),
  }),
};
