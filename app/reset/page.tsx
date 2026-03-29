"use client";

import { useState } from "react";
import Link from "next/link";
import ScreenWrapper from "@/components/shared/ScreenWrapper";
import TechniqueCard from "@/components/reset/TechniqueCard";
import StepList from "@/components/reset/StepList";
import DurationSelector from "@/components/reset/DurationSelector";
import SafetyNote from "@/components/reset/SafetyNote";

const PLACEHOLDER_STEPS = [
  "Breathe in slowly through your nose for a count of 4.",
  "Hold your breath gently for a count of 4.",
  "Breathe out slowly through your mouth for a count of 4.",
  "Hold at the bottom — lungs empty — for a count of 4.",
  "That's one cycle. Repeat without strain.",
];

const PLACEHOLDER_WHY =
  "Equal counts in and out may help your body find a steadier rhythm. The brief holds give your system a moment to pause. You can do this completely silently — no one needs to know.";

const DURATION_OPTIONS = ["30s", "2min", "5min"] as const;

export default function ResetPage() {
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-brand-mist">
      <ScreenWrapper>
        <div className="space-y-5">
          {/* Heading */}
          <h1 className="text-2xl font-semibold text-brand-slate">
            Here&apos;s something to try right now
          </h1>

          {/* Technique card */}
          <TechniqueCard name="Box Breathing" type="Breathing" />

          {/* Safety note — shown for breathwork */}
          <SafetyNote />

          {/* Duration selector */}
          <DurationSelector
            options={[...DURATION_OPTIONS]}
            selected={selectedDuration}
            onSelect={setSelectedDuration}
          />

          {/* Step list */}
          <StepList steps={PLACEHOLDER_STEPS} />

          {/* Why this may help */}
          <div className="bg-white rounded-2xl p-5 border border-brand-border">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-mid mb-2">
              Why this may help
            </p>
            <p className="text-brand-slate text-sm leading-relaxed">
              {PLACEHOLDER_WHY}
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
