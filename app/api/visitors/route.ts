import { NextResponse } from "next/server";
import { recordVisitor } from "@/lib/store-db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { visitorId?: unknown };
    if (typeof body.visitorId !== "string") return NextResponse.json({ error: "Invalid visitor" }, { status: 400 });
    await recordVisitor(body.visitorId);
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Unable to record visitor" }, { status: 500 });
  }
}
