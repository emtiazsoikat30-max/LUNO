import Link from "next/link";
import { CatalogProduct, formatBdt } from "@/lib/catalog";

export function ProductCard({ product }: { product: CatalogProduct }) {
  return <Link href={`/products/${product.slug}`} className="group overflow-hidden border border-[#0b1830]/10 bg-[#fffdf8]">
    <img src={product.image} alt={product.name} className="h-72 w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
    <div className="p-5"><p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#b38b45]">{product.category.replaceAll("-", " ")}</p><h2 className="mt-2 text-lg font-bold">{product.name}</h2><p className="mt-2 text-sm font-semibold">{formatBdt(product.priceBdt)}</p><span className="mt-5 block bg-[#09172e] px-4 py-3 text-center text-xs font-bold tracking-[.12em] text-white">BUY NOW →</span></div>
  </Link>;
}
