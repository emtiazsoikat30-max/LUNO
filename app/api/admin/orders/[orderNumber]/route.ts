import { platformEnv as env } from "@/lib/platform-env";
import { NextResponse } from "next/server";
import { AuthorizationError, requireAdmin } from "@/lib/authorization";

const statuses = new Set(["placed", "processing", "shipped", "delivered", "cancelled"]);

export async function PATCH(request: Request, { params }: { params: Promise<{ orderNumber: string }> }) {
  try {
    await requireAdmin();
    if (!env.DB) return NextResponse.json({ error: "Store database is not configured" }, { status: 503 });
    const { orderNumber } = await params;
    const { orderStatus } = await request.json() as { orderStatus?: string };
    if (!orderStatus || !statuses.has(orderStatus)) return NextResponse.json({ error: "Invalid order status" }, { status: 400 });
    const result = await env.DB.prepare("UPDATE orders SET order_status = ?, updated_at = ? WHERE order_number = ?").bind(orderStatus, new Date().toISOString(), orderNumber).run();
    if (!result.meta.changes) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json({ ok: true, orderStatus });
  } catch (error) {
    return NextResponse.json({ error: error instanceof AuthorizationError ? error.message : "Unable to update order" }, { status: error instanceof AuthorizationError ? 403 : 500 });
  }
}
