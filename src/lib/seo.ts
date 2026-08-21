// Real domain, overridable via NEXT_PUBLIC_SITE_URL (e.g. for Vercel preview
// deployments) — every metadata/JSON-LD URL below is built from this.
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://soberanocognitivo.com";

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}
