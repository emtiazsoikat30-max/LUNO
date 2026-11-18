"use client";

import { useEffect, useState } from "react";

type Analytics = { totalVisitors: number; liveVisitors: number };

export function AdminVisitors() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      const response = await fetch("/api/admin/visitors", { cache: "no-store" });
      if (!response.ok) {
        if (mounted) setError("Visitor data could not be loaded.");
        return;
      }
      const data = await response.json() as Analytics;
      if (mounted) { setAnalytics(data); setError(""); }
    }
    void load();
    const timer = window.setInterval(() => void load(), 30_000);
    return () => { mounted = false; window.clearInterval(timer); };
  }, []);

  return <section className="mt-8 border border-[#0b1830]/15 bg-white p-5 sm:p-6">
    <div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-xs font-bold tracking-[.16em] text-[#b38b45]">VISITOR ANALYTICS</p><h2 className="mt-1 text-xl font-bold text-[#09172e]">Website visitors</h2></div><p className="text-xs text-[#68758a]">Updates every 30 seconds</p></div>
    {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : <div className="mt-5 grid gap-4 sm:grid-cols-2"><article className="border border-emerald-200 bg-emerald-50 p-5"><p className="text-xs font-bold tracking-[.12em] text-emerald-800">LIVE VISITORS</p><p className="mt-2 text-4xl font-bold text-emerald-700">{analytics ? analytics.liveVisitors.toLocaleString("en-BD") : "—"}</p><p className="mt-2 text-sm text-emerald-900">Active in the last 2 minutes</p></article><article className="border border-[#0b1830]/15 bg-[#fffdf8] p-5"><p className="text-xs font-bold tracking-[.12em] text-[#40506b]">ALL VISITORS</p><p className="mt-2 text-4xl font-bold text-[#09172e]">{analytics ? analytics.totalVisitors.toLocaleString("en-BD") : "—"}</p><p className="mt-2 text-sm text-[#40506b]">Unique browsers since tracking started</p></article></div>}
  </section>;
}
