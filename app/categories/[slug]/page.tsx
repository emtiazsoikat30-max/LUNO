import Link from "next/link";
import { LunoShell } from "@/components/luno-shell";
import { ProductCard } from "@/components/product-card";
import { BuyNowForm } from "@/components/buy-now-form";
import { catalog, formatBdt } from "@/lib/catalog";

export default async function CategoryDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const title = slug.split("-").map(word => word[0]?.toUpperCase() + word.slice(1)).join(" "); const products = catalog.filter(product => product.category === slug);
  if (products.length === 1) {
    const product = products[0];
    return <LunoShell eyebrow={product.category.replaceAll("-", " ").toUpperCase()} title={product.name}><div className="mt-10 grid gap-10 lg:grid-cols-2"><img src={product.image} alt={product.name} decoding="async" className="h-[460px] w-full object-cover" /><div className="flex flex-col justify-center"><p className="font-sans text-4xl font-bold tabular-nums">{formatBdt(product.priceBdt)}</p><p className="mt-6 max-w-lg leading-8 text-[#40506b]">{product.description}</p><p className="mt-7 text-sm text-[#40506b]">Cash on Delivery available across Bangladesh.</p><BuyNowForm product={product} /></div></div></LunoShell>;
  }
  return <LunoShell eyebrow="CATEGORY" title={title}>{products.length ? <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.map(product => <ProductCard key={product.slug} product={product} />)}</div> : <><p className="mt-5 max-w-xl leading-7 text-[#40506b]">New pieces are being added to this LUNO collection.</p><Link href="/products" className="mt-8 inline-block bg-[#09172e] px-6 py-4 text-xs font-bold tracking-[.13em] text-white">VIEW ALL PRODUCTS →</Link></>}</LunoShell>;
}
