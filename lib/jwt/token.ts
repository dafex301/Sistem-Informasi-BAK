import { jwtVerify, SignJWT } from "jose";
import { destroyCookie, setCookie } from "nookies";

export async function verifyToken(token: string) {
  const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_KEY);
  const verifyResult = await jwtVerify(token, secret, {
    issuer: "dafex",
    audience: "sistem-informasi-bak",
  }).catch((err) => {
    destroyCookie(null, "user");
    destroyCookie(null, "idToken");
    return null;
  });

  if (verifyResult) {
    const payload = verifyResult.payload;
    return payload;
  }

  return null;
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
