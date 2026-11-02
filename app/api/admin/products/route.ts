import { platformEnv as env } from "@/lib/platform-env";
import { NextResponse } from "next/server";
import { AuthorizationError, requireAdmin } from "@/lib/authorization";

export async function GET() {
  try {
    await requireAdmin();
    if (!env.DB) return NextResponse.json({ error: "Store database is not configured" }, { status: 503 });
    const { results } = await env.DB.prepare("SELECT id, name, slug, price_bdt AS priceBdt, stock, is_active AS isActive FROM products ORDER BY id DESC").all();
    return NextResponse.json({ products: results });
  } catch (error) {
    return NextResponse.json({ error: error instanceof AuthorizationError ? error.message : "Unable to load products" }, { status: error instanceof AuthorizationError ? 403 : 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    if (!env.DB) return NextResponse.json({ error: "Store database is not configured" }, { status: 503 });
    const data = await request.json() as { name?: string; slug?: string; description?: string; priceBdt?: number; stock?: number; categoryId?: number; imageUrl?: string };
    if (!data.name?.trim() || !/^[a-z0-9-]+$/.test(data.slug ?? "") || !Number.isInteger(data.priceBdt) || data.priceBdt < 0 || !Number.isInteger(data.stock) || data.stock < 0) {
      return NextResponse.json({ error: "Invalid product data" }, { status: 400 });
    }
    const now = new Date().toISOString();
    const result = await env.DB.prepare("INSERT INTO products (category_id, slug, name, description, price_bdt, stock, image_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(data.categoryId ?? null, data.slug, data.name.trim(), data.description?.trim() ?? "", data.priceBdt, data.stock, data.imageUrl?.trim() ?? null, now, now).run();
    return NextResponse.json({ id: result.meta.last_row_id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof AuthorizationError ? error.message : "Unable to add product" }, { status: error instanceof AuthorizationError ? 403 : 500 });
  }
}
