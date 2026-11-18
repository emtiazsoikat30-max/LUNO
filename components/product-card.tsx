import Link from "next/link";
import Image from "next/image";
import { CatalogProduct, formatBdt, sellingPriceBdt } from "@/lib/catalog";

export function ProductCard({ product }: { product: CatalogProduct }) {
  const salePrice = sellingPriceBdt(product);
  return <Link href={`/products/${product.slug}`} prefetch className="group overflow-hidden border border-[#0b1830]/10 bg-[#fffdf8]">
    <Image src={product.image} alt={product.name} width={900} height={720} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="h-72 w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
    <div className="p-5"><p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#b38b45]">{product.category.replaceAll("-", " ")}</p><h2 className="mt-2 text-lg font-bold">{product.name}</h2><p className="mt-2 text-sm font-semibold">{formatBdt(salePrice)}{product.discountPriceBdt != null ? <><span className="ml-2 text-xs font-normal text-[#68758a] line-through">{formatBdt(product.priceBdt)}</span><span className="ml-2 text-[10px] font-bold text-emerald-700">SALE</span></> : null}</p><span className="mt-5 block bg-[#09172e] px-4 py-3 text-center text-xs font-bold tracking-[.12em] text-white">BUY NOW →</span></div>
  </Link>;
}
