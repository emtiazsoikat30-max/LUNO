import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "luno_admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 12;

function credentials() {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!password || !secret) throw new Error("Admin access is not configured");
  return { password, secret };
}

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function createAdminSession() {
  const { secret } = credentials();
  const expiresAt = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
  const payload = `admin.${expiresAt}`;
  return { value: `${payload}.${sign(payload, secret)}`, maxAge: MAX_AGE_SECONDS };
}

export function verifyAdminPassword(value: string) {
  const { password } = credentials();
  const received = Buffer.from(value);
  const expected = Buffer.from(password);
  return received.length === expected.length && timingSafeEqual(received, expected);
}

export async function isAdminSession() {
  try {
    const { secret } = credentials();
    const value = (await cookies()).get(COOKIE_NAME)?.value;
    if (!value) return false;
    const [role, expiresAt, signature] = value.split(".");
    const payload = `${role}.${expiresAt}`;
    if (role !== "admin" || !expiresAt || !signature || Number(expiresAt) < Math.floor(Date.now() / 1000)) return false;
    const expected = sign(payload, secret);
    const received = Buffer.from(signature);
    const signed = Buffer.from(expected);
    return received.length === signed.length && timingSafeEqual(received, signed);
  } catch { return false; }
}

export const adminCookie = { name: COOKIE_NAME, maxAge: MAX_AGE_SECONDS };
