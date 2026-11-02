import Link from "next/link";
import { notFound } from "next/navigation";
import { LunoShell } from "@/components/luno-shell";
import { catalog, formatBdt } from "@/lib/catalog";

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const product = catalog.find(item => item.slug === slug); if (!product) notFound();
  return <LunoShell eyebrow={product.category.replaceAll("-", " ").toUpperCase()} title={product.name}><div className="mt-10 grid gap-10 lg:grid-cols-2"><img src={product.image} alt={product.name} className="h-[460px] w-full object-cover" /><div className="flex flex-col justify-center"><p className="font-serif text-4xl">{formatBdt(product.priceBdt)}</p><p className="mt-6 max-w-lg leading-8 text-[#40506b]">{product.description}</p><p className="mt-7 text-sm text-[#40506b]">Cash on Delivery available across Bangladesh.</p><Link href="/cart" className="mt-8 inline-block w-fit bg-[#09172e] px-7 py-4 text-xs font-bold tracking-[.13em] text-white">ADD TO BAG →</Link></div></div></LunoShell>;
}
