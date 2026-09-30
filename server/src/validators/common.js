import { z } from "zod";

z.config(z.locales.tr());

export { z };

export const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Geçersiz kimlik");

export const idParams = z.object({ id: objectId });

export const email = z.string().trim().toLowerCase().pipe(z.email("Geçerli bir e-posta adresi giriniz"));

export const password = z
  .string()
  .min(8, "Şifre en az 8 karakter olmalıdır")
  .refine((value) => Buffer.byteLength(value, "utf8") <= 72, "Şifre çok uzun");

export const requiredText = (max) => z.string().trim().min(1).max(max);

export const optionalText = (max) => z.string().trim().max(max).optional();

export const limitQuery = z.object({
  limit: z.coerce.number().int().positive().optional(),
});
