"use client";

import { FormEvent, useMemo, useState } from "react";
import { CatalogProduct, formatBdt, sellingPriceBdt } from "@/lib/catalog";
import Link from "next/link";
import { bangladeshDistricts, bangladeshUpazilas } from "@/lib/bangladesh-locations";
import { LocationSearchSelect } from "@/components/location-search-select";
import { calculateOrderPricing } from "@/lib/order-pricing";
import { useLanguage } from "@/components/language-provider";

export function BuyNowForm({ product }: { product: CatalogProduct }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [districtId, setDistrictId] = useState("");
  const [upazilaId, setUpazilaId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const outOfStock = product.stockQuantity === 0;
  const upazilas = useMemo(() => bangladeshUpazilas.filter((upazila) => upazila.districtId === districtId), [districtId]);
  const district = useMemo(() => bangladeshDistricts.find((item) => item.id === districtId), [districtId]);
  const salePrice = sellingPriceBdt(product);
  const pricing = useMemo(() => district ? calculateOrderPricing(salePrice, quantity, district.en) : undefined, [district, salePrice, quantity]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!districtId || !upazilaId) { setError(t("checkout.selectLocation")); return; }
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
          quantity,
          address: form.get("address"),
        }),
      });
      const result = await response.json() as { orderNumber?: string; error?: string };
      if (!response.ok || !result.orderNumber) throw new Error(result.error ?? t("checkout.orderFailed"));
      setOrderNumber(result.orderNumber);
      setSent(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t("checkout.orderFailed"));
    } finally {
      setSaving(false);
    }
  }

  if (sent) return <div className="mt-8 border border-emerald-600 bg-emerald-50 p-5 text-sm leading-6 text-emerald-950"><b className="text-base text-emerald-700">{t("checkout.confirmed")}</b><p className="mt-1">Order no: <b>{orderNumber}</b>. {t("checkout.deliveryDetails")} {t("checkout.cashOnDelivery")}</p><Link href="/orders" className="mt-4 inline-block bg-[#09172e] px-4 py-3 text-xs font-bold tracking-[.1em] text-white">{t("checkout.viewOrder")}</Link></div>;
  if (!open) return <div className="mt-8"><button type="button" disabled={outOfStock} onClick={() => setOpen(true)} className="bg-[#09172e] px-7 py-4 text-xs font-bold tracking-[.13em] text-white disabled:cursor-not-allowed disabled:bg-[#68758a]">{outOfStock ? t("common.outOfStock") : t("common.buyNow")}</button></div>;
  return <form onSubmit={submit} className="mt-8 max-w-2xl border border-[#0b1830]/15 bg-[#fffdf8] p-5 sm:p-6">
    <p className="text-xs font-bold tracking-[.14em] text-[#b38b45]">{t("common.buyNow")} · {formatBdt(salePrice)}</p><h2 className="mt-2 text-xl font-bold">{t("checkout.deliveryDetails")}</h2><p className="mt-2 text-sm leading-6 text-[#40506b]">{t("checkout.deliveryDetails")} — {product.name}</p>
    <label className="mt-5 block text-sm font-semibold">{t("checkout.fullName")} <span className="text-red-700" aria-hidden="true">*</span><input required name="name" autoComplete="name" placeholder={t("checkout.namePlaceholder")} maxLength={100} className="mt-2 w-full border border-[#0b1830]/20 bg-white px-3 py-3 outline-none placeholder:text-[#68758a] focus:border-[#b38b45] focus:ring-2 focus:ring-[#b38b45]/20" /></label>
    <label className="mt-4 block text-sm font-semibold">{t("checkout.mobile")} <span className="text-red-700" aria-hidden="true">*</span><input required name="phone" type="tel" inputMode="numeric" autoComplete="tel" placeholder="01XXXXXXXXX" pattern="(?:\\+?88)?01[3-9][0-9]{8}" title="Enter a valid Bangladesh mobile number, for example 01712345678" className="mt-2 w-full border border-[#0b1830]/20 bg-white px-3 py-3 outline-none placeholder:text-[#68758a] focus:border-[#b38b45] focus:ring-2 focus:ring-[#b38b45]/20" /><span className="mt-1 block text-xs font-normal text-[#68758a]">Example: 01712345678</span></label>
    <label className="mt-4 block max-w-44 text-sm font-semibold">{t("checkout.quantity")}<select value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} className="mt-2 w-full border border-[#0b1830]/20 bg-white px-3 py-3 outline-none focus:border-[#b38b45] focus:ring-2 focus:ring-[#b38b45]/20">{Array.from({ length: 10 }, (_, index) => index + 1).map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
    <div className="mt-4 grid gap-4 sm:grid-cols-2"><LocationSearchSelect label={t("checkout.district")} placeholder={t("checkout.districtPlaceholder")} searchPlaceholder={t("checkout.districtSearch")} options={bangladeshDistricts} value={districtId} onChange={(id) => { setDistrictId(id); setUpazilaId(""); }} required emptyText={t("checkout.noDistrict")} /><LocationSearchSelect label={t("checkout.upazila")} placeholder={t("checkout.upazilaPlaceholder")} searchPlaceholder={t("checkout.upazilaSearch")} options={upazilas} value={upazilaId} onChange={setUpazilaId} disabled={!districtId} required emptyText={t("checkout.noUpazila")} /></div>
    <label className="mt-4 block text-sm font-semibold">{t("checkout.address")} <span className="text-red-700" aria-hidden="true">*</span><textarea required name="address" rows={4} maxLength={500} autoComplete="street-address" placeholder={t("checkout.addressPlaceholder")} className="mt-2 w-full resize-y border border-[#0b1830]/20 bg-white px-3 py-3 outline-none placeholder:text-[#68758a] focus:border-[#b38b45] focus:ring-2 focus:ring-[#b38b45]/20" /></label>
    <section aria-live="polite" className="mt-5 border border-[#0b1830]/15 bg-white p-4 text-sm text-[#243554]"><p className="text-xs font-bold tracking-[.12em] text-[#b38b45]">{t("checkout.orderSummary")}</p>{pricing ? <><p className="mt-3 flex justify-between gap-4"><span>{t("checkout.subtotal")}</span><b>৳{pricing.productSubtotalBdt.toLocaleString("en-BD")}</b></p><p className="mt-2 flex justify-between gap-4"><span>{t("checkout.delivery")} <span className="text-xs text-[#68758a]">({pricing.deliveryArea === "inside_dhaka" ? t("checkout.insideDhaka") : t("checkout.outsideDhaka")})</span></span><b>৳{pricing.deliveryChargeBdt.toLocaleString("en-BD")}</b></p><p className="mt-2 flex justify-between gap-4"><span>{t("checkout.discount")}</span><b>৳{pricing.discountBdt.toLocaleString("en-BD")}</b></p><p className="mt-3 flex justify-between gap-4 border-t border-[#0b1830]/15 pt-3 text-base font-bold text-[#09172e]"><span>{t("checkout.grandTotal")}</span><span>৳{pricing.totalPayableBdt.toLocaleString("en-BD")}</span></p></> : <p className="mt-3 leading-6 text-[#68758a]">{t("checkout.selectDistrict")}</p>}</section>
    {error && <p role="alert" className="mt-4 border border-red-300 bg-red-50 p-3 text-sm text-red-800">{error}</p>}<button disabled={saving} className="mt-5 w-full bg-[#09172e] px-5 py-4 text-xs font-bold tracking-[.13em] text-white disabled:opacity-60">{saving ? t("checkout.saving") : t("checkout.confirm")}</button><button type="button" onClick={() => setOpen(false)} className="mt-4 text-xs font-bold tracking-[.12em] text-[#40506b]">{t("common.cancel")}</button>
  </form>;
}
