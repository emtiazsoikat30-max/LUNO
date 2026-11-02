"use client";

import { FormEvent, useState } from "react";
import { CatalogProduct, formatBdt } from "@/lib/catalog";

export function BuyNowForm({ product }: { product: CatalogProduct }) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  if (sent) return <div className="mt-8 border border-[#b38b45] bg-[#fff9ec] p-5 text-sm leading-6"><b>Order details received on this device.</b><p className="mt-1 text-[#40506b]">Database connection is being completed next, so new orders will then be securely saved and shown in your Admin Dashboard.</p></div>;
  return <div className="mt-8">
    {!open ? <button type="button" onClick={() => setOpen(true)} className="bg-[#09172e] px-7 py-4 text-xs font-bold tracking-[.13em] text-white">BUY NOW →</button> : <form onSubmit={submit} className="max-w-lg border border-[#0b1830]/15 bg-[#fffdf8] p-6"><p className="text-xs font-bold tracking-[.14em] text-[#b38b45]">BUY NOW · {formatBdt(product.priceBdt)}</p><h2 className="mt-2 text-xl font-bold">Delivery details</h2><p className="mt-2 text-sm leading-6 text-[#40506b]">Enter your details to order {product.name}.</p><label className="mt-5 block text-sm font-semibold">Full name<input required name="name" autoComplete="name" className="mt-2 w-full border border-[#0b1830]/20 bg-white px-3 py-3 outline-none focus:border-[#b38b45]" /></label><label className="mt-4 block text-sm font-semibold">WhatsApp number<input required name="whatsapp" type="tel" autoComplete="tel" placeholder="01XXXXXXXXX" className="mt-2 w-full border border-[#0b1830]/20 bg-white px-3 py-3 outline-none focus:border-[#b38b45]" /></label><label className="mt-4 block text-sm font-semibold">Full delivery address<textarea required name="address" rows={3} autoComplete="street-address" className="mt-2 w-full border border-[#0b1830]/20 bg-white px-3 py-3 outline-none focus:border-[#b38b45]" /></label><button className="mt-5 w-full bg-[#09172e] px-5 py-4 text-xs font-bold tracking-[.13em] text-white">CONFIRM ORDER →</button><button type="button" onClick={() => setOpen(false)} className="mt-4 text-xs font-bold tracking-[.12em] text-[#40506b]">CANCEL</button></form>}
  </div>;
}
