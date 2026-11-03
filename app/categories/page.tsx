import Link from "next/link";
import { LunoShell, categoryCards } from "@/components/luno-shell";

export default function CategoriesPage() {
  return <LunoShell eyebrow="DISCOVER LUNO" title="Shop by category."><div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">{categoryCards.map((category) => <Link key={category.slug} href={`/categories/${category.slug}`} className="group relative min-h-52 overflow-hidden bg-[#09172e]"><img src={category.image} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-500 group-hover:scale-110 group-hover:opacity-95"/><span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#09172e] via-[#09172e]/65 to-transparent px-3 pb-4 pt-12 text-center text-sm font-bold text-[#f6ecd6]">{category.name}</span></Link>)}</div></LunoShell>;
}
