import { SELF_ASSIGNABLE_ROLES, RULES } from "./rules.js";
import { z, email, password, requiredText } from "./common.js";

export const registerSchema = {
  body: z.object({
    name: requiredText(RULES.name.max),
    surname: requiredText(RULES.name.max),
    email,
    password,
    role: z.enum(SELF_ASSIGNABLE_ROLES).default("satici"),
  }),
};

export const loginSchema = {
  body: z.object({
    email,
    password: z.string().min(1, "Şifre zorunludur"),
  }),
};
