import type { Signal } from "@/lib/types";

// Weight scale: 3 = strongly associated, 2 = moderately, 1 = weakly, 0 = not associated.
// T010b will extend this table with Emotional + Behavioral signals.
export const SIGNAL_TABLE: Record<string, Signal> = {
  // ── Physical ────────────────────────────────────────────────────────────────

  "heart-racing": {
    id: "heart-racing",
    label: "Heart beating fast or pounding",
    category: "physical",
    weights: {
      Overactivated: 3,
      "Tense & Overloaded": 2,
      "Wired but Tired": 2,
      "Foggy & Depleted": 0,
      "Shut Down": 0,
    },
  },

  "tight-chest": {
    id: "tight-chest",
    label: "Tight chest or hard to breathe deeply",
    category: "physical",
    weights: {
      Overactivated: 3,
      "Tense & Overloaded": 3,
      "Wired but Tired": 1,
      "Foggy & Depleted": 0,
      "Shut Down": 0,
    },
  },

  "shallow-breathing": {
    id: "shallow-breathing",
    label: "Shallow or fast breathing",
    category: "physical",
    weights: {
      Overactivated: 3,
      "Tense & Overloaded": 2,
      "Wired but Tired": 2,
      "Foggy & Depleted": 0,
      "Shut Down": 0,
    },
  },

  "jaw-clenched": {
    id: "jaw-clenched",
    label: "Jaw clenched or teeth grinding",
    category: "physical",
    weights: {
      Overactivated: 1,
      "Tense & Overloaded": 3,
      "Wired but Tired": 2,
      "Foggy & Depleted": 0,
      "Shut Down": 0,
    },
  },

  "shoulders-tense": {
    id: "shoulders-tense",
    label: "Shoulders raised or tense",
    category: "physical",
    weights: {
      Overactivated: 1,
      "Tense & Overloaded": 3,
      "Wired but Tired": 2,
      "Foggy & Depleted": 0,
      "Shut Down": 0,
    },
  },

  "stomach-tight": {
    id: "stomach-tight",
    label: "Stomach tight or uneasy",
    category: "physical",
    weights: {
      Overactivated: 2,
      "Tense & Overloaded": 2,
      "Wired but Tired": 2,
      "Foggy & Depleted": 1,
      "Shut Down": 1,
    },
  },

  "body-heavy": {
    id: "body-heavy",
    label: "Body feels heavy or hard to move",
    category: "physical",
    weights: {
      Overactivated: 0,
      "Tense & Overloaded": 0,
      "Wired but Tired": 1,
      "Foggy & Depleted": 3,
      "Shut Down": 3,
    },
  },

  "physically-tired": {
    id: "physically-tired",
    label: "Physically tired but mentally wired",
    category: "physical",
    weights: {
      Overactivated: 0,
      "Tense & Overloaded": 1,
      "Wired but Tired": 3,
      "Foggy & Depleted": 2,
      "Shut Down": 1,
    },
  },

  "exhausted-flat": {
    id: "exhausted-flat",
    label: "Exhausted and emotionally flat",
    category: "physical",
    weights: {
      Overactivated: 0,
      "Tense & Overloaded": 0,
      "Wired but Tired": 1,
      "Foggy & Depleted": 2,
      "Shut Down": 3,
    },
  },

  // ── Mental ───────────────────────────────────────────────────────────────────

  "racing-thoughts": {
    id: "racing-thoughts",
    label: "Racing or rushing thoughts",
    category: "mental",
    weights: {
      Overactivated: 3,
      "Tense & Overloaded": 2,
      "Wired but Tired": 3,
      "Foggy & Depleted": 0,
      "Shut Down": 0,
    },
  },

  "mind-blank": {
    id: "mind-blank",
    label: "Mind gone blank or can't think",
    category: "mental",
    weights: {
      Overactivated: 0,
      "Tense & Overloaded": 1,
      "Wired but Tired": 1,
      "Foggy & Depleted": 2,
      "Shut Down": 3,
    },
  },

  "cant-focus": {
    id: "cant-focus",
    label: "Can't focus or concentrate",
    category: "mental",
    weights: {
      Overactivated: 1,
      "Tense & Overloaded": 2,
      "Wired but Tired": 3,
      "Foggy & Depleted": 3,
      "Shut Down": 2,
    },
  },

  "cant-decide": {
    id: "cant-decide",
    label: "Can't make decisions",
    category: "mental",
    weights: {
      Overactivated: 1,
      "Tense & Overloaded": 2,
      "Wired but Tired": 2,
      "Foggy & Depleted": 3,
      "Shut Down": 2,
    },
  },

  "foggy-headed": {
    id: "foggy-headed",
    label: "Foggy or unclear head",
    category: "mental",
    weights: {
      Overactivated: 0,
      "Tense & Overloaded": 1,
      "Wired but Tired": 2,
      "Foggy & Depleted": 3,
      "Shut Down": 2,
    },
  },
};
