"use client";

import { useLanguage } from "@/components/language-provider";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  return <label className="relative inline-flex items-center rounded-full border border-[#0b1830]/20 bg-white px-2 py-1 text-[10px] font-bold tracking-[.04em] text-[#0b1830] shadow-sm">
    <span className="sr-only">Choose language</span>
    <select aria-label="Choose language" value={language} onChange={(event) => setLanguage(event.target.value as "en" | "bn")} className="max-w-[88px] appearance-none bg-transparent pr-3 outline-none">
      <option value="en">🇬🇧 English</option>
      <option value="bn">🇧🇩 বাংলা</option>
    </select>
    <span aria-hidden="true" className="pointer-events-none absolute right-2 text-[8px]">⌄</span>
  </label>;
}
