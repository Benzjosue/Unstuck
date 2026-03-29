import Link from "next/link";
import ScreenWrapper from "@/components/shared/ScreenWrapper";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-brand-mist flex flex-col justify-center">
      <ScreenWrapper>
        <div className="flex flex-col gap-6">
          {/* App name + tagline */}
          <div>
            <h1 className="text-4xl font-semibold text-brand-slate tracking-tight">
              Unstuck
            </h1>
            <p className="mt-1 text-lg text-brand-teal font-medium">
              Awareness before burnout.
            </p>
          </div>

          {/* Product promise */}
          <p className="text-brand-slate leading-relaxed">
            When you feel off, overwhelmed, or foggy — Unstuck helps you figure
            out what&apos;s happening and gives you something simple to do about
            it. No guessing, no scrolling. Just a quick check-in and a reset
            that fits where you are.
          </p>

          {/* CTA */}
          <Link
            href="/checkin"
            className="bg-brand-warm text-white rounded-xl px-6 py-3 font-medium text-center hover:opacity-90 transition-opacity"
          >
            Check in now
          </Link>
        </div>

        {/* Crisis resource — subtle, always present */}
        <p className="mt-16 text-center text-xs text-brand-mid">
          In crisis?{" "}
          <span className="font-medium">Text or call 988</span>
        </p>
      </ScreenWrapper>
    </main>
  );
}
