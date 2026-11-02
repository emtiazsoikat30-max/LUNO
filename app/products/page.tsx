import { LunoShell } from "@/components/luno-shell";
import { ProductCard } from "@/components/product-card";
import { catalog } from "@/lib/catalog";

export default function ProductsPage() {
  return <LunoShell eyebrow="LUNO COLLECTION" title="Shop all products."><p className="mt-5 max-w-2xl leading-7 text-[#40506b]">A curated edit of premium lifestyle essentials, selected for every version of your day.</p><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{catalog.map(product => <ProductCard key={product.slug} product={product} />)}</div></LunoShell>;
}
