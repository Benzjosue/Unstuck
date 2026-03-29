"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ScreenWrapper from "@/components/shared/ScreenWrapper";
import SignalGrid from "@/components/checkin/SignalGrid";
import ContextPicker from "@/components/checkin/ContextPicker";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import { useCheckinSession } from "@/lib/context/session";
import type { Context, StateLabel } from "@/lib/types";

type AnalyzeResponse = {
  state: StateLabel;
  explanation: string;
  checkin_id: string;
  state_result_id: string;
  ai_used: boolean;
};

export default function CheckinPage() {
  const router = useRouter();
  const { session, updateSession } = useCheckinSession();

  const [selectedSignals, setSelectedSignals] = useState<string[]>([]);
  const [selectedContext, setSelectedContext] = useState<Context | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  function handleToggleSignal(id: string) {
    setSelectedSignals((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  async function handleSubmit() {
    if (!selectedContext) return;

    setIsLoading(true);
    setHasError(false);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: session.session_id,
          signals: selectedSignals,
          context: selectedContext,
        }),
      });

      if (!res.ok) {
        setHasError(true);
        setIsLoading(false);
        return;
      }

      const data: AnalyzeResponse = await res.json();

      updateSession({
        signals: selectedSignals,
        context: selectedContext,
        state: data.state,
        explanation: data.explanation,
        checkin_id: data.checkin_id,
        state_result_id: data.state_result_id,
        phase: "result",
      });

      router.push("/result");
    } catch {
      setHasError(true);
      setIsLoading(false);
    }
  }

  const canSubmit = selectedSignals.length >= 2 && selectedContext !== null;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-brand-mist">
        <ScreenWrapper>
          <LoadingState message="Figuring out your state…" />
        </ScreenWrapper>
      </main>
    );
  }

  if (hasError) {
    return (
      <main className="min-h-screen bg-brand-mist">
        <ScreenWrapper>
          <ErrorState onRetry={() => { setHasError(false); handleSubmit(); }} />
        </ScreenWrapper>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-mist">
      <ScreenWrapper>
        <div className="space-y-6">
          {/* Heading */}
          <h1 className="text-2xl font-semibold text-brand-slate">
            What are you noticing right now?
          </h1>

          {/* Signal grid */}
          <SignalGrid
            selectedIds={selectedSignals}
            onToggle={handleToggleSignal}
          />

          {/* Context section */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-brand-slate">
              Where are you right now?
            </h2>
            <ContextPicker
              selected={selectedContext}
              onSelect={setSelectedContext}
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`w-full rounded-xl px-6 py-3 font-medium transition-opacity ${
              canSubmit
                ? "bg-brand-teal text-white hover:opacity-90"
                : "bg-brand-teal text-white opacity-40 cursor-not-allowed"
            }`}
          >
            See my state
          </button>
        </div>
      </ScreenWrapper>
    </main>
  );
}
