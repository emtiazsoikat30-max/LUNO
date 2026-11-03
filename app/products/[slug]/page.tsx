import { notFound } from "next/navigation";
import { LunoShell } from "@/components/luno-shell";
import { catalog, formatBdt } from "@/lib/catalog";
import { BuyNowForm } from "@/components/buy-now-form";

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const product = catalog.find(item => item.slug === slug); if (!product) notFound();
  return <LunoShell eyebrow={product.category.replaceAll("-", " ").toUpperCase()} title={product.name}><div className="mt-8 grid gap-8 sm:mt-10 sm:gap-10 lg:grid-cols-2"><img src={product.image} alt={product.name} loading="lazy" decoding="async" className="h-80 w-full object-cover sm:h-[460px]" /><div className="flex flex-col justify-center"><p className="font-sans text-3xl font-bold tabular-nums sm:text-4xl">{formatBdt(product.priceBdt)}</p><p className="mt-5 max-w-lg leading-7 text-[#40506b] sm:mt-6 sm:leading-8">{product.description}</p><p className="mt-6 text-sm text-[#40506b] sm:mt-7">Cash on Delivery available across Bangladesh.</p><BuyNowForm product={product} /></div></div></LunoShell>;
}
