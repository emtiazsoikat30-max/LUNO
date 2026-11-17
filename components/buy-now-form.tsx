"use client";

import { FormEvent, useMemo, useState } from "react";
import { CatalogProduct, formatBdt } from "@/lib/catalog";
import Link from "next/link";
import { bangladeshDistricts, bangladeshUpazilas } from "@/lib/bangladesh-locations";
import { LocationSearchSelect } from "@/components/location-search-select";

export function BuyNowForm({ product }: { product: CatalogProduct }) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [districtId, setDistrictId] = useState("");
  const [upazilaId, setUpazilaId] = useState("");
  const upazilas = useMemo(() => bangladeshUpazilas.filter((upazila) => upazila.districtId === districtId), [districtId]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!districtId || !upazilaId) { setError("Please select your district and thana / upazila."); return; }
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
          districtId,
          upazilaId,
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
  if (!open) return <div className="mt-8"><button type="button" onClick={() => setOpen(true)} className="bg-[#09172e] px-7 py-4 text-xs font-bold tracking-[.13em] text-white">BUY NOW →</button></div>;
  return <form onSubmit={submit} className="mt-8 max-w-2xl border border-[#0b1830]/15 bg-[#fffdf8] p-5 sm:p-6">
    <p className="text-xs font-bold tracking-[.14em] text-[#b38b45]">BUY NOW · {formatBdt(product.priceBdt)}</p><h2 className="mt-2 text-xl font-bold">Delivery details</h2><p className="mt-2 text-sm leading-6 text-[#40506b]">Enter your delivery details to order {product.name}.</p>
    <label className="mt-5 block text-sm font-semibold">Full name <span className="text-red-700" aria-hidden="true">*</span><input required name="name" autoComplete="name" placeholder="Your full name" maxLength={100} className="mt-2 w-full border border-[#0b1830]/20 bg-white px-3 py-3 outline-none placeholder:text-[#68758a] focus:border-[#b38b45] focus:ring-2 focus:ring-[#b38b45]/20" /></label>
    <label className="mt-4 block text-sm font-semibold">Mobile number <span className="text-red-700" aria-hidden="true">*</span><input required name="phone" type="tel" inputMode="numeric" autoComplete="tel" placeholder="01XXXXXXXXX" pattern="(?:\\+?88)?01[3-9][0-9]{8}" title="Enter a valid Bangladesh mobile number, for example 01712345678" className="mt-2 w-full border border-[#0b1830]/20 bg-white px-3 py-3 outline-none placeholder:text-[#68758a] focus:border-[#b38b45] focus:ring-2 focus:ring-[#b38b45]/20" /><span className="mt-1 block text-xs font-normal text-[#68758a]">Example: 01712345678</span></label>
    <div className="mt-4 grid gap-4 sm:grid-cols-2"><LocationSearchSelect label="District" placeholder="Search district" searchPlaceholder="Type to search all 64 districts" options={bangladeshDistricts} value={districtId} onChange={(id) => { setDistrictId(id); setUpazilaId(""); }} required emptyText="No matching district found." /><LocationSearchSelect label="Thana / Upazila" placeholder="Search thana or upazila" searchPlaceholder="Type to search in the selected district" options={upazilas} value={upazilaId} onChange={setUpazilaId} disabled={!districtId} required emptyText="No matching thana / upazila found." /></div>
    <label className="mt-4 block text-sm font-semibold">Full delivery address <span className="text-red-700" aria-hidden="true">*</span><textarea required name="address" rows={4} maxLength={500} autoComplete="street-address" placeholder="Village, house number, road, area, market or landmark" className="mt-2 w-full resize-y border border-[#0b1830]/20 bg-white px-3 py-3 outline-none placeholder:text-[#68758a] focus:border-[#b38b45] focus:ring-2 focus:ring-[#b38b45]/20" /></label>
    {error && <p role="alert" className="mt-4 border border-red-300 bg-red-50 p-3 text-sm text-red-800">{error}</p>}<button disabled={saving} className="mt-5 w-full bg-[#09172e] px-5 py-4 text-xs font-bold tracking-[.13em] text-white disabled:opacity-60">{saving ? "SAVING ORDER…" : "CONFIRM ORDER →"}</button><button type="button" onClick={() => setOpen(false)} className="mt-4 text-xs font-bold tracking-[.12em] text-[#40506b]">CANCEL</button>
  </form>;
}
