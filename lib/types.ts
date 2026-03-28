export type StateLabel =
  | "Overactivated"
  | "Tense & Overloaded"
  | "Wired but Tired"
  | "Foggy & Depleted"
  | "Shut Down";

export type Context = "private" | "desk" | "public" | "car" | "bed";

export type TechniqueType =
  | "Breathing"
  | "Movement"
  | "Physical Sensation"
  | "Mental & Grounding";

export type Outcome = "better" | "same" | "worse";

export type SessionPhase =
  | "idle"
  | "checking-in"
  | "analyzing"
  | "result"
  | "resetting"
  | "feedback"
  | "complete";

export type Signal = {
  id: string;
  label: string;
  category: "physical" | "mental" | "emotional" | "behavioral";
  weights: Record<StateLabel, number>;
};

export type Technique = {
  id: string;
  name: string;
  type: TechniqueType;
  allowedContexts: Context[];
  requiresPrivacy: boolean;
  requiresClosedEyes: boolean;
  durationOptions: ("30s" | "2min" | "5min")[];
  isBreatheWork: boolean;
  defaultSteps: string[];
  defaultWhy: string;
};

export type CheckinSession = {
  session_id: string;
  signals: string[];
  context: Context | null;
  checkin_id: string | null;
  state: StateLabel | null;
  explanation: string | null;
  state_result_id: string | null;
  technique: Technique | null;
  steps: string[];
  why: string | null;
  reset_plan_id: string | null;
  outcome: Outcome | null;
  phase: SessionPhase;
};
