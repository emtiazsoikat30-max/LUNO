import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
import { AuthorizationError, requireAdmin } from "@/lib/authorization";

export async function GET() {
  try {
    await requireAdmin();
    if (!env.DB) return NextResponse.json({ error: "Store database is not configured" }, { status: 503 });
    const { results } = await env.DB.prepare("SELECT order_number AS orderNumber, customer_name AS customerName, customer_email AS customerEmail, phone, shipping_address AS shippingAddress, payment_method AS paymentMethod, payment_status AS paymentStatus, order_status AS orderStatus, subtotal_bdt AS subtotalBdt, created_at AS createdAt FROM orders ORDER BY id DESC").all();
    return NextResponse.json({ orders: results });
  } catch (error) {
    return NextResponse.json({ error: error instanceof AuthorizationError ? error.message : "Unable to load orders" }, { status: error instanceof AuthorizationError ? 403 : 500 });
  }
}
