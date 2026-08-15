/** Builds a wa.me link. Returns null if the advisor's number isn't configured yet. */
export function getWhatsAppLink(message?: string): string | null {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!number) return null;
  return message ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : `https://wa.me/${number}`;
}

export function getWhatsAppDisplayNumber(): string | null {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!number) return null;
  // 573186004016 -> +57 318 600 4016
  const country = number.slice(0, 2);
  const rest = number.slice(2);
  return `+${country} ${rest.slice(0, 3)} ${rest.slice(3, 6)} ${rest.slice(6)}`;
}
