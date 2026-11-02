import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { AdminOrders } from "@/components/admin-orders";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdminSession())) redirect("/admin/login");
  return <main className="min-h-screen bg-[#f4f5f7] px-5 py-12"><div className="mx-auto max-w-6xl"><p className="text-xs font-bold tracking-[.2em] text-[#b38b45]">LUNO · ADMIN DASHBOARD</p><h1 className="mt-2 text-4xl font-bold text-[#09172e]">Customer orders</h1><p className="mt-2 text-sm text-[#40506b]">Protected server-side order records. Handle only real customer orders.</p><AdminOrders /></div></main>;
}
