import { platformEnv as env } from "@/lib/platform-env";
import { NextResponse } from "next/server";

export async function GET() {
  const db = env.DB; if (!db) return NextResponse.json({ error: "Store database is not configured" }, { status: 503 });
  const { results } = await db.prepare(
    "SELECT p.id, p.slug, p.name, p.description, p.price_bdt AS priceBdt, p.stock, p.image_url AS imageUrl, c.name AS category FROM products p LEFT JOIN categories c ON c.id = p.category_id WHERE p.is_active = 1 ORDER BY p.created_at DESC"
  ).all();
  return NextResponse.json({ products: results });
}
