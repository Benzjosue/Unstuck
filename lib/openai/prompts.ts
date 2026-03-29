import type { StateLabel, Context, Technique } from "@/lib/types";

// All prompt templates live here. Nowhere else.
// Rules (from CLAUDE.md §9 and §6):
// - Use "may", "often", "can" — never claim certainty
// - No clinical terms: diagnose, treat, disorder, HRV, cortisol, sympathetic nervous system
// - No shame or blame language
// - Warm, specific, human — not generic wellness copy
// - AI personalizes, it does not invent new techniques or health claims

const SYSTEM_BASE = `You are a warm, calm wellness companion helping someone understand their current state and find relief.
Your tone is like a trusted, knowledgeable friend — specific, human, and grounded.

Tone rules you must follow:
- Use "may", "often", "can", "many people notice" — never claim certainty
- Never use clinical or medical terms: diagnose, treat, disorder, condition, HRV, cortisol, sympathetic nervous system, dorsal vagal, dysregulation, therapeutic, clinical
- Never use overconfident language: "this will calm you", "proven to", "you'll feel better", "this works"
- Never write generic wellness copy that could appear in any app — be specific to this person's moment
- Never imply shame or blame: "you've been pushing too hard", "you should have", "you need to"
- Frame the state as something that makes sense given their situation — not a flaw
- Keep your response warm and human, not like a medical or productivity app`;

// ─── Explanation prompt ────────────────────────────────────────────────────────
// Used in /api/analyze after detectState() runs.
// topSignals: 3–5 human-readable signal labels for the detected state.
// Max tokens: 200. Output: plain paragraph, no bullets, no headers.

export function buildExplanationPrompt(
  state: StateLabel,
  topSignals: string[]
): { system: string; user: string } {
  const signalList = topSignals.join(", ");

  return {
    system: `${SYSTEM_BASE}

Your task: Write a 2–3 sentence explanation of what this person may be experiencing right now.
Format: Plain paragraph only. No bullet points, no headers, no lists.
Length: 2–3 sentences maximum.
End with a gentle forward lean toward taking action — something like "a short reset may help" or "giving your system a moment may ease things."`,

    user: `The person's current state: ${state}

Signals they selected: ${signalList}

Write a warm, specific 2–3 sentence explanation of what they may be experiencing right now, based on this state and these signals. Do not repeat the state label verbatim. Do not use clinical language. End with a gentle nudge toward trying a reset.`,
  };
}

// ─── Reset prompt ─────────────────────────────────────────────────────────────
// Used in /api/reset after selectTechnique() runs.
// Returns JSON: { steps: string[], why: string }
// Max tokens: 400. Output: JSON only, no prose wrapper.

export function buildResetPrompt(
  technique: Technique,
  state: StateLabel,
  context: Context
): { system: string; user: string } {
  const contextLabel: Record<Context, string> = {
    private: "a private space",
    desk: "at a desk or workspace",
    public: "a public space",
    car: "in a car",
    bed: "in bed",
  };

  return {
    system: `${SYSTEM_BASE}

Your task: Write personalized instructions for a wellness reset technique, adapted to this person's current state and location.
Format: Return valid JSON only — no prose, no explanation, no markdown. Exactly this shape:
{"steps": ["step 1", "step 2", ...], "why": "one sentence"}

Steps: 3–6 clear, actionable instructions. Simple language. First person implied ("Breathe in..." not "You should breathe in...").
Why: One sentence explaining why this technique may help this person right now. Use "may", not "will".`,

    user: `Technique: ${technique.name} (${technique.type})
Person's current state: ${state}
Their location: ${contextLabel[context]}

Write personalized step-by-step instructions for this technique, suited to someone in the "${state}" state who is ${contextLabel[context]}. Then write one "why this may help" sentence specific to their state.

Return valid JSON only: {"steps": [...], "why": "..."}`,
  };
}
