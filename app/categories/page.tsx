import Link from "next/link";
import { LunoShell, categoryNames } from "@/components/luno-shell";

export default function CategoriesPage() {
  return <LunoShell eyebrow="DISCOVER LUNO" title="Shop by category."><div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">{categoryNames.map((name) => <Link key={name} href={`/categories/${name.toLowerCase().replaceAll(" ", "-").replaceAll("&", "and").replaceAll("'", "")}`} className="bg-[#09172e] p-6 text-center text-sm font-semibold text-[#f6ecd6] transition hover:bg-[#b38b45]">{name}</Link>)}</div></LunoShell>;
}
