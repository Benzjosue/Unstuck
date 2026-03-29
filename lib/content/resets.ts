import type { StateLabel, Context, Technique } from "@/lib/types";

// ─── Shared technique definitions ─────────────────────────────────────────────
// Techniques used in multiple state × context slots are defined once here so
// their allowedContexts, steps, and brand copy stay consistent.

const resonanceBreathing: Technique = {
  id: "resonance-breathing",
  name: "Resonance Breathing",
  type: "Breathing",
  allowedContexts: ["private", "desk", "bed"],
  requiresPrivacy: false,
  requiresClosedEyes: false,
  durationOptions: ["2min", "5min"],
  isBreatheWork: true,
  defaultSteps: [
    "Breathe in slowly through your nose for about 5 counts.",
    "Breathe out slowly through your nose or mouth for about 5 counts.",
    "Keep the rhythm steady and even — in and out at roughly the same pace.",
    "Let your belly rise on the inhale and fall on the exhale.",
    "If your mind wanders, just return to counting — nothing else to do.",
  ],
  defaultWhy:
    "Slow, steady breathing at about five or six breaths per minute may help your heart and breath find a natural rhythm together. It's a gentle way to let your system know it's safe to ease off.",
};

const extendedExhale: Technique = {
  id: "extended-exhale",
  name: "Extended Exhale Breathing",
  type: "Breathing",
  allowedContexts: ["private", "desk", "public", "car", "bed"],
  requiresPrivacy: false,
  requiresClosedEyes: false,
  durationOptions: ["2min", "5min"],
  isBreatheWork: true,
  defaultSteps: [
    "Breathe in through your nose for about 4 counts — relaxed, not forced.",
    "Breathe out slowly for about 6–8 counts — longer than your inhale.",
    "Let the exhale be natural, not strained. Just let it go a little further than usual.",
    "If you're driving, keep your eyes open and hands steady — the breath is quiet and invisible.",
    "Repeat at whatever pace feels easy.",
  ],
  defaultWhy:
    "Making your exhale longer than your inhale is one of the simplest ways to ease a racing system. You can do this completely silently whether you're in traffic or parked.",
};

const shoulderJawRelease: Technique = {
  id: "shoulder-jaw-release",
  name: "Shoulder & Jaw Release",
  type: "Movement",
  allowedContexts: ["private", "desk", "public", "car", "bed"],
  requiresPrivacy: false,
  requiresClosedEyes: false,
  durationOptions: ["2min", "5min"],
  isBreatheWork: false,
  defaultSteps: [
    "Let your jaw drop slightly and notice if your teeth were touching — let them separate.",
    "Roll your shoulders up toward your ears, hold for 3 seconds, then let them drop completely.",
    "Gently tilt your head to one side until you feel a light stretch in your neck — hold 5 seconds, then switch sides.",
    "Move your chin slowly left and right a few times, then let your jaw go soft.",
    "Take one slow breath out and notice where your shoulders land.",
  ],
  defaultWhy:
    "Your jaw and shoulders often carry tension you've stopped noticing. Taking even 90 seconds to deliberately release them may help your whole upper body settle — and often your mind follows.",
};

const fiveSensesGrounding: Technique = {
  id: "five-senses-grounding",
  name: "Five Senses Grounding",
  type: "Mental & Grounding",
  allowedContexts: ["private", "desk", "public", "car", "bed"],
  requiresPrivacy: false,
  requiresClosedEyes: false,
  durationOptions: ["2min", "5min"],
  isBreatheWork: false,
  defaultSteps: [
    "Without moving, slowly name 5 things you can see around you.",
    "Notice 4 things you can physically feel right now — the floor, your clothes, the air on your skin.",
    "Tune into 3 things you can hear, even if they're quiet or far away.",
    "Notice 2 things you can smell, or simply the quality of the air.",
    "Notice 1 thing you can taste, or just take one quiet breath.",
  ],
  defaultWhy:
    "When your mind is racing or your attention has drifted, moving through your senses may help bring you back to where you actually are — where there's usually less urgency than your thoughts suggest.",
};

const selfSoothingTouch: Technique = {
  id: "self-soothing-touch",
  name: "Self-Soothing Touch",
  type: "Physical Sensation",
  allowedContexts: ["private", "desk", "public", "car", "bed"],
  requiresPrivacy: false,
  requiresClosedEyes: false,
  durationOptions: ["2min", "5min"],
  isBreatheWork: false,
  defaultSteps: [
    "Bring one hand to the centre of your chest and feel its warmth.",
    "Take a slow breath in, and with it, press your hand gently against your chest.",
    "On the exhale, let the pressure soften — keep your hand resting there.",
    "If it helps, place your other hand on top.",
    "Stay here for a few slow breaths — there's nothing to do except feel the warmth.",
  ],
  defaultWhy:
    "Touch can reach something that words often can't. Placing your hand on your chest may offer a quiet signal of safety. It's invisible from the outside and can be done anywhere.",
};

const affectLabeling: Technique = {
  id: "affect-labeling",
  name: "Affect Labeling",
  type: "Mental & Grounding",
  allowedContexts: ["private", "desk", "public", "car", "bed"],
  requiresPrivacy: false,
  requiresClosedEyes: false,
  durationOptions: ["2min", "5min"],
  isBreatheWork: false,
  defaultSteps: [
    "Pause and ask yourself: what am I actually feeling right now?",
    "Try to put a word or two on it — not a story, just a label. 'Numb.' 'Flat.' 'Far away.' 'Empty.'",
    "Say it quietly to yourself, or just let it sit in your mind for a moment.",
    "Notice if anything shifts — you don't need it to shift, just observe.",
    "If there's something else underneath, name that too.",
  ],
  defaultWhy:
    "Naming what you're feeling may create a small but real shift in how your brain processes it. Even one honest word — 'I feel flat' — can help you move from being inside the feeling to having a little distance from it.",
};

const rhythmicMuscleTension: Technique = {
  id: "rhythmic-muscle-tension",
  name: "Rhythmic Foot Press",
  type: "Movement",
  allowedContexts: ["private", "desk", "public", "car", "bed"],
  requiresPrivacy: false,
  requiresClosedEyes: false,
  durationOptions: ["2min", "5min"],
  isBreatheWork: false,
  defaultSteps: [
    "Place both feet flat on the floor.",
    "Press your feet down firmly into the floor and hold for 5 seconds.",
    "Release completely and notice the brief sensation.",
    "Press again for 5 seconds — you can vary the pressure.",
    "Repeat 6–8 times at a steady, unhurried rhythm.",
  ],
  defaultWhy:
    "Rhythmic, low-level muscle engagement may help gently raise your energy and sharpen your attention. You can do this anywhere — no one around you will notice.",
};

// ─── Reset Library ─────────────────────────────────────────────────────────────

export const resetLibrary: Record<StateLabel, Record<Context, Technique[]>> = {
  // ── Overactivated ──────────────────────────────────────────────────────────
  // Goal: lower arousal quickly. High alert, racing thoughts, bracing.

  Overactivated: {
    private: [
      {
        id: "cyclic-sighing",
        name: "Cyclic Sighing",
        type: "Breathing",
        allowedContexts: ["private", "desk", "bed"],
        requiresPrivacy: false,
        requiresClosedEyes: false,
        durationOptions: ["2min", "5min"],
        isBreatheWork: true,
        defaultSteps: [
          "Breathe in slowly through your nose until your lungs feel about three-quarters full.",
          "Take one more short sniff to top up your lungs completely.",
          "Breathe out through your mouth — long, slow, and all the way out.",
          "Let the exhale finish completely before your next breath in.",
          "Repeat at your own pace — there's no rush.",
        ],
        defaultWhy:
          "Your exhale is what slows things down. The double inhale followed by a long release may help your body shift out of high alert. Many people notice their chest and shoulders soften within just a few cycles.",
      },
    ],

    desk: [
      {
        id: "box-breathing",
        name: "Box Breathing",
        type: "Breathing",
        allowedContexts: ["private", "desk", "public", "car", "bed"],
        requiresPrivacy: false,
        requiresClosedEyes: false,
        durationOptions: ["2min", "5min"],
        isBreatheWork: true,
        defaultSteps: [
          "Breathe in slowly through your nose for a count of 4.",
          "Hold your breath gently for a count of 4.",
          "Breathe out through your mouth or nose for a count of 4.",
          "Hold at the bottom — lungs empty — for a count of 4.",
          "That's one cycle. Repeat without strain.",
        ],
        defaultWhy:
          "Equal counts in and out may help your body find a steadier rhythm. The brief holds give your system a moment to pause. You can do this completely silently — no one needs to know.",
      },
    ],

    public: [fiveSensesGrounding],

    car: [extendedExhale],

    bed: [resonanceBreathing],
  },

  // ── Tense & Overloaded ─────────────────────────────────────────────────────
  // Goal: release tension, lighten load. Jaw/neck tight, crowded mind.

  "Tense & Overloaded": {
    private: [
      {
        id: "progressive-muscle-relaxation",
        name: "Progressive Muscle Relaxation",
        type: "Movement",
        allowedContexts: ["private", "bed"],
        requiresPrivacy: true,
        requiresClosedEyes: false,
        durationOptions: ["5min"],
        isBreatheWork: false,
        defaultSteps: [
          "Starting with your feet, squeeze all the muscles there as tightly as you can for 5 seconds.",
          "Release completely and notice the difference — stay with the softness for about 10 seconds.",
          "Move up through your body: calves, thighs, stomach, hands, arms, shoulders.",
          "For each group: squeeze hard for 5 seconds, then let go fully.",
          "Finish by squeezing your whole face tight for 5 seconds, then releasing everything at once.",
        ],
        defaultWhy:
          "Deliberately tensing muscles before releasing them may help your body recognise and let go of tension it's been holding without realising. Many people feel noticeably heavier and calmer after going through even a few groups.",
      },
    ],

    desk: [shoulderJawRelease],

    public: [selfSoothingTouch],

    car: [shoulderJawRelease],

    bed: [
      {
        id: "body-scan-exhale",
        name: "Body Scan with Exhale Release",
        type: "Breathing",
        allowedContexts: ["private", "bed"],
        requiresPrivacy: false,
        requiresClosedEyes: false,
        durationOptions: ["2min", "5min"],
        isBreatheWork: true,
        defaultSteps: [
          "Lie still and take one slow breath in through your nose.",
          "As you breathe out, soften your jaw and let your face go slack.",
          "Take another breath in, and on the exhale, let your shoulders drop away from your neck.",
          "Continue breathing this way — with each exhale, pick one part of your body to soften.",
          "Move down slowly: chest, belly, hands, legs — no rush, no force.",
        ],
        defaultWhy:
          "Pairing your exhale with a conscious release may help tension unwind gradually rather than all at once. Doing this lying down gives your muscles permission to stop working for a while.",
      },
    ],
  },

  // ── Wired but Tired ────────────────────────────────────────────────────────
  // Goal: stabilise — not sedate. Exhausted but can't settle, stuck mid-gear.

  "Wired but Tired": {
    private: [
      {
        id: "brain-dump",
        name: "Brain Dump",
        type: "Mental & Grounding",
        allowedContexts: ["private", "desk"],
        requiresPrivacy: false,
        requiresClosedEyes: false,
        durationOptions: ["2min", "5min"],
        isBreatheWork: false,
        defaultSteps: [
          "Grab a piece of paper or open a notes app.",
          "Set a 3-minute timer.",
          "Write everything that's in your head — no editing, no organising, no sentences required.",
          "Fragments, half-thoughts, worries, to-dos — anything goes.",
          "When the timer stops, put it down. You don't need to read it back.",
        ],
        defaultWhy:
          "When your mind is full and your body is tired, the loop won't stop on its own. Getting the contents of an overloaded mind onto paper may create just enough mental space to actually rest.",
      },
    ],

    desk: [affectLabeling],

    public: [fiveSensesGrounding],

    car: [extendedExhale],

    bed: [
      {
        id: "settling-breath",
        name: "Settling Breath",
        type: "Breathing",
        allowedContexts: ["private", "desk", "bed"],
        requiresPrivacy: false,
        requiresClosedEyes: false,
        durationOptions: ["2min", "5min"],
        isBreatheWork: true,
        defaultSteps: [
          "Lie still and let your body sink into whatever you're lying on.",
          "Breathe in through your nose for 4 counts.",
          "Breathe out slowly through your mouth for 7–8 counts — longer than the inhale.",
          "Don't force the next breath — let it come naturally.",
          "Keep going at this pace — no agenda, just the breath.",
        ],
        defaultWhy:
          "When you're exhausted but your mind won't let go, a long, slow exhale may gently signal that it's safe to stop for now. This isn't about falling asleep — it's about giving your system permission to ease off.",
      },
    ],
  },

  // ── Foggy & Depleted ──────────────────────────────────────────────────────
  // Goal: gently re-energise. Slow, drained, muddy, hard to start anything.

  "Foggy & Depleted": {
    private: [
      {
        id: "brisk-micro-movement",
        name: "Brisk Micro-Movement",
        type: "Movement",
        allowedContexts: ["private", "desk", "public"],
        requiresPrivacy: false,
        requiresClosedEyes: false,
        durationOptions: ["2min", "5min"],
        isBreatheWork: false,
        defaultSteps: [
          "Stand up if you can — if not, stay seated.",
          "Shake your hands loosely for 15 seconds, like you're air-drying them.",
          "Roll your shoulders back 5 times, then forward 5 times.",
          "If you're standing, march in place for 30 seconds — knees coming up slightly.",
          "Take one full breath in through your nose and out through your mouth.",
        ],
        defaultWhy:
          "Gentle, physical movement may help shift low energy and mild fogginess. Even small movements can signal to your body that it's time to re-engage — without demanding much from it.",
      },
    ],

    desk: [rhythmicMuscleTension],

    public: [fiveSensesGrounding],

    car: [rhythmicMuscleTension],

    bed: [selfSoothingTouch],
  },

  // ── Shut Down ──────────────────────────────────────────────────────────────
  // Goal: restore safe engagement. Numb, disconnected, frozen, far away.
  // These techniques must be gentle and low-effort — the user has very little capacity.

  "Shut Down": {
    private: [selfSoothingTouch],

    desk: [affectLabeling],

    public: [fiveSensesGrounding],

    car: [affectLabeling],

    bed: [selfSoothingTouch],
  },
};

// ─── Selection function ────────────────────────────────────────────────────────

export function selectTechnique(state: StateLabel, context: Context): Technique {
  const candidates = resetLibrary[state][context];
  // MVP: always return first technique.
  // Post-MVP: rotate based on session history to avoid repetition.
  return candidates[0];
}
