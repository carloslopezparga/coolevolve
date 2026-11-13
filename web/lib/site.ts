export const REPO_URL = "https://github.com/carloslopezparga/coolevolve";

/** URL pública. En Vercel se resuelve sola; se puede fijar con NEXT_PUBLIC_SITE_URL. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
