import { jwtVerify } from "jose";

export default async function verifyToken(token: string) {
  const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_KEY);
  const { payload, protectedHeader } = await jwtVerify(token, secret, {
    issuer: "dafex",
    audience: "sistem-informasi-bak",
  });
  return payload;
}
