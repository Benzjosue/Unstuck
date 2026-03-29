"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { CheckinSession } from "@/lib/types";

// ─── Initial state ─────────────────────────────────────────────────────────────
// session_id is set on mount by T021 (read from / written to localStorage).

const INITIAL_SESSION: CheckinSession = {
  session_id: "",
  signals: [],
  context: null,
  checkin_id: null,
  state: null,
  explanation: null,
  state_result_id: null,
  technique: null,
  steps: [],
  why: null,
  reset_plan_id: null,
  outcome: null,
  phase: "idle",
};

// ─── Context type ──────────────────────────────────────────────────────────────

type CheckinSessionContextValue = {
  session: CheckinSession;
  updateSession: (patch: Partial<CheckinSession>) => void;
  resetSession: () => void;
};

// ─── Context ───────────────────────────────────────────────────────────────────

export const CheckinSessionContext =
  createContext<CheckinSessionContextValue | null>(null);

// ─── Provider ──────────────────────────────────────────────────────────────────

export function CheckinSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<CheckinSession>(INITIAL_SESSION);

  const updateSession = useCallback((patch: Partial<CheckinSession>) => {
    setSession((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetSession = useCallback(() => {
    setSession((prev) => ({
      ...INITIAL_SESSION,
      // Preserve the session_id across resets so the same anonymous user
      // can start a new check-in without losing their identity.
      session_id: prev.session_id,
    }));
  }, []);

  return (
    <CheckinSessionContext.Provider
      value={{ session, updateSession, resetSession }}
    >
      {children}
    </CheckinSessionContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useCheckinSession(): CheckinSessionContextValue {
  const ctx = useContext(CheckinSessionContext);
  if (!ctx) {
    throw new Error(
      "useCheckinSession must be used inside <CheckinSessionProvider>."
    );
  }
  return ctx;
}
