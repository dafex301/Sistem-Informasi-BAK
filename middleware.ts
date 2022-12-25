import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import verifyToken from "./lib/jwt/verifyToken";

export async function middleware(request: NextRequest) {
  let res = NextResponse.next();
  const requestPath = request.nextUrl.pathname;
  const token = request.cookies.get("user")?.value;
  let user;

  if (token) {
    user = await verifyToken(token);
  }

  return res;
}
