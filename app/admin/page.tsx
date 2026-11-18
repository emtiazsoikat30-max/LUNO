import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { AdminOrders } from "@/components/admin-orders";
import { AdminVisitors } from "@/components/admin-visitors";
import { AdminProducts } from "@/components/admin-products";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdminSession())) redirect("/admin/login");
  return <main className="min-h-screen bg-[#f4f5f7] px-5 py-12"><div className="mx-auto max-w-6xl"><p className="text-xs font-bold tracking-[.2em] text-[#b38b45]">TALBETAL · ADMIN DASHBOARD</p><h1 className="mt-2 text-4xl font-bold text-[#09172e]">Store management</h1><p className="mt-2 text-sm text-[#40506b]">Protected server-side records for your catalog, visitors and customer orders.</p><AdminProducts /><AdminVisitors /><AdminOrders /></div></main>;
}
