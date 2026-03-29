import { NextResponse } from "next/server";
import type { Context } from "@/lib/types";
import { detectState } from "@/lib/state-detection/logic";
import { fallbackExplanation } from "@/lib/content/fallbacks";
import { supabaseServer } from "@/lib/supabase/server";

const VALID_CONTEXTS: Context[] = ["private", "desk", "public", "car", "bed"];

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

  const { session_id, signals, context } = body as Record<string, unknown>;

  // Validate session_id
  if (typeof session_id !== "string" || session_id.trim() === "") {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", message: "session_id is required and must be a non-empty string." },
      { status: 400 }
    );
  }

  // Validate signals
  if (
    !Array.isArray(signals) ||
    signals.length < 2 ||
    !signals.every((s) => typeof s === "string")
  ) {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", message: "signals must be an array of strings with at least 2 items." },
      { status: 400 }
    );
  }

  // Validate context
  if (!VALID_CONTEXTS.includes(context as Context)) {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", message: `context must be one of: ${VALID_CONTEXTS.join(", ")}.` },
      { status: 400 }
    );
  }

  const typedSignals = signals as string[];
  const typedContext = context as Context;

  // Detect state from signals
  const state = detectState(typedSignals);

  // Use fallback explanation (AI will replace this in T056)
  const explanation = fallbackExplanation[state];

  // Write to checkins table
  const { data: checkinData, error: checkinError } = await supabaseServer
    .from("checkins")
    .insert({ session_id, signals: typedSignals, context: typedContext })
    .select("id")
    .single();

  if (checkinError || !checkinData) {
    return NextResponse.json(
      { error: "DB_ERROR", message: "Failed to save check-in." },
      { status: 500 }
    );
  }

  const checkin_id = checkinData.id as string;

  // Write to state_results table
  const { data: stateResultData, error: stateResultError } = await supabaseServer
    .from("state_results")
    .insert({
      checkin_id,
      session_id,
      state_label: state,
      explanation,
      ai_used: false,
    })
    .select("id")
    .single();

  if (stateResultError || !stateResultData) {
    return NextResponse.json(
      { error: "DB_ERROR", message: "Failed to save state result." },
      { status: 500 }
    );
  }

  const state_result_id = stateResultData.id as string;

  return NextResponse.json(
    { state, explanation, checkin_id, state_result_id, ai_used: false },
    { status: 200 }
  );
}
