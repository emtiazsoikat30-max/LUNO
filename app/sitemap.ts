import type { MetadataRoute } from "next";
import { categoryCards } from "@/components/luno-shell";
import { listCatalogProducts } from "@/lib/store-db";

const baseUrl = "https://talbetal.vercel.app";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = ["", "/about", "/contact", "/products", "/categories"];
  const products = await listCatalogProducts();

  return [
    ...staticPages.map((path) => ({ url: `${baseUrl}${path}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.8 })),
    ...categoryCards.map((category) => ({ url: `${baseUrl}/categories/${category.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 })),
    ...products.map((product) => ({ url: `${baseUrl}/products/${product.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 })),
  ];
}
