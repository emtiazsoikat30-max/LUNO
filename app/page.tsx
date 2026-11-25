import Link from "next/link";
import { categoryCards } from "@/components/luno-shell";
import { TalbetalLogo } from "@/components/talbetal-logo";
import { ProductSearch } from "@/components/product-search";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LocalizedCategory, T } from "@/components/localized-text";

export default function Home() {
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
    <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-12 pt-8 sm:gap-10 sm:px-6 sm:pb-16 sm:pt-10 lg:grid-cols-[1.1fr_.9fr] lg:px-10 lg:pt-20">
      <div className="flex flex-col justify-center"><p className="text-[10px] font-bold tracking-[.16em] text-[#b38b45] sm:text-xs sm:tracking-[.2em]"><T id="home.eyebrow" /></p><h1 className="mt-4 max-w-3xl text-balance font-serif text-4xl leading-[1.02] tracking-tight sm:mt-5 sm:text-5xl md:text-7xl"><T id="home.title" /></h1><p className="mt-5 max-w-xl text-sm leading-7 text-[#40506b] sm:mt-7 sm:text-base sm:leading-8"><T id="home.description" /></p><div className="mt-7 flex flex-wrap gap-3 sm:mt-9"><Link href="/products" className="bg-[#09172e] px-5 py-3 text-[10px] font-bold tracking-[.11em] text-white sm:px-6 sm:py-4 sm:text-xs sm:tracking-[.13em]"><T id="home.shopAll" /></Link><Link href="/categories" className="border border-[#0b1830]/30 px-5 py-3 text-[10px] font-bold tracking-[.11em] sm:px-6 sm:py-4 sm:text-xs sm:tracking-[.13em]"><T id="home.explore" /></Link></div></div>
      <div className="relative overflow-hidden rounded-sm bg-[#e8edf0] shadow-xl"><img src="/talbetal-logo.jpeg" alt="TALBETAL logo" fetchPriority="high" decoding="async" className="h-full min-h-[280px] w-full object-contain sm:min-h-[380px]"/><div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#09172e]/80 p-5 text-sm text-white sm:p-6"><T id="home.imageCaption" /></div></div>
    </section>
    <section className="border-y border-[#0b1830]/10 bg-[#fffdf8] py-14"><div className="mx-auto max-w-7xl px-6 lg:px-10"><p className="text-center text-xs font-bold tracking-[.18em] text-[#b38b45]"><T id="home.shopByCategory" /></p><div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{categoryCards.map((category)=><Link key={category.slug} href={`/categories/${category.slug}`} className="group relative min-h-40 overflow-hidden border border-[#0b1830]/10 bg-[#09172e] shadow-sm"><img src={category.image} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-500 group-hover:scale-110 group-hover:opacity-95"/><span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#09172e] via-[#09172e]/65 to-transparent px-4 pb-4 pt-12 text-center text-sm font-bold text-[#fffdf8]"><LocalizedCategory slug={category.slug} /></span></Link>)}</div></div></section>
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10"><div className="flex items-end justify-between"><div><p className="text-xs font-bold tracking-[.18em] text-[#b38b45]"><T id="home.foundation" /></p><h2 className="mt-3 font-serif text-4xl"><T id="home.foundationTitle" /></h2></div><Link className="hidden text-xs font-bold tracking-[.12em] md:block" href="/products"><T id="common.viewAll" /></Link></div><div className="mt-9 grid gap-5 md:grid-cols-3"><article className="border border-[#0b1830]/10 bg-white p-7"><b className="text-[#b38b45]">01</b><h3 className="mt-5 text-lg font-bold"><T id="home.protected" /></h3><p className="mt-2 text-sm leading-6 text-[#40506b]"><T id="home.protectedText" /></p></article><article className="border border-[#0b1830]/10 bg-white p-7"><b className="text-[#b38b45]">02</b><h3 className="mt-5 text-lg font-bold"><T id="home.serverOrders" /></h3><p className="mt-2 text-sm leading-6 text-[#40506b]"><T id="home.serverOrdersText" /></p></article><article className="border border-[#0b1830]/10 bg-white p-7"><b className="text-[#b38b45]">03</b><h3 className="mt-5 text-lg font-bold"><T id="home.admin" /></h3><p className="mt-2 text-sm leading-6 text-[#40506b]"><T id="home.adminText" /></p></article></div></section>
    <footer className="bg-[#09172e] px-6 py-9 text-center text-xs tracking-[.12em] text-[#f6ecd6]"><T id="footer" /></footer>
  </main>;
}
