"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ScreenWrapper from "@/components/shared/ScreenWrapper";
import StateCard from "@/components/result/StateCard";
import EducationToggle from "@/components/result/EducationToggle";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import { useCheckinSession } from "@/lib/context/session";
import type { Technique } from "@/lib/types";

type ResetResponse = {
  technique: Pick<Technique, "id" | "name" | "type" | "durationOptions" | "isBreatheWork">;
  steps: string[];
  why: string;
  reset_plan_id: string;
  ai_used: boolean;
};

const PLACEHOLDER_EDUCATION =
  "When your mind and body are under sustained pressure, they often hold tension without a clear release. Your jaw, shoulders, and breathing can all tighten without you noticing — until the load becomes too much. This is a very common response to carrying a lot at once, and it tends to ease when you give your body a deliberate signal that it's okay to let go.";

export default function ResultPage() {
  const router = useRouter();
  const { session, updateSession } = useCheckinSession();

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Route guard: if no state in context, user navigated directly — send them home.
  useEffect(() => {
    if (session.state === null) {
      router.replace("/");
    }
  }, [session.state, router]);

  // Render nothing while the redirect is in flight.
  if (session.state === null) {
    return null;
  }

  async function handleGetReset() {
    setIsLoading(true);
    setHasError(false);

    try {
      const res = await fetch("/api/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: session.session_id,
          state: session.state,
          context: session.context,
          state_result_id: session.state_result_id,
        }),
      });

      if (!res.ok) {
        setHasError(true);
        setIsLoading(false);
        return;
      }

      const data: ResetResponse = await res.json();

      updateSession({
        technique: data.technique as Technique,
        steps: data.steps,
        why: data.why,
        reset_plan_id: data.reset_plan_id,
        phase: "resetting",
      });

      router.push("/reset");
    } catch {
      setHasError(true);
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-brand-mist">
        <ScreenWrapper>
          <LoadingState message="Finding your reset…" />
        </ScreenWrapper>
      </main>
    );
  }

  if (hasError) {
    return (
      <main className="min-h-screen bg-brand-mist">
        <ScreenWrapper>
          <ErrorState onRetry={() => { setHasError(false); handleGetReset(); }} />
        </ScreenWrapper>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-mist">
      <ScreenWrapper>
        <div className="space-y-5">
          {/* Heading */}
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-mid">
            Based on what you shared, you may be in:
          </p>

          {/* State card — real data from context */}
          <StateCard
            state={session.state}
            explanation={session.explanation ?? ""}
          />

          {/* Education toggle */}
          <EducationToggle content={PLACEHOLDER_EDUCATION} />

          {/* CTA */}
          <button
            onClick={handleGetReset}
            className="block w-full bg-brand-warm text-white rounded-xl px-6 py-3 font-medium text-center hover:opacity-90 transition-opacity"
          >
            Get my reset
          </button>
        </div>
      </ScreenWrapper>
    </main>
  );
}
