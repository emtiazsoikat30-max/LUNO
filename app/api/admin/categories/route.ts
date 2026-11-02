import { platformEnv as env } from "@/lib/platform-env";
import { NextResponse } from "next/server";
import { AuthorizationError, requireAdmin } from "@/lib/authorization";

export async function GET() {
  try { await requireAdmin(); if (!env.DB) return NextResponse.json({ error: "Store database is not configured" }, { status: 503 }); const { results } = await env.DB.prepare("SELECT id, slug, name, image_url AS imageUrl FROM categories ORDER BY name").all(); return NextResponse.json({ categories: results }); }
  catch (error) { return NextResponse.json({ error: error instanceof AuthorizationError ? error.message : "Unable to load categories" }, { status: error instanceof AuthorizationError ? 403 : 500 }); }
}

export async function POST(request: Request) {
  try { await requireAdmin(); if (!env.DB) return NextResponse.json({ error: "Store database is not configured" }, { status: 503 }); const { name, slug, imageUrl } = await request.json() as { name?: string; slug?: string; imageUrl?: string }; if (!name?.trim() || !/^[a-z0-9-]+$/.test(slug ?? "")) return NextResponse.json({ error: "Invalid category" }, { status: 400 }); const result = await env.DB.prepare("INSERT INTO categories (name, slug, image_url, created_at) VALUES (?, ?, ?, ?)").bind(name.trim(), slug, imageUrl?.trim() ?? null, new Date().toISOString()).run(); return NextResponse.json({ id: result.meta.last_row_id }, { status: 201 }); }
  catch (error) { return NextResponse.json({ error: error instanceof AuthorizationError ? error.message : "Unable to add category" }, { status: error instanceof AuthorizationError ? 403 : 500 }); }
}
