import request from "supertest";
import { createApp } from "../src/app.js";
import User from "../src/models/User.js";

export const ORIGIN = "http://localhost:3000";
export const PASSWORD = "gizli-sifre-123";

export const app = createApp();

export const api = () => request(app);

export const extractRefreshCookie = (response) =>
  (response.headers["set-cookie"] ?? []).find((cookie) => cookie.startsWith("milk_rt="))?.split(";")[0];

export const registerUser = async (overrides = {}) => {
  const body = {
    name: "Ayşe",
    surname: "Yılmaz",
    email: `kullanici-${Math.random().toString(36).slice(2)}@ornek.com`,
    password: PASSWORD,
    role: "satici",
    ...overrides,
  };

  const response = await api().post("/api/auth/register").send(body);
  return { ...response.body.user, password: body.password };
};

export const login = async (email, password = PASSWORD) => {
  const response = await api().post("/api/auth/login").send({ email, password });

  return {
    response,
    accessToken: response.body.accessToken,
    cookie: extractRefreshCookie(response),
  };
};

export const createSession = async (overrides = {}) => {
  const user = await registerUser(overrides);
  const session = await login(user.email, user.password);

  return {
    user,
    ...session,
    auth: { Authorization: `Bearer ${session.accessToken}` },
  };
};

export const createAdminSession = async () => {
  const session = await createSession();
  await User.updateOne({ _id: session.user._id }, { role: "admin" });
  return session;
};

export const PNG_BYTES = Buffer.from(
  "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d4944415478da63f8cfc0f01f0005000201a5e5e3cb0000000049454e44ae426082",
  "hex"
);
