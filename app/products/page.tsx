import Link from "next/link";
import { LunoShell, categoryNames } from "@/components/luno-shell";

export default function ProductsPage() {
  return <LunoShell eyebrow="LUNO COLLECTION" title="Shop all products."><p className="mt-5 max-w-2xl leading-7 text-[#40506b]">Our full collection is being curated. Explore a category to discover premium lifestyle essentials.</p><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{categoryNames.map((name) => <Link key={name} href={`/categories/${name.toLowerCase().replaceAll(" ", "-").replaceAll("&", "and").replaceAll("'", "")}`} className="border border-[#0b1830]/10 bg-[#fffdf8] p-7 text-lg font-semibold transition hover:border-[#b38b45] hover:bg-[#f1e5cc]">{name}<span className="mt-6 block text-xs tracking-[.12em] text-[#b38b45]">EXPLORE →</span></Link>)}</div></LunoShell>;
}
