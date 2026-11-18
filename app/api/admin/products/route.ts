import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { listCatalogProducts, saveCatalogProduct } from "@/lib/store-db";

const categories = new Set(["perfume", "electronics-and-gadgets", "mens-fashion", "womens-fashion", "sunglasses", "watches", "bags", "shoes", "accessories", "more"]);
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminSession())) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  return NextResponse.json({ products: await listCatalogProducts(true) }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (!(await isAdminSession())) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  try {
    const data = await request.json() as Record<string, unknown>;
    const name = typeof data.name === "string" ? data.name.trim() : ""; const slug = typeof data.slug === "string" ? data.slug.trim() : ""; const category = typeof data.category === "string" ? data.category : ""; const image = typeof data.image === "string" ? data.image.trim() : ""; const description = typeof data.description === "string" ? data.description.trim() : ""; const fullDescription = typeof data.fullDescription === "string" ? data.fullDescription.trim() : ""; const priceBdt = data.priceBdt; const discountPriceBdt = data.discountPriceBdt; const stockQuantity = data.stockQuantity; const features = Array.isArray(data.features) ? data.features.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean) : []; const sku = typeof data.sku === "string" ? data.sku.trim() : ""; const active = typeof data.active === "boolean" ? data.active : true;
    const validNumber = (value: unknown) => typeof value === "number" && Number.isInteger(value) && value >= 0;
    if (!name || name.length > 160 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !categories.has(category) || !image || image.length > 4_000_000 || !description || description.length > 500 || fullDescription.length > 5000 || !validNumber(priceBdt) || (discountPriceBdt !== null && discountPriceBdt !== undefined && (!validNumber(discountPriceBdt) || discountPriceBdt > priceBdt)) || !validNumber(stockQuantity) || stockQuantity > 1_000_000 || sku.length > 100) return NextResponse.json({ error: "Please enter valid product details. Discount price cannot exceed regular price." }, { status: 400 });
    const product = await saveCatalogProduct({ slug, name, category, priceBdt, discountPriceBdt: discountPriceBdt == null ? null : discountPriceBdt, image, description, fullDescription: fullDescription || undefined, features, stockQuantity, sku: sku || undefined, active });
    return NextResponse.json({ product }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to save product" }, { status: 500 });
  }
}
