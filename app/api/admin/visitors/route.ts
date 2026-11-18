import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { getVisitorAnalytics } from "@/lib/store-db";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminSession())) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  try {
    return NextResponse.json(await getVisitorAnalytics(), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Unable to load visitor analytics" }, { status: 500 });
  }
}
