import { z } from "zod/mini";
import { FEEDBACK_TYPES, POST_CATEGORIES, RULES, SELF_ASSIGNABLE_ROLES } from "./rules";

const trimmed = (...checks) => z.string().check(z.trim(), ...checks);

const requiredText = (max, label) =>
  trimmed(
    z.minLength(1, `${label} zorunludur`),
    z.maxLength(max, `${label} en fazla ${max} karakter olabilir`)
  );

const optionalText = (max, label) => trimmed(z.maxLength(max, `${label} en fazla ${max} karakter olabilir`));

const email = z.pipe(
  z.string().check(z.trim(), z.toLowerCase()),
  z.email("Geçerli bir e-posta adresi giriniz")
);

const password = z.string().check(
  z.minLength(RULES.password.min, `Şifre en az ${RULES.password.min} karakter olmalıdır`),
  z.refine((value) => new TextEncoder().encode(value).length <= RULES.password.maxBytes, "Şifre çok uzun")
);

const requiredSecret = (message) => z.string().check(z.minLength(1, message));

export const loginSchema = z.object({
  email,
  password: requiredSecret("Şifre zorunludur"),
});

export const registerSchema = z.object({
  name: requiredText(RULES.name.max, "Ad"),
  surname: requiredText(RULES.name.max, "Soyad"),
  email,
  password,
  role: z.enum(SELF_ASSIGNABLE_ROLES, { error: "Üyelik türü seçiniz" }),
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
  .check(
    z.refine((values) => values.email === values.originalEmail || values.currentPassword.length > 0, {
      path: ["currentPassword"],
      message: "E-posta değişikliği için mevcut şifre gerekli",
    })
  );

export const changePasswordSchema = z.object({
  currentPassword: requiredSecret("Mevcut şifre zorunludur"),
  newPassword: password,
});

export const deleteAccountSchema = z.object({
  password: requiredSecret("Şifre zorunludur"),
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
  type: z.enum(FEEDBACK_TYPES, { error: "Tür seçiniz" }),
  message: requiredText(RULES.feedback.max, "Mesaj"),
});

export { POST_CATEGORY_OPTIONS, ROLE_LABELS } from "./labels";

export { RULES };
