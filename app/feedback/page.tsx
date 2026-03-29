"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ScreenWrapper from "@/components/shared/ScreenWrapper";
import OutcomePicker from "@/components/feedback/OutcomePicker";
import ClosingMessage from "@/components/feedback/ClosingMessage";
import { useCheckinSession } from "@/lib/context/session";
import type { Outcome } from "@/lib/types";

export default function FeedbackPage() {
  const router = useRouter();
  const { session, updateSession, resetSession } = useCheckinSession();

  const [closingText, setClosingText] = useState<string | null>(null);

  // Route guard: if no reset_plan_id in context, user navigated directly — send them home.
  useEffect(() => {
    if (session.reset_plan_id === null) {
      router.replace("/");
    }
  }, [session.reset_plan_id, router]);

  // Render nothing while the redirect is in flight.
  if (session.reset_plan_id === null) {
    return null;
  }

  async function handleSelect(outcome: Outcome) {
    // Don't re-submit if already submitted.
    if (closingText !== null) return;

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: session.session_id,
          reset_plan_id: session.reset_plan_id,
          outcome,
        }),
      });

      // API returns 200 even on DB failure — always use the response.
      if (res.ok) {
        const data: { closing_message: string } = await res.json();
        setClosingText(data.closing_message);
      } else {
        // Validation error or unexpected failure — still show a message, don't leave blank.
        setClosingText("Thanks for checking in. That counts for something.");
      }
    } catch {
      // Network failure — still show a message.
      setClosingText("Thanks for checking in. That counts for something.");
    }

    updateSession({ outcome, phase: "complete" });
  }

  const isDone = closingText !== null;

  return (
    <main className="min-h-screen bg-brand-mist">
      <ScreenWrapper>
        <div className="space-y-5">
          {/* Heading */}
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-brand-slate">
              Did that help at all?
            </h1>
            <p className="text-brand-mid text-sm">No right or wrong answer.</p>
          </div>

          {/* Outcome picker */}
          <OutcomePicker
            selected={session.outcome}
            onSelect={handleSelect}
          />

          {/* Closing message — shown after selection */}
          {isDone && closingText && (
            <ClosingMessage message={closingText} />
          )}

          {/* Navigation links — shown after selection */}
          {isDone && (
            <div className="flex flex-col gap-3 pt-2">
              <Link
                href="/checkin"
                onClick={resetSession}
                className="block w-full bg-brand-teal text-white rounded-xl px-6 py-3 font-medium text-center hover:opacity-90 transition-opacity"
              >
                Check in again
              </Link>
              <Link
                href="/"
                className="block w-full bg-white border border-brand-border text-brand-slate rounded-xl px-6 py-3 font-medium text-center hover:opacity-90 transition-opacity"
              >
                Done for now
              </Link>
            </div>
          )}

          {/* Crisis resource */}
          <p className="text-xs text-brand-mid text-center pt-2">
            In crisis?{" "}
            <a
              href="tel:988"
              className="underline text-brand-teal"
            >
              Call or text 988
            </a>{" "}
            — free, confidential, 24/7.
          </p>
        </div>
      </ScreenWrapper>
    </main>
  );
}
