import { platformEnv as env } from "@/lib/platform-env";
import { NextResponse } from "next/server";
import { AuthorizationError, requireAdmin } from "@/lib/authorization";

export async function GET() {
  try {
    await requireAdmin();
    const db = env.DB; if (!db) return NextResponse.json({ error: "Store database is not configured" }, { status: 503 });
    const summary = await db.prepare("SELECT COUNT(*) AS totalOrders, COALESCE(SUM(subtotal_bdt),0) AS totalSales, SUM(CASE WHEN order_status='placed' THEN 1 ELSE 0 END) AS pendingOrders FROM orders").first();
    const stock = await db.prepare("SELECT COUNT(*) AS lowStockProducts FROM products WHERE stock <= 5").first();
    return NextResponse.json({ ...(summary ?? {}), ...(stock ?? {}) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof AuthorizationError ? error.message : "Unable to load dashboard" }, { status: error instanceof AuthorizationError ? 403 : 500 });
  }
}
