declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    /** Comma-separated email allowlist, configured only in Sites runtime settings. */
    ADMIN_EMAILS?: string;
  }
}
