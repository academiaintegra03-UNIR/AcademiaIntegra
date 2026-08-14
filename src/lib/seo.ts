// Placeholder domain until the real one is confirmed by the project owner —
// set NEXT_PUBLIC_SITE_URL once it is, and every metadata/JSON-LD URL below
// updates automatically. ".example.com" is used deliberately so nothing here
// is ever mistaken for a real, live domain.
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.academia-integra.example.com";

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}
