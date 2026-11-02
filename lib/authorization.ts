import { platformEnv as env } from "@/lib/platform-env";
import { getChatGPTUser } from "@/app/chatgpt-auth";

export class AuthorizationError extends Error {
  constructor(message = "Authentication required") { super(message); }
}

export async function requireCustomer() {
  const user = await getChatGPTUser();
  if (!user) throw new AuthorizationError();
  return user;
}

export async function requireAdmin() {
  const user = await requireCustomer();
  const allowlist = (env.ADMIN_EMAILS ?? "")
    .split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
  if (!allowlist.includes(user.email.toLowerCase())) {
    throw new AuthorizationError("Admin access required");
  }
  return user;
}
