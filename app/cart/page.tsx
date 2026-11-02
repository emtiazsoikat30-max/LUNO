import Link from "next/link";
import { LunoShell } from "@/components/luno-shell";

export default function CartPage() { return <LunoShell eyebrow="YOUR BAG" title="Shopping cart."><div className="mt-10 max-w-2xl border border-[#0b1830]/10 bg-[#fffdf8] p-8"><p className="leading-7 text-[#40506b]">Your bag is empty. Browse the LUNO collection to add your first item.</p><Link href="/products" className="mt-7 inline-block bg-[#09172e] px-6 py-4 text-xs font-bold tracking-[.13em] text-white">SHOP LUNO →</Link></div></LunoShell>; }
