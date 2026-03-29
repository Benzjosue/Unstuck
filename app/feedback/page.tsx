"use client";

import { useState } from "react";
import Link from "next/link";
import ScreenWrapper from "@/components/shared/ScreenWrapper";
import OutcomePicker from "@/components/feedback/OutcomePicker";
import ClosingMessage from "@/components/feedback/ClosingMessage";
import type { Outcome } from "@/lib/types";

const PLACEHOLDER_CLOSING =
  "That's worth something. Every time you pause and check in, you're building a little more awareness about what your system needs.";

export default function FeedbackPage() {
  const [selected, setSelected] = useState<Outcome | null>(null);

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
          <OutcomePicker selected={selected} onSelect={setSelected} />

          {/* Closing message — shown after selection */}
          {selected !== null && (
            <ClosingMessage message={PLACEHOLDER_CLOSING} />
          )}

          {/* Navigation links */}
          {selected !== null && (
            <div className="flex flex-col gap-3 pt-2">
              <Link
                href="/checkin"
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
