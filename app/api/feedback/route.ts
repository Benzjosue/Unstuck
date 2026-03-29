import { NextResponse } from "next/server";
import type { Outcome } from "@/lib/types";
import { closingMessage } from "@/lib/content/fallbacks";
import { supabaseServer } from "@/lib/supabase/server";

const VALID_OUTCOMES: Outcome[] = ["better", "same", "worse"];

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", message: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", message: "Request body must be an object." },
      { status: 400 }
    );
  }

  const { session_id, reset_plan_id, outcome } = body as Record<string, unknown>;

  // Validate session_id
  if (typeof session_id !== "string" || session_id.trim() === "") {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", message: "session_id is required and must be a non-empty string." },
      { status: 400 }
    );
  }

  // Validate reset_plan_id
  if (typeof reset_plan_id !== "string" || reset_plan_id.trim() === "") {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", message: "reset_plan_id is required and must be a non-empty string." },
      { status: 400 }
    );
  }

  // Validate outcome
  if (!VALID_OUTCOMES.includes(outcome as Outcome)) {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", message: `outcome must be one of: ${VALID_OUTCOMES.join(", ")}.` },
      { status: 400 }
    );
  }

  const typedOutcome = outcome as Outcome;

  // Write to feedback table.
  // On failure: log server-side but do not block the user — feedback write is never user-blocking.
  const { error: feedbackError } = await supabaseServer
    .from("feedback")
    .insert({ session_id, reset_plan_id, outcome: typedOutcome });

  if (feedbackError) {
    console.error("[/api/feedback] Failed to write feedback row:", feedbackError.message);
  }

  return NextResponse.json(
    { closing_message: closingMessage[typedOutcome] },
    { status: 200 }
  );
}
