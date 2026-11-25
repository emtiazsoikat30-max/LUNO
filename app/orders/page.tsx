import { LunoShell } from "@/components/luno-shell";
import { MyOrders } from "@/components/my-orders";
import { T } from "@/components/localized-text";
export default function OrdersPage() { return <LunoShell eyebrow={<T id="account.eyebrow" />} title={<T id="orders.title" />}><p className="mt-5 max-w-2xl leading-7 text-[#40506b]"><T id="orders.text" /></p><MyOrders /></LunoShell>; }
