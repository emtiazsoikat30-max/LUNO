"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter(); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const password = new FormData(event.currentTarget).get("password");
    const response = await fetch("/api/admin/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    if (!response.ok) { const body = await response.json() as { error?: string }; setError(body.error ?? "Unable to sign in"); setBusy(false); return; }
    router.replace("/admin"); router.refresh();
  }
  return <form onSubmit={submit} className="mt-8 max-w-md border border-[#0b1830]/15 bg-white p-7 shadow-sm"><label className="block text-sm font-semibold">Admin password<input required name="password" type="password" autoComplete="current-password" className="mt-2 w-full border border-[#0b1830]/20 px-3 py-3 outline-none focus:border-[#b38b45]" /></label>{error && <p className="mt-4 text-sm text-red-700">{error}</p>}<button disabled={busy} className="mt-5 w-full bg-[#09172e] px-5 py-4 text-xs font-bold tracking-[.13em] text-white disabled:opacity-60">{busy ? "SIGNING IN…" : "ADMIN SIGN IN →"}</button></form>;
}
