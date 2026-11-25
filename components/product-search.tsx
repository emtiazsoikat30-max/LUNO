"use client";

import { useLanguage } from "@/components/language-provider";

export function ProductSearch() {
  const { t } = useLanguage();
  return <form action="/products" className="mt-4 flex w-full border border-[#0b1830]/20 bg-white sm:mt-0 sm:w-64" role="search">
    <label className="sr-only" htmlFor="product-search">{t("search.label")}</label>
    <input id="product-search" name="q" type="search" placeholder={t("search.placeholder")} className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-[#68758a]" />
    <button type="submit" className="bg-[#09172e] px-3 text-xs font-bold tracking-[.08em] text-white" aria-label={t("search.label")}>{t("search.button")}</button>
  </form>;
}
