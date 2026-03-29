"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ScreenWrapper from "@/components/shared/ScreenWrapper";
import StateCard from "@/components/result/StateCard";
import EducationToggle from "@/components/result/EducationToggle";
import { useCheckinSession } from "@/lib/context/session";

const PLACEHOLDER_EDUCATION =
  "When your mind and body are under sustained pressure, they often hold tension without a clear release. Your jaw, shoulders, and breathing can all tighten without you noticing — until the load becomes too much. This is a very common response to carrying a lot at once, and it tends to ease when you give your body a deliberate signal that it's okay to let go.";

export default function ResultPage() {
  const router = useRouter();
  const { session } = useCheckinSession();

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
          <Link
            href="/reset"
            className="block w-full bg-brand-warm text-white rounded-xl px-6 py-3 font-medium text-center hover:opacity-90 transition-opacity"
          >
            Get my reset
          </Link>
        </div>
      </ScreenWrapper>
    </main>
  );
}
