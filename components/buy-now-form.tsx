"use client";

import { FormEvent, useState } from "react";
import { CatalogProduct, formatBdt } from "@/lib/catalog";
import Link from "next/link";

export function BuyNowForm({ product }: { product: CatalogProduct }) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/store-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: product.slug,
          name: form.get("name"),
          phone: form.get("phone"),
          address: form.get("address"),
        }),
      });
      const result = await response.json() as { orderNumber?: string; error?: string };
      if (!response.ok || !result.orderNumber) throw new Error(result.error ?? "Order could not be confirmed.");
      setOrderNumber(result.orderNumber);
      setSent(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Order could not be confirmed.");
    } finally {
      setSaving(false);
    }
  }

  if (sent) return <div className="mt-8 border border-emerald-600 bg-emerald-50 p-5 text-sm leading-6 text-emerald-950"><b className="text-base text-emerald-700">ORDER CONFIRMED ✓</b><p className="mt-1">Order no: <b>{orderNumber}</b>. Your delivery details have been securely saved. Cash on Delivery is selected.</p><Link href="/orders" className="mt-4 inline-block bg-[#09172e] px-4 py-3 text-xs font-bold tracking-[.1em] text-white">VIEW MY ORDER →</Link></div>;
  return <div className="mt-8">
    {!open ? <button type="button" onClick={() => setOpen(true)} className="bg-[#09172e] px-7 py-4 text-xs font-bold tracking-[.13em] text-white">BUY NOW →</button> : <form onSubmit={submit} className="max-w-lg border border-[#0b1830]/15 bg-[#fffdf8] p-6"><p className="text-xs font-bold tracking-[.14em] text-[#b38b45]">BUY NOW · {formatBdt(product.priceBdt)}</p><h2 className="mt-2 text-xl font-bold">Delivery details</h2><p className="mt-2 text-sm leading-6 text-[#40506b]">Enter your details to order {product.name}.</p><label className="mt-5 block text-sm font-semibold">Full name<input required name="name" autoComplete="name" className="mt-2 w-full border border-[#0b1830]/20 bg-white px-3 py-3 outline-none focus:border-[#b38b45]" /></label><label className="mt-4 block text-sm font-semibold">Mobile number<input required name="phone" type="tel" autoComplete="tel" placeholder="01XXXXXXXXX" className="mt-2 w-full border border-[#0b1830]/20 bg-white px-3 py-3 outline-none focus:border-[#b38b45]" /></label><label className="mt-4 block text-sm font-semibold">Full delivery address<textarea required name="address" rows={3} autoComplete="street-address" className="mt-2 w-full border border-[#0b1830]/20 bg-white px-3 py-3 outline-none focus:border-[#b38b45]" /></label>{error && <p className="mt-4 border border-red-300 bg-red-50 p-3 text-sm text-red-800">{error}</p>}<button disabled={saving} className="mt-5 w-full bg-[#09172e] px-5 py-4 text-xs font-bold tracking-[.13em] text-white disabled:opacity-60">{saving ? "SAVING ORDER…" : "CONFIRM ORDER →"}</button><button type="button" onClick={() => setOpen(false)} className="mt-4 text-xs font-bold tracking-[.12em] text-[#40506b]">CANCEL</button></form>}
  </div>;
}
