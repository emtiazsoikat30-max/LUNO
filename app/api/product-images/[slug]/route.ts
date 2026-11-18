import { NextResponse } from "next/server";
import { getCatalogProductImage } from "@/lib/store-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const image = await getCatalogProductImage(slug);
  if (!image) return new NextResponse("Not found", { status: 404 });
  const match = image.match(/^data:(image\/(?:png|jpe?g|webp));base64,([\s\S]+)$/i);
  if (!match) return NextResponse.redirect(new URL(image, "https://talbetal.vercel.app"), 307);
  return new NextResponse(Buffer.from(match[2], "base64"), { headers: { "Content-Type": match[1], "Cache-Control": "public, max-age=31536000, immutable" } });
}
