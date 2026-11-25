import Link from "next/link";
import { LunoShell } from "@/components/luno-shell";
import { T } from "@/components/localized-text";

export default function AccountPage() { return <LunoShell eyebrow={<T id="account.eyebrow" />} title={<T id="account.title" />}><div className="mt-10 max-w-2xl border border-[#0b1830]/10 bg-[#fffdf8] p-8"><h2 className="text-xl font-bold"><T id="account.signIn" /></h2><p className="mt-3 leading-7 text-[#40506b]"><T id="account.text" /></p><Link href="/orders" className="mt-7 inline-block bg-[#09172e] px-6 py-4 text-xs font-bold tracking-[.13em] text-white"><T id="account.orders" /></Link></div></LunoShell>; }
