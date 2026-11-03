import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const customerCookie = { name: "luno_customer_session", maxAge: 60 * 60 * 24 * 180 };

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value) throw new Error("Customer order access is not configured");
  return value;
}

function sign(id: string) { return createHmac("sha256", secret()).update(`customer.${id}`).digest("base64url"); }

export function createCustomerSession() {
  const id = crypto.randomUUID();
  return { id, value: `${id}.${sign(id)}` };
}

export async function currentCustomerSession() {
  try {
    const value = (await cookies()).get(customerCookie.name)?.value;
    if (!value) return undefined;
    const [id, signature] = value.split(".");
    if (!id || !signature) return undefined;
    const received = Buffer.from(signature); const expected = Buffer.from(sign(id));
    return received.length === expected.length && timingSafeEqual(received, expected) ? id : undefined;
  } catch { return undefined; }
}
