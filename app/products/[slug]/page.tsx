import { notFound } from "next/navigation";
import { LunoShell } from "@/components/luno-shell";
import { formatBdt, sellingPriceBdt } from "@/lib/catalog";
import { getCatalogProductBySlug, listCatalogProducts } from "@/lib/store-db";
import { BuyNowForm } from "@/components/buy-now-form";
import { ProductCard } from "@/components/product-card";
import Image from "next/image";

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const product = await getCatalogProductBySlug(slug); if (!product) notFound();
  const related = (await listCatalogProducts()).filter((item) => item.category === product.category && item.slug !== product.slug).slice(0, 4);
  const salePrice = sellingPriceBdt(product);
  return <LunoShell eyebrow={product.category.replaceAll("-", " ").toUpperCase()} title={product.name}>
    <div className="mt-8 grid gap-8 sm:mt-10 sm:gap-10 lg:grid-cols-2">
      <div className="border border-[#0b1830]/10 bg-white p-3 sm:p-5"><Image src={product.image} alt={product.name} width={1200} height={1200} sizes="(max-width: 1024px) 100vw, 50vw" className="h-80 w-full object-contain sm:h-[540px]" priority /></div>
      <div className="flex flex-col justify-center"><div><p className="font-sans text-3xl font-bold tabular-nums sm:text-4xl">{formatBdt(salePrice)}</p>{product.discountPriceBdt != null ? <p className="mt-2 text-sm text-[#68758a]"><span className="line-through">{formatBdt(product.priceBdt)}</span><span className="ml-3 font-bold text-emerald-700">Special price</span></p> : null}</div><p className="mt-5 max-w-lg leading-7 text-[#40506b] sm:mt-6 sm:leading-8">{product.description}</p><div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-[#40506b]">{product.sku ? <span>SKU: {product.sku}</span> : null}{product.stockQuantity != null ? <span className={product.stockQuantity > 0 ? "text-emerald-700" : "text-red-700"}>{product.stockQuantity > 0 ? `In stock · ${product.stockQuantity} available` : "Out of stock"}</span> : null}</div><p className="mt-6 text-sm text-[#40506b] sm:mt-7">Cash on Delivery available across Bangladesh.</p><BuyNowForm product={product} /></div>
    </div>
    {(product.fullDescription || product.features?.length) ? <section className="mt-12 grid gap-7 border-t border-[#0b1830]/10 pt-10 lg:grid-cols-[1.1fr_.9fr]"><div><p className="text-xs font-bold tracking-[.16em] text-[#b38b45]">PRODUCT DETAILS</p><h2 className="mt-3 font-serif text-3xl">Made for everyday listening.</h2><p className="mt-5 max-w-2xl leading-8 text-[#40506b]">{product.fullDescription ?? product.description}</p></div>{product.features?.length ? <div className="border border-[#0b1830]/10 bg-white p-6"><p className="text-xs font-bold tracking-[.16em] text-[#b38b45]">KEY FEATURES</p><ul className="mt-5 grid gap-3 text-sm text-[#243554] sm:grid-cols-2">{product.features.map((feature) => <li key={feature} className="flex gap-2"><span className="text-[#b38b45]">✓</span>{feature}</li>)}</ul></div> : null}</section> : null}
    {related.length ? <section className="mt-14 border-t border-[#0b1830]/10 pt-10"><p className="text-xs font-bold tracking-[.16em] text-[#b38b45]">MORE TO EXPLORE</p><h2 className="mt-3 font-serif text-3xl">Related products.</h2><div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{related.map((item) => <ProductCard key={item.slug} product={item} />)}</div></section> : null}
  </LunoShell>;
}
