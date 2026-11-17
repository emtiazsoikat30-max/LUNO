import { NextResponse, type NextRequest } from "next/server";

const OLD_HOST = "luno-ashen.vercel.app";
const CANONICAL_ORIGIN = "https://talbetal.vercel.app";

export function proxy(request: NextRequest) {
  if (request.nextUrl.hostname.toLowerCase() !== OLD_HOST) return NextResponse.next();
  const destination = new URL(`${request.nextUrl.pathname}${request.nextUrl.search}`, CANONICAL_ORIGIN);
  return NextResponse.redirect(destination, 301);
}

export const config = { matcher: "/:path*" };
