import { NextResponse } from "next/server";
import { createStoreOrder } from "@/lib/store-db";
import { createCustomerSession, currentCustomerSession, customerCookie } from "@/lib/customer-session";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { slug?: string; name?: string; phone?: string; address?: string };
    const slug = body.slug?.trim();
    const name = body.name?.trim();
    const phone = body.phone?.trim();
    const address = body.address?.trim();
    if (!slug || !name || name.length > 100 || !phone || phone.length > 30 || !address || address.length > 500) {
      return NextResponse.json({ error: "Please enter valid delivery details." }, { status: 400 });
    }
    const existingSession = await currentCustomerSession();
    const session = existingSession ? undefined : createCustomerSession();
    const order = await createStoreOrder({ slug, name, phone, address, customerSessionId: existingSession ?? session!.id });
    const response = NextResponse.json(order, { status: 201 });
    if (session) response.cookies.set(customerCookie.name, session.value, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: customerCookie.maxAge });
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to confirm order";
    return NextResponse.json({ error: message }, { status: message.includes("configured") ? 503 : 500 });
  }
}
