import Link from "next/link";
import { LunoShell } from "@/components/luno-shell";

export default async function CategoryDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const title = slug.split("-").map(word => word[0]?.toUpperCase() + word.slice(1)).join(" ");
  return <LunoShell eyebrow="CATEGORY" title={title}><p className="mt-5 max-w-xl leading-7 text-[#40506b]">New pieces are being added to this LUNO collection. Check back soon, or browse every category.</p><Link href="/products" className="mt-8 inline-block bg-[#09172e] px-6 py-4 text-xs font-bold tracking-[.13em] text-white">VIEW ALL PRODUCTS →</Link></LunoShell>;
}
