"use client";

import { useState } from "react";
import ScreenWrapper from "@/components/shared/ScreenWrapper";
import SignalGrid from "@/components/checkin/SignalGrid";
import ContextPicker from "@/components/checkin/ContextPicker";
import type { Context } from "@/lib/types";

export default function CheckinPage() {
  const [selectedSignals, setSelectedSignals] = useState<string[]>([]);
  const [selectedContext, setSelectedContext] = useState<Context | null>(null);

  function handleToggleSignal(id: string) {
    setSelectedSignals((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  function handleSubmit() {
    console.log("signals:", selectedSignals);
    console.log("context:", selectedContext);
  }

  const canSubmit = selectedSignals.length >= 2 && selectedContext !== null;

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
