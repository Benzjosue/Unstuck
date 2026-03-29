import Link from "next/link";
import ScreenWrapper from "@/components/shared/ScreenWrapper";
import StateCard from "@/components/result/StateCard";
import EducationToggle from "@/components/result/EducationToggle";

const PLACEHOLDER_EDUCATION =
  "When your mind and body are under sustained pressure, they often hold tension without a clear release. Your jaw, shoulders, and breathing can all tighten without you noticing — until the load becomes too much. This is a very common response to carrying a lot at once, and it tends to ease when you give your body a deliberate signal that it's okay to let go.";

export default function ResultPage() {
  return (
    <main className="min-h-screen bg-brand-mist">
      <ScreenWrapper>
        <div className="space-y-5">
          {/* Heading */}
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-mid">
            Based on what you shared, you may be in:
          </p>

          {/* State card */}
          <StateCard
            state="Tense & Overloaded"
            explanation="Your system is running hot right now. Racing thoughts and tight shoulders are your body bracing — even when nothing is actually happening. Let's give it a reason to ease off."
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
