import { NextResponse } from "next/server";
import { cancelCustomerOrder, listCustomerOrders } from "@/lib/store-db";
import { currentCustomerSession } from "@/lib/customer-session";

export async function GET() {
  const session = await currentCustomerSession();
  if (!session) return NextResponse.json({ orders: [] });
  try { return NextResponse.json({ orders: await listCustomerOrders(session) }); }
  catch { return NextResponse.json({ error: "Unable to load orders" }, { status: 500 }); }
}

export async function PATCH(request: Request) {
  const session = await currentCustomerSession();
  if (!session) return NextResponse.json({ error: "Order access unavailable on this device" }, { status: 401 });
  try {
    const body = await request.json() as { orderNumber?: string; reason?: string };
    const reason = body.reason?.trim();
    if (!body.orderNumber || !reason || reason.length > 400) return NextResponse.json({ error: "Please select or write a cancellation reason." }, { status: 400 });
    const order = await cancelCustomerOrder(session, body.orderNumber, reason);
    if (!order) return NextResponse.json({ error: "Only pending orders can be cancelled." }, { status: 400 });
    return NextResponse.json({ order });
  } catch { return NextResponse.json({ error: "Unable to cancel order" }, { status: 500 }); }
}
