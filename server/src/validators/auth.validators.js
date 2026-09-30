import { SELF_ASSIGNABLE_ROLES } from "../models/User.js";
import { z, email, password, requiredText } from "./common.js";

export const registerSchema = {
  body: z.object({
    name: requiredText(50),
    surname: requiredText(50),
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
