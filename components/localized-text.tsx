"use client";

import { type ReactNode } from "react";
import { type TranslationKey, useLanguage } from "@/components/language-provider";

export function T({ id, children }: { id: TranslationKey; children?: ReactNode }) {
  const { t } = useLanguage();
  return <>{t(id) ?? children}</>;
}

export function LocalizedCategory({ slug }: { slug: string }) {
  const { t } = useLanguage();
  const id = `category.${slug}` as TranslationKey;
  return <>{t(id)}</>;
}
