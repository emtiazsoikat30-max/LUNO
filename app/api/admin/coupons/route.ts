import { platformEnv as env } from "@/lib/platform-env";
import { NextResponse } from "next/server";
import { AuthorizationError, requireAdmin } from "@/lib/authorization";

export async function POST(request: Request) {
  try { await requireAdmin(); const db = env.DB; if (!db) return NextResponse.json({ error: "Store database is not configured" }, { status: 503 }); const data = await request.json() as { code?: string; discountType?: "percent" | "fixed"; discountValue?: number; minimumOrderBdt?: number; expiresAt?: string }; const code = data.code?.trim().toUpperCase(); const discountValue = data.discountValue; if (!code || !/^[A-Z0-9-]{3,30}$/.test(code) || !["percent", "fixed"].includes(data.discountType ?? "") || !Number.isInteger(discountValue) || discountValue < 1 || (data.discountType === "percent" && discountValue > 100)) return NextResponse.json({ error: "Invalid coupon" }, { status: 400 }); const result = await db.prepare("INSERT INTO coupons (code, discount_type, discount_value, minimum_order_bdt, expires_at, created_at) VALUES (?, ?, ?, ?, ?, ?)").bind(code, data.discountType, discountValue, data.minimumOrderBdt ?? 0, data.expiresAt ?? null, new Date().toISOString()).run(); return NextResponse.json({ id: result.meta.last_row_id }, { status: 201 }); }
  catch (error) { return NextResponse.json({ error: error instanceof AuthorizationError ? error.message : "Unable to create coupon" }, { status: error instanceof AuthorizationError ? 403 : 500 }); }
}
