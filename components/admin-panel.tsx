"use client";

import { useState } from "react";
import { AdminOrders } from "@/components/admin-orders";
import { AdminProducts } from "@/components/admin-products";
import { AdminVisitors } from "@/components/admin-visitors";

type Tab = "orders" | "products" | "visitors";

export function AdminPanel() {
  const [tab, setTab] = useState<Tab>("orders");
  const tabs: Array<{ id: Tab; label: string }> = [
    { id: "orders", label: "ORDERS" },
    { id: "products", label: "ADD PRODUCT" },
    { id: "visitors", label: "VISITORS" },
  ];
  return <><div className="mt-8 flex flex-wrap gap-3 border-b border-[#0b1830]/15 pb-4">{tabs.map((item) => <button key={item.id} type="button" onClick={() => setTab(item.id)} className={`px-4 py-3 text-xs font-bold tracking-[.12em] ${tab === item.id ? "bg-[#09172e] text-white" : "border border-[#0b1830]/20 bg-white text-[#09172e]"}`}>{item.label}</button>)}</div>{tab === "orders" ? <AdminOrders /> : null}{tab === "products" ? <AdminProducts /> : null}{tab === "visitors" ? <AdminVisitors /> : null}</>;
}
