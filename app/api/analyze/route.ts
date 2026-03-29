import { NextResponse } from "next/server";
import type { Context, StateLabel } from "@/lib/types";
import { detectState } from "@/lib/state-detection/logic";
import { SIGNAL_TABLE } from "@/lib/state-detection/signals";
import { fallbackExplanation } from "@/lib/content/fallbacks";
import { buildExplanationPrompt } from "@/lib/openai/prompts";
import { openai } from "@/lib/openai/client";
import { supabaseServer } from "@/lib/supabase/server";

const VALID_CONTEXTS: Context[] = ["private", "desk", "public", "car", "bed"];

// Returns the labels of the top 3–5 signals most strongly weighted toward the detected state.
function getTopSignalLabels(signalIds: string[], state: StateLabel): string[] {
  const scored = signalIds
    .filter((id) => SIGNAL_TABLE[id] !== undefined)
    .map((id) => ({
      label: SIGNAL_TABLE[id].label,
      weight: SIGNAL_TABLE[id].weights[state],
    }))
    .filter(({ weight }) => weight > 0)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 5)
    .map(({ label }) => label);

  // Always return at least 3 if possible; if fewer signals were selected, return all.
  return scored.slice(0, Math.max(scored.length, 3));
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: "VALIDATION_ERROR",
        message: "Request body must be valid JSON.",
      },
      { status: 400 },
    );
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", message: "Request body must be an object." },
      { status: 400 },
    );
  }

  const { session_id, signals, context } = body as Record<string, unknown>;

  // Validate session_id
  if (typeof session_id !== "string" || session_id.trim() === "") {
    return NextResponse.json(
      {
        error: "VALIDATION_ERROR",
        message: "session_id is required and must be a non-empty string.",
      },
      { status: 400 },
    );
  }

  // Validate signals
  if (
    !Array.isArray(signals) ||
    signals.length < 2 ||
    !signals.every((s) => typeof s === "string")
  ) {
    return NextResponse.json(
      {
        error: "VALIDATION_ERROR",
        message: "signals must be an array of strings with at least 2 items.",
      },
      { status: 400 },
    );
  }

  // Validate context
  if (!VALID_CONTEXTS.includes(context as Context)) {
    return NextResponse.json(
      {
        error: "VALIDATION_ERROR",
        message: `context must be one of: ${VALID_CONTEXTS.join(", ")}.`,
      },
      { status: 400 },
    );
  }

  const typedSignals = signals as string[];
  const typedContext = context as Context;

  // Detect state from signals (rule-based — AI never detects state)
  const state = detectState(typedSignals);

  // Identify top signals for the prompt
  const topSignalLabels = getTopSignalLabels(typedSignals, state);

  // Generate explanation — try AI, fall back to pre-written copy on any failure
  let explanation: string;
  let ai_used: boolean;

  try {
    const prompt = buildExplanationPrompt(state, topSignalLabels);

    const completion = await openai.chat.completions.create(
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: prompt.system },
          { role: "user", content: prompt.user },
        ],
        max_tokens: 200,
        temperature: 0.7,
      },
      { timeout: 15000 },
    );

    const aiText = completion.choices[0]?.message?.content?.trim();

    if (aiText) {
      explanation = aiText;
      ai_used = true;
    } else {
      // Empty response — use fallback
      explanation = fallbackExplanation[state];
      ai_used = false;
    }
  } catch {
    // Timeout, API error, or any other failure — use fallback
    explanation = fallbackExplanation[state];
    ai_used = false;
  }

  // Write to checkins table
  const { data: checkinData, error: checkinError } = await supabaseServer
    .from("checkins")
    .insert({ session_id, signals: typedSignals, context: typedContext })
    .select("id")
    .single();

  if (checkinError || !checkinData) {
    return NextResponse.json(
      { error: "DB_ERROR", message: "Failed to save check-in." },
      { status: 500 },
    );
  }

  const checkin_id = checkinData.id as string;

  // Write to state_results table
  const { data: stateResultData, error: stateResultError } =
    await supabaseServer
      .from("state_results")
      .insert({
        checkin_id,
        session_id,
        state_label: state,
        explanation,
        ai_used,
      })
      .select("id")
      .single();

  if (stateResultError || !stateResultData) {
    return NextResponse.json(
      { error: "DB_ERROR", message: "Failed to save state result." },
      { status: 500 },
    );
  }

  const state_result_id = stateResultData.id as string;

  return NextResponse.json(
    { state, explanation, checkin_id, state_result_id, ai_used },
    { status: 200 },
  );
}
