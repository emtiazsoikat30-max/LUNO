import { LunoShell } from "@/components/luno-shell";
import { MyOrders } from "@/components/my-orders";
export default function OrdersPage() { return <LunoShell eyebrow="MY LUNO" title="My orders."><p className="mt-5 max-w-2xl leading-7 text-[#40506b]">Your orders are private. You can cancel a pending order and include a cancellation reason.</p><MyOrders /></LunoShell>; }
