import { z } from "zod";
import { RULES } from "./rules.js";

z.config(z.locales.tr());

export { z };

export const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Geçersiz kimlik");

export const idParams = z.object({ id: objectId });

export const email = z.string().trim().toLowerCase().pipe(z.email("Geçerli bir e-posta adresi giriniz"));

export const password = z
  .string()
  .min(RULES.password.min, `Şifre en az ${RULES.password.min} karakter olmalıdır`)
  .refine((value) => Buffer.byteLength(value, "utf8") <= RULES.password.maxBytes, "Şifre çok uzun");

export const requiredText = (max, min = 1) => z.string().trim().min(min).max(max);

export const optionalText = (max) => z.string().trim().max(max).optional();

export const paginationQuery = z.object({
  cursor: z.string().max(200).optional(),
  limit: z.coerce.number().int().min(1).max(RULES.pageSize.max).default(RULES.pageSize.default),
});

export const paginatedResponse = (item) =>
  z.object({ items: z.array(item), nextCursor: z.string().nullable() });

export const messageResponse = z.object({ message: z.string() });
