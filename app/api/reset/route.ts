import { NextResponse } from "next/server";
import type { StateLabel, Context } from "@/lib/types";
import { selectTechnique } from "@/lib/content/resets";
import { buildResetPrompt } from "@/lib/openai/prompts";
import { openai } from "@/lib/openai/client";
import { supabaseServer } from "@/lib/supabase/server";

const VALID_STATES: StateLabel[] = [
  "Overactivated",
  "Tense & Overloaded",
  "Wired but Tired",
  "Foggy & Depleted",
  "Shut Down",
];

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

  const { session_id, state, context, state_result_id } = body as Record<string, unknown>;

  // Validate session_id
  if (typeof session_id !== "string" || session_id.trim() === "") {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", message: "session_id is required and must be a non-empty string." },
      { status: 400 }
    );
  }

  // Validate state
  if (!VALID_STATES.includes(state as StateLabel)) {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", message: `state must be one of: ${VALID_STATES.join(", ")}.` },
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

  // Validate state_result_id
  if (typeof state_result_id !== "string" || state_result_id.trim() === "") {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", message: "state_result_id is required and must be a non-empty string." },
      { status: 400 }
    );
  }

  const typedState = state as StateLabel;
  const typedContext = context as Context;
  const technique = selectTechnique(typedState, typedContext);

  // Generate personalized steps and why — try AI, fall back to defaults on any failure
  let steps: string[];
  let why: string;
  let ai_used: boolean;

  try {
    const prompt = buildResetPrompt(technique, typedState, typedContext);

    const completion = await openai.chat.completions.create(
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: prompt.system },
          { role: "user", content: prompt.user },
        ],
        max_tokens: 400,
        temperature: 0.7,
      },
      { timeout: 15000 }
    );

    const rawText = completion.choices[0]?.message?.content?.trim();

    if (!rawText) {
      throw new Error("Empty response from OpenAI");
    }

    // Parse the JSON response — any parse failure triggers fallback
    const parsed = JSON.parse(rawText) as { steps: unknown; why: unknown };

    if (
      !Array.isArray(parsed.steps) ||
      parsed.steps.length === 0 ||
      !parsed.steps.every((s) => typeof s === "string") ||
      typeof parsed.why !== "string" ||
      parsed.why.trim() === ""
    ) {
      throw new Error("Invalid JSON shape from OpenAI");
    }

    steps = parsed.steps as string[];
    why = parsed.why;
    ai_used = true;
  } catch {
    // Timeout, API error, empty response, JSON parse failure, or bad shape — use defaults
    steps = technique.defaultSteps;
    why = technique.defaultWhy;
    ai_used = false;
  }

  // Write to reset_plans table
  const { data: resetPlanData, error: resetPlanError } = await supabaseServer
    .from("reset_plans")
    .insert({
      state_result_id,
      session_id,
      technique_id: technique.id,
      technique_name: technique.name,
      technique_type: technique.type,
      steps,
      why,
      ai_used,
    })
    .select("id")
    .single();

  if (resetPlanError || !resetPlanData) {
    return NextResponse.json(
      { error: "DB_ERROR", message: "Failed to save reset plan." },
      { status: 500 }
    );
  }

  const reset_plan_id = resetPlanData.id as string;

  return NextResponse.json(
    {
      technique: {
        id: technique.id,
        name: technique.name,
        type: technique.type,
        durationOptions: technique.durationOptions,
        isBreatheWork: technique.isBreatheWork,
      },
      steps,
      why,
      reset_plan_id,
      ai_used,
    },
    { status: 200 }
  );
}
