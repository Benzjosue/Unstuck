import type { StateLabel, Outcome } from "@/lib/types";

// Pre-written state explanations — shown on the result screen when OpenAI is unavailable.
// AI personalizes these; it does not replace them.
// Rules: warm, non-clinical, "may"/"often", ends with forward momentum.
export const fallbackExplanation: Record<StateLabel, string> = {
  Overactivated:
    "Your system is running hot right now — a racing mind and a body that's bracing for something often go hand in hand. This kind of high-alert state makes complete sense as a response to pressure, even when nothing is immediately wrong. A short reset may help take the edge off and give your mind and body a chance to ease down.",

  "Tense & Overloaded":
    "It often looks like too much coming in at once — the kind of state where your shoulders creep up, your jaw stays tight, and your mind feels crowded with things you haven't been able to put down. Carrying that kind of load for a while tends to build up in the body before the mind notices it. A few minutes of deliberate release may help create some breathing room.",

  "Wired but Tired":
    "This state often shows up when you've been pushing through for a while — tired enough to want to stop, but too activated to actually rest. It's a frustrating middle gear that tends to keep you stuck running on fumes. A reset focused on steadying rather than switching off may help your system find a more comfortable rhythm.",

  "Foggy & Depleted":
    "Low energy and a foggy head often come together after stretches of output without much recovery — your body and mind are running on less than they need. Starting anything can feel harder than it should, and that heaviness makes complete sense in this state. A gentle reset may help lift the fog just enough to give you some traction.",

  "Shut Down":
    "When everything feels distant or flat, that numbness is often a sign your system has pulled back to protect itself — not a sign that something is permanently wrong. This kind of disconnected state usually responds slowly to effort, so keeping things simple and low-demand is usually the right call. A small, gentle reset may help you find a bit more presence without asking too much of yourself right now.",
};

// Closing messages — shown after feedback is submitted.
// Rules: 1–2 sentences, non-judgmental, no certainty claims, warm and human.
export const closingMessage: Record<Outcome, string> = {
  better:
    "Good to hear. Small moments like this can add up more than they seem.",

  same:
    "That's useful to know. Some days a reset shifts things, other days it just holds the line — and that counts too.",

  worse:
    "Thanks for being honest. Sometimes a technique doesn't land, and that's worth knowing. You can always try a different one.",
};
