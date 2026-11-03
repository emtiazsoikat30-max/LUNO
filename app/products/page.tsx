import { LunoShell } from "@/components/luno-shell";
import { ProductCard } from "@/components/product-card";
import { catalog } from "@/lib/catalog";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const term = q.trim().toLowerCase();
  const products = term ? catalog.filter((product) => `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(term)) : catalog;
  return <LunoShell eyebrow="LUNO COLLECTION" title={term ? `Search results for “${q.trim()}”` : "Shop all products."}><p className="mt-5 max-w-2xl leading-7 text-[#40506b]">{term ? `${products.length} product${products.length === 1 ? "" : "s"} found.` : "A curated edit of premium lifestyle essentials, selected for every version of your day."}</p>{products.length ? <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.map(product => <ProductCard key={product.slug} product={product} />)}</div> : <div className="mt-10 border border-[#0b1830]/10 bg-[#fffdf8] p-7"><p className="font-semibold">No products found for “{q.trim()}”.</p><p className="mt-2 text-sm text-[#40506b]">Try searching by product name or category, such as perfume, watch or bag.</p></div>}</LunoShell>;
}
