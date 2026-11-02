import Link from "next/link";
import { LunoShell } from "@/components/luno-shell";

export default function AccountPage() { return <LunoShell eyebrow="MY LUNO" title="Your account."><div className="mt-10 max-w-2xl border border-[#0b1830]/10 bg-[#fffdf8] p-8"><h2 className="text-xl font-bold">Sign in to continue</h2><p className="mt-3 leading-7 text-[#40506b]">Customer accounts keep orders private and tied to the signed-in customer.</p><Link href="/orders" className="mt-7 inline-block bg-[#09172e] px-6 py-4 text-xs font-bold tracking-[.13em] text-white">MY ORDERS →</Link></div></LunoShell>; }
