/**
 * Deployment-neutral runtime configuration. Vercel supplies ADMIN_EMAILS as
 * a project environment variable. Database wiring is intentionally deferred
 * until a managed database is connected to this Vercel project.
 */
export const platformEnv = {
  get DB(): D1Database | undefined {
    return (globalThis as unknown as { __LUNO_D1__?: D1Database }).__LUNO_D1__;
  },
  get ADMIN_EMAILS(): string | undefined {
    return process.env.ADMIN_EMAILS;
  },
};
