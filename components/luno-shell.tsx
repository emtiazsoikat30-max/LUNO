import Link from "next/link";
import type { ReactNode } from "react";
import { ProductSearch } from "@/components/product-search";
import { TalbetalLogo } from "@/components/talbetal-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { T } from "@/components/localized-text";

export function LunoShell({ title, eyebrow, children }: { title: ReactNode; eyebrow: ReactNode; children: ReactNode }) {
  return <main className="min-h-screen bg-[#f4f5f7] text-[#0b1830]">
    <div className="bg-[#09172e] px-5 py-2 text-center text-[11px] font-medium tracking-[.16em] text-[#f6ecd6]">TALBETAL · TRENDS & GADGETS</div>
    <nav className="mx-auto max-w-7xl px-6 py-5 lg:px-10">
      <div className="flex items-center justify-between">
      <TalbetalLogo />
      <div className="hidden gap-7 text-sm font-semibold md:flex"><Link href="/products"><T id="nav.shop" /></Link><Link href="/categories"><T id="nav.categories" /></Link><Link href="/about"><T id="nav.about" /></Link><Link href="/contact"><T id="nav.contact" /></Link></div>
      <div className="flex items-center gap-2 text-sm font-semibold sm:gap-4"><LanguageSwitcher /><Link href="/account" className="hidden sm:inline"><T id="nav.account" /></Link><Link href="/cart" className="rounded-full border border-[#0b1830]/20 px-3 py-2 sm:px-4"><T id="nav.bag" /></Link></div>
      </div>
      <div className="flex justify-end"><ProductSearch /></div>
      <div className="mt-5 grid grid-cols-4 border-y border-[#0b1830]/10 py-3 text-center text-[10px] font-bold tracking-[.08em] md:hidden"><Link href="/products"><T id="nav.shop" /></Link><Link href="/categories"><T id="nav.categories" /></Link><Link href="/about"><T id="nav.about" /></Link><Link href="/contact"><T id="nav.contact" /></Link></div>
    </nav>
    <section className="mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-10 lg:px-10"><p className="text-[10px] font-bold tracking-[.16em] text-[#b38b45] sm:text-xs sm:tracking-[.18em]">{eyebrow}</p><h1 className="mt-3 text-balance font-serif text-3xl leading-tight tracking-tight sm:mt-4 sm:text-5xl md:text-6xl">{title}</h1>{children}</section>
    <footer className="bg-[#09172e] px-6 py-9 text-center text-xs tracking-[.12em] text-[#f6ecd6]"><T id="footer" /></footer>
  </main>;
}

export const categoryCards = [
  { name: "Perfume", slug: "perfume", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80" },
  { name: "Electronics & Gadgets", slug: "electronics-and-gadgets", image: "/electronics-gadgets-category.png" },
  { name: "Men's Fashion", slug: "mens-fashion", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=80" },
  { name: "Women's Fashion", slug: "womens-fashion", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80" },
  { name: "Sunglasses", slug: "sunglasses", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80" },
  { name: "Watches", slug: "watches", image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=80" },
  { name: "Bags", slug: "bags", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80" },
  { name: "Shoes", slug: "shoes", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80" },
  { name: "Accessories", slug: "accessories", image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=900&q=80" },
  { name: "More", slug: "more", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80" },
] as const;

export const categoryNames = categoryCards.map((category) => category.name);
