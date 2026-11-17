import { NextResponse } from "next/server";
import { createStoreOrder } from "@/lib/store-db";
import { createCustomerSession, currentCustomerSession, customerCookie } from "@/lib/customer-session";
import { findDistrict, findUpazila, formatBangladeshLocation } from "@/lib/bangladesh-locations";

const bangladeshMobile = /^(?:\+?88)?01[3-9]\d{8}$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { slug?: string; name?: string; phone?: string; districtId?: string; upazilaId?: string; address?: string };
    const slug = body.slug?.trim();
    const name = body.name?.trim();
    const phone = body.phone?.trim();
    const district = body.districtId ? findDistrict(body.districtId) : undefined;
    const upazila = body.upazilaId && district ? findUpazila(body.upazilaId, district.id) : undefined;
    const address = body.address?.trim();
    if (!slug || !name || name.length > 100 || !phone || !bangladeshMobile.test(phone.replace(/[\s-]/g, "")) || !district || !upazila || !address || address.length > 500) {
      return NextResponse.json({ error: "Please enter valid delivery details." }, { status: 400 });
    }
    const existingSession = await currentCustomerSession();
    const session = existingSession ? undefined : createCustomerSession();
    const order = await createStoreOrder({
      slug, name, phone, address, customerSessionId: existingSession ?? session!.id,
      district: formatBangladeshLocation(district), upazila: formatBangladeshLocation(upazila),
    });
    const response = NextResponse.json(order, { status: 201 });
    if (session) response.cookies.set(customerCookie.name, session.value, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: customerCookie.maxAge });
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to confirm order";
    return NextResponse.json({ error: message }, { status: message.includes("configured") ? 503 : 500 });
  }
}
