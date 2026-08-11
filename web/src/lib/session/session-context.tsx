"use client";

import * as React from "react";
import type { DemoSession, Role } from "@/lib/types/session";

const STORAGE_KEY = "academia-integra:demo-session";

const DEFAULT_SESSION: DemoSession = { role: "visitante", nombre: "" };

interface SessionContextValue {
  session: DemoSession;
  /** False until the client has mounted and localStorage has been read. */
  isHydrated: boolean;
  setRole: (role: Role, nombre?: string) => void;
  logout: () => void;
}

const SessionContext = React.createContext<SessionContextValue | null>(null);

function parseSession(raw: string | null): DemoSession {
  if (!raw) return DEFAULT_SESSION;
  try {
    const parsed = JSON.parse(raw) as Partial<DemoSession>;
    if (!parsed.role) return DEFAULT_SESSION;
    return { role: parsed.role, nombre: parsed.nombre ?? "" };
  } catch {
    return DEFAULT_SESSION;
  }
}

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getStorageSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY);
}

function getServerStorageSnapshot() {
  return null;
}

// Standard "has this mounted on the client yet" idiom via useSyncExternalStore,
// so we never call setState from inside an effect body.
function noopSubscribe() {
  return () => {};
}

function useHydrated() {
  return React.useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const isHydrated = useHydrated();
  const raw = React.useSyncExternalStore(
    subscribeToStorage,
    getStorageSnapshot,
    getServerStorageSnapshot
  );
  const session = React.useMemo(() => parseSession(raw), [raw]);

  const persist = React.useCallback((next: DemoSession) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      // The native "storage" event only fires in *other* tabs — dispatch
      // manually so this tab's useSyncExternalStore also re-reads.
      window.dispatchEvent(new StorageEvent("storage"));
    }
  }, []);

  const setRole = React.useCallback(
    (role: Role, nombre?: string) => {
      persist({ role, nombre: nombre ?? session.nombre });
    },
    [persist, session.nombre]
  );

  const logout = React.useCallback(() => {
    persist(DEFAULT_SESSION);
  }, [persist]);

  const value = React.useMemo(
    () => ({ session, isHydrated, setRole, logout }),
    [session, isHydrated, setRole, logout]
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = React.useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within a SessionProvider.");
  return ctx;
}
