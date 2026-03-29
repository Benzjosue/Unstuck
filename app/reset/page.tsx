"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ScreenWrapper from "@/components/shared/ScreenWrapper";
import TechniqueCard from "@/components/reset/TechniqueCard";
import StepList from "@/components/reset/StepList";
import DurationSelector from "@/components/reset/DurationSelector";
import SafetyNote from "@/components/reset/SafetyNote";
import { useCheckinSession } from "@/lib/context/session";

export default function ResetPage() {
  const router = useRouter();
  const { session } = useCheckinSession();

  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);

  // Route guard: if no technique in context, user navigated directly — send them home.
  useEffect(() => {
    if (session.technique === null) {
      router.replace("/");
    }
  }, [session.technique, router]);

  // Render nothing while the redirect is in flight.
  if (session.technique === null) {
    return null;
  }

  const { technique, steps, why } = session;

  return (
    <main className="min-h-screen bg-brand-mist">
      <ScreenWrapper>
        <div className="space-y-5">
          {/* Heading */}
          <h1 className="text-2xl font-semibold text-brand-slate">
            Here&apos;s something to try right now
          </h1>

          {/* Technique card — real data from context */}
          <TechniqueCard name={technique.name} type={technique.type} />

          {/* Safety note — only for breathwork techniques */}
          {technique.isBreatheWork && <SafetyNote />}

          {/* Duration selector — options from technique */}
          <DurationSelector
            options={technique.durationOptions}
            selected={selectedDuration}
            onSelect={setSelectedDuration}
          />

          {/* Step list — real steps from context */}
          <StepList steps={steps} />

          {/* Why this may help — real copy from context */}
          <div className="bg-white rounded-2xl p-5 border border-brand-border">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-mid mb-2">
              Why this may help
            </p>
            <p className="text-brand-slate text-sm leading-relaxed">
              {why}
            </p>
          </div>

          {/* CTA */}
          <Link
            href="/feedback"
            className="block w-full bg-brand-teal text-white rounded-xl px-6 py-3 font-medium text-center hover:opacity-90 transition-opacity"
          >
            I&apos;m done
          </Link>
        </div>
      </ScreenWrapper>
    </main>
  );
}
