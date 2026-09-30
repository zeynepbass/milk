import { SignJWT, jwtVerify } from "jose";
import { env } from "./env.js";

const secret = new TextEncoder().encode(env.jwtSecret);

export const generateAccessToken = (userId) =>
  new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId.toString())
    .setIssuedAt()
    .setExpirationTime(`${env.accessTokenTtlSeconds}s`)
    .sign(secret);

export const verifyAccessToken = async (token) => {
  const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
  return payload;
};
