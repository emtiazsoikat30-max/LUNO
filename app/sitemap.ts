import type { MetadataRoute } from "next";
import { catalog } from "@/lib/catalog";
import { categoryCards } from "@/components/luno-shell";

const baseUrl = "https://talbetal.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/about", "/contact", "/products", "/categories"];
  return [
    ...staticPages.map((path) => ({ url: `${baseUrl}${path}`, lastModified: new Date() })),
    ...categoryCards.map((category) => ({ url: `${baseUrl}/categories/${category.slug}`, lastModified: new Date() })),
    ...catalog.map((product) => ({ url: `${baseUrl}/products/${product.slug}`, lastModified: new Date() })),
  ];
}
