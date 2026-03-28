import type { StateLabel, Context, Technique } from "@/lib/types";

// ─── Shared technique definitions ────────────────────────────────────────────
// Techniques that appear in multiple state × context slots are defined once here
// so their allowedContexts and content stay consistent.

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

// ─── Reset Library ────────────────────────────────────────────────────────────

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

    public: [
      {
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
          "When your mind is racing, it's often pulled away from where you actually are. Moving through your senses may help bring you back to this moment — where there's usually much less urgency than your thoughts suggest.",
      },
    ],

    car: [
      {
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
      },
    ],

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

    public: [
      {
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
      },
    ],

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

  // ── Remaining states (populated in T013b) ──────────────────────────────────

  "Wired but Tired": {
    private: [] as Technique[],
    desk: [] as Technique[],
    public: [] as Technique[],
    car: [] as Technique[],
    bed: [] as Technique[],
  },

  "Foggy & Depleted": {
    private: [] as Technique[],
    desk: [] as Technique[],
    public: [] as Technique[],
    car: [] as Technique[],
    bed: [] as Technique[],
  },

  "Shut Down": {
    private: [] as Technique[],
    desk: [] as Technique[],
    public: [] as Technique[],
    car: [] as Technique[],
    bed: [] as Technique[],
  },
};

// ─── Selection function ────────────────────────────────────────────────────────

export function selectTechnique(state: StateLabel, context: Context): Technique {
  const candidates = resetLibrary[state][context];
  // MVP: always return first technique.
  // Post-MVP: rotate based on session history to avoid repetition.
  return candidates[0];
}
