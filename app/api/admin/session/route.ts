import { NextResponse } from "next/server";
import { adminCookie, createAdminSession, verifyAdminPassword } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { password?: string };
    if (!body.password || !verifyAdminPassword(body.password)) return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    const session = createAdminSession();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(adminCookie.name, session.value, { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: session.maxAge });
    return response;
  } catch { return NextResponse.json({ error: "Admin access is not configured" }, { status: 503 }); }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookie.name, "", { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 0 });
  return response;
}
