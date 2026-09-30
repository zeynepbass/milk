import { z } from "zod";
import { FEEDBACK_TYPES, POST_CATEGORIES, RULES, SELF_ASSIGNABLE_ROLES } from "./rules";

z.config(z.locales.tr());

const requiredText = (max, label) =>
  z.string().trim().min(1, `${label} zorunludur`).max(max, `${label} en fazla ${max} karakter olabilir`);

const optionalText = (max, label) => z.string().trim().max(max, `${label} en fazla ${max} karakter olabilir`);

const email = z.string().trim().toLowerCase().pipe(z.email("Geçerli bir e-posta adresi giriniz"));

const password = z
  .string()
  .min(RULES.password.min, `Şifre en az ${RULES.password.min} karakter olmalıdır`)
  .refine((value) => new TextEncoder().encode(value).length <= RULES.password.maxBytes, "Şifre çok uzun");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Şifre zorunludur"),
});

export const registerSchema = z.object({
  name: requiredText(RULES.name.max, "Ad"),
  surname: requiredText(RULES.name.max, "Soyad"),
  email,
  password,
  role: z.enum(SELF_ASSIGNABLE_ROLES),
});

export const profileSchema = z
  .object({
    name: requiredText(RULES.name.max, "Ad"),
    surname: requiredText(RULES.name.max, "Soyad"),
    province: optionalText(RULES.location.max, "İl"),
    district: optionalText(RULES.location.max, "İlçe"),
    email,
    currentPassword: z.string(),
    originalEmail: z.string(),
  })
  .refine((values) => values.email === values.originalEmail || values.currentPassword.length > 0, {
    path: ["currentPassword"],
    message: "E-posta değişikliği için mevcut şifre gerekli",
  });

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Mevcut şifre zorunludur"),
  newPassword: password,
});

export const deleteAccountSchema = z.object({
  password: z.string().min(1, "Şifre zorunludur"),
});

export const postSchema = z.object({
  title: requiredText(RULES.postTitle.max, "Başlık"),
  description: optionalText(RULES.postDescription.max, "Açıklama"),
  category: z.enum(POST_CATEGORIES, { error: "Kategori seçiniz" }),
  province: optionalText(RULES.location.max, "İl"),
  district: optionalText(RULES.location.max, "İlçe"),
});

export const commentSchema = z.object({ text: requiredText(RULES.comment.max, "Yorum") });

export const messageSchema = z.object({ text: requiredText(RULES.message.max, "Mesaj") });

export const feedbackSchema = z.object({
  type: z.enum(FEEDBACK_TYPES),
  message: requiredText(RULES.feedback.max, "Mesaj"),
});

export { POST_CATEGORY_OPTIONS, ROLE_LABELS } from "./labels";

export { RULES };
