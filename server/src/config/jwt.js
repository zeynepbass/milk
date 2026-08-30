import { SignJWT, jwtVerify } from "jose";

const getSecret = () => {
  return new TextEncoder().encode(process.env.JWT_SECRET);
};


export const generateToken = async (payload) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(getSecret());
};


export const verifyToken = async (token) => {
  const { payload } = await jwtVerify(token, getSecret());
  return payload;
};