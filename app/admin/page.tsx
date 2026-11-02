import Link from "next/link";
import { AuthorizationError, requireAdmin } from "@/lib/authorization";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  try {
    const admin = await requireAdmin();
    return <main className="min-h-screen bg-[#f4f5f7] p-6 text-[#0b1830] md:p-12"><div className="mx-auto max-w-5xl"><Link href="/" className="text-xs font-bold tracking-[.15em]">← BACK TO LUNO</Link><p className="mt-12 text-xs font-bold tracking-[.18em] text-[#b38b45]">PROTECTED ADMIN AREA</p><h1 className="mt-3 font-serif text-5xl">Welcome, {admin.displayName}.</h1><p className="mt-4 max-w-xl leading-7 text-[#40506b]">Your server-side access has been verified. Product and order management APIs are ready for the dashboard interface.</p><div className="mt-10 grid gap-5 md:grid-cols-2"><a href="/api/admin/products" className="border border-[#0b1830]/15 bg-white p-7"><b>Product management API</b><p className="mt-2 text-sm text-[#40506b]">View and add products with protected server validation.</p></a><a href="/api/admin/orders" className="border border-[#0b1830]/15 bg-white p-7"><b>Order management API</b><p className="mt-2 text-sm text-[#40506b]">View all orders—available only to allowlisted administrators.</p></a></div></div></main>;
  } catch (error) {
    if (error instanceof AuthorizationError) return <main className="grid min-h-screen place-items-center bg-[#09172e] p-6 text-center text-white"><div><p className="text-xs font-bold tracking-[.18em] text-[#d7b46d]">LUNO ADMIN</p><h1 className="mt-4 font-serif text-4xl">Access restricted.</h1><p className="mt-4 text-sm text-slate-300">This area is available only to an email configured in the server-side admin allowlist.</p><Link href="/" className="mt-8 inline-block border border-white/30 px-5 py-3 text-xs font-bold tracking-[.12em]">RETURN HOME</Link></div></main>;
    throw error;
  }
}
