import { NextResponse } from "next/server";
import type { StateLabel, Context } from "@/lib/types";
import { selectTechnique } from "@/lib/content/resets";

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

  const technique = selectTechnique(state as StateLabel, context as Context);

  return NextResponse.json(
    {
      technique,
      steps: technique.defaultSteps,
      why: technique.defaultWhy,
    },
    { status: 200 }
  );
}
