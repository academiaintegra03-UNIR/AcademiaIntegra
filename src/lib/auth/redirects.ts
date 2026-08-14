import { roleOptions } from "@/lib/data/roles";

/** Every dashboard home path is a safe redirect target; nothing else is. */
const KNOWN_PATHS = new Set(roleOptions.map((option) => option.homePath));

/** Guards `?next=` against open redirects — only known in-app dashboard paths pass. */
export function safeNextPath(next: string | null | undefined): string | null {
  if (!next || !KNOWN_PATHS.has(next)) return null;
  return next;
}
