import { jwtVerify, SignJWT } from "jose";
import { setCookie } from "nookies";

export async function verifyToken(token: string) {
  const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_KEY);
  const { payload, protectedHeader } = await jwtVerify(token, secret, {
    issuer: "dafex",
    audience: "sistem-informasi-bak",
  });
  return payload;
}

export async function createToken(payload: any) {
  const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_KEY);
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("dafex")
    .setAudience("sistem-informasi-bak")
    .setExpirationTime("24h")
    .sign(secret);
  return token;
}
