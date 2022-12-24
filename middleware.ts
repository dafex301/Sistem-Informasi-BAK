import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import verifyToken from "./lib/jwt/verifyToken";

export async function middleware(request: NextRequest) {
  let res = NextResponse.next();
  const token = request.cookies.get("user")?.value;

  if (token) {
    const user = await verifyToken(token);
    console.log(user);
  }

  if (request.nextUrl.pathname.startsWith("/about")) {
    return NextResponse.redirect(new URL("/about-2", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/dashboard/user", request.url));
  }
}
