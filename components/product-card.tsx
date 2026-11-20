import Link from "next/link";
import Image from "next/image";
import { CatalogProduct, formatBdt, sellingPriceBdt } from "@/lib/catalog";

export function ProductCard({ product }: { product: CatalogProduct }) {
  const salePrice = sellingPriceBdt(product);
  return <Link href={`/products/${product.slug}`} prefetch className="group flex h-full flex-col overflow-hidden border border-[#0b1830]/10 bg-[#fffdf8]">
    <Image src={product.image} alt={product.name} width={900} height={720} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw" className="h-36 w-full object-cover transition duration-500 group-hover:scale-[1.03] sm:h-72" />
    <div className="flex flex-1 flex-col p-3 sm:p-5"><p className="text-[8px] font-bold uppercase tracking-[.1em] text-[#b38b45] sm:text-[10px] sm:tracking-[.15em]">{product.category.replaceAll("-", " ")}</p><h2 className="mt-2 min-h-12 text-sm font-bold leading-5 sm:min-h-[3.75rem] sm:text-lg sm:leading-6">{product.name}</h2><p className="mt-2 text-xs font-semibold sm:text-sm">{formatBdt(salePrice)}{product.discountPriceBdt != null ? <><span className="ml-1 text-[10px] font-normal text-[#68758a] line-through sm:ml-2 sm:text-xs">{formatBdt(product.priceBdt)}</span><span className="ml-1 text-[8px] font-bold text-emerald-700 sm:ml-2 sm:text-[10px]">SALE</span></> : null}</p><span className="mt-auto pt-4"><span className="block bg-[#09172e] px-2 py-3 text-center text-[10px] font-bold tracking-[.08em] text-white sm:px-4 sm:text-xs sm:tracking-[.12em]">BUY NOW →</span></span></div>
  </Link>;
}
