import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { deleteStoreOrder, listStoreOrders, updateStoreOrderStatus, type StoreOrder } from "@/lib/store-db";

export async function GET() {
  if (!(await isAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try { return NextResponse.json({ orders: await listStoreOrders() }); }
  catch { return NextResponse.json({ error: "Unable to load orders" }, { status: 500 }); }
}

export async function PATCH(request: Request) {
  if (!(await isAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = (await request.json()) as { orderNumber?: string; status?: StoreOrder["status"] };
    if (!body.orderNumber || !body.status) return NextResponse.json({ error: "Missing order update details" }, { status: 400 });
    const order = await updateStoreOrderStatus(body.orderNumber, body.status);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json({ order });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update order" }, { status: 400 }); }
}

export async function DELETE(request: Request) {
  if (!(await isAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json() as { orderNumber?: string };
    if (!body.orderNumber) return NextResponse.json({ error: "Missing order number" }, { status: 400 });
    const order = await deleteStoreOrder(body.orderNumber);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json({ order });
  } catch { return NextResponse.json({ error: "Unable to delete order" }, { status: 500 }); }
}
