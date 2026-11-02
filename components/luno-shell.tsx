import Link from "next/link";
import type { ReactNode } from "react";

export function LunoShell({ title, eyebrow, children }: { title: string; eyebrow: string; children: ReactNode }) {
  return <main className="min-h-screen bg-[#f4f5f7] text-[#0b1830]">
    <div className="bg-[#09172e] px-5 py-2 text-center text-[11px] font-medium tracking-[.16em] text-[#f6ecd6]">LUNO · YOUR LIFESTYLE, OUR PRIORITY</div>
    <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
      <Link href="/" className="text-2xl font-extrabold tracking-[.24em]">LUNO</Link>
      <div className="hidden gap-7 text-sm font-semibold md:flex"><Link href="/products">SHOP</Link><Link href="/categories">CATEGORIES</Link><Link href="/contact">CONTACT</Link></div>
      <div className="flex items-center gap-4 text-sm font-semibold"><Link href="/account">ACCOUNT</Link><Link href="/cart" className="rounded-full border border-[#0b1830]/20 px-4 py-2">BAG (0)</Link></div>
    </nav>
    <section className="mx-auto max-w-7xl px-6 pb-20 pt-10 lg:px-10"><p className="text-xs font-bold tracking-[.18em] text-[#b38b45]">{eyebrow}</p><h1 className="mt-4 font-serif text-5xl tracking-tight md:text-6xl">{title}</h1>{children}</section>
    <footer className="bg-[#09172e] px-6 py-9 text-center text-xs tracking-[.12em] text-[#f6ecd6]">© 2026 LUNO · DHAKA, BANGLADESH</footer>
  </main>;
}

export const categoryNames = ["Perfume", "Electronics & Gadgets", "Men's Fashion", "Women's Fashion", "Sunglasses", "Watches", "Bags", "Shoes", "Accessories", "More"];
