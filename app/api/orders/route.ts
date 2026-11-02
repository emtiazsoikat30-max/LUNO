import { platformEnv as env } from "@/lib/platform-env";
import { NextResponse } from "next/server";
import { AuthorizationError, requireCustomer } from "@/lib/authorization";

type CartLine = { productId: number; quantity: number };

export async function GET() {
  try {
    const user = await requireCustomer();
    const db = env.DB; if (!db) return NextResponse.json({ error: "Store database is not configured" }, { status: 503 });
    const { results } = await env.DB.prepare(
      "SELECT id, order_number AS orderNumber, order_status AS orderStatus, payment_status AS paymentStatus, subtotal_bdt AS subtotalBdt, created_at AS createdAt FROM orders WHERE customer_auth_user_id = ? ORDER BY id DESC"
    ).bind(user.userId).all();
    return NextResponse.json({ orders: results });
  } catch (error) {
    return NextResponse.json({ error: error instanceof AuthorizationError ? error.message : "Unable to load orders" }, { status: error instanceof AuthorizationError ? 401 : 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireCustomer();
    const db = env.DB; if (!db) return NextResponse.json({ error: "Store database is not configured" }, { status: 503 });
    const body = await request.json() as { name?: string; phone?: string; address?: string; paymentMethod?: "cod" | "online"; items?: CartLine[] };
    const name = body.name?.trim(); const phone = body.phone?.trim(); const address = body.address?.trim();
    const items = Array.isArray(body.items) ? body.items : [];
    if (!name || !phone || !address || !["cod", "online"].includes(body.paymentMethod ?? "") || items.length === 0 || items.length > 30) {
      return NextResponse.json({ error: "Please provide valid delivery and cart details" }, { status: 400 });
    }
    const ids = [...new Set(items.map((item) => Number(item.productId)).filter(Number.isInteger))];
    if (ids.length !== items.length || items.some((item) => !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 10)) {
      return NextResponse.json({ error: "Invalid cart items" }, { status: 400 });
    }
    const placeholders = ids.map(() => "?").join(",");
    const { results } = await db.prepare(`SELECT id, name, price_bdt AS priceBdt, stock FROM products WHERE is_active = 1 AND id IN (${placeholders})`).bind(...ids).all<{ id: number; name: string; priceBdt: number; stock: number }>();
    if (results.length !== ids.length) return NextResponse.json({ error: "One or more products are unavailable" }, { status: 409 });
    const selected = new Map(results.map((product) => [product.id, product]));
    const lines = items.map((item) => ({ ...item, product: selected.get(item.productId)! }));
    if (lines.some((line) => line.quantity > line.product.stock)) return NextResponse.json({ error: "Insufficient stock for one or more products" }, { status: 409 });
    const subtotal = lines.reduce((total, line) => total + line.product.priceBdt * line.quantity, 0);
    const now = new Date().toISOString();
    const orderNumber = `LUNO-${Date.now().toString(36).toUpperCase()}-${crypto.getRandomValues(new Uint16Array(1))[0].toString(36).toUpperCase()}`;
    await db.prepare("INSERT INTO customers (auth_user_id, email, full_name, created_at, updated_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(auth_user_id) DO UPDATE SET email=excluded.email, full_name=excluded.full_name, updated_at=excluded.updated_at")
      .bind(user.userId, user.email, user.fullName, now, now).run();
    await db.prepare("INSERT INTO orders (order_number, customer_auth_user_id, customer_name, customer_email, phone, shipping_address, payment_method, subtotal_bdt, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(orderNumber, user.userId, name, user.email, phone, address, body.paymentMethod, subtotal, now, now).run();
    const order = await db.prepare("SELECT id FROM orders WHERE order_number = ? AND customer_auth_user_id = ?").bind(orderNumber, user.userId).first<{ id: number }>();
    if (!order) throw new Error("Order was not created");
    await db.batch(lines.flatMap((line) => [
      db.prepare("INSERT INTO order_items (order_id, product_id, product_name, unit_price_bdt, quantity) VALUES (?, ?, ?, ?, ?)").bind(order.id, line.product.id, line.product.name, line.product.priceBdt, line.quantity),
      db.prepare("UPDATE products SET stock = stock - ?, updated_at = ? WHERE id = ? AND stock >= ?").bind(line.quantity, now, line.product.id, line.quantity),
    ]));
    return NextResponse.json({ orderNumber, subtotalBdt: subtotal, paymentStatus: "pending" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof AuthorizationError ? error.message : "Unable to place order" }, { status: error instanceof AuthorizationError ? 401 : 500 });
  }
}
