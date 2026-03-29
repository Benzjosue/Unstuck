import { NextResponse } from "next/server";
import type { Context } from "@/lib/types";
import { detectState } from "@/lib/state-detection/logic";

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

  const state = detectState(signals as string[]);

  return NextResponse.json({ ok: true, state }, { status: 200 });
}
