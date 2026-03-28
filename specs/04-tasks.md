# Phase 4: Tasks — Ordered Implementation Plan
# Unstuck MVP

**Document type:** Phase 4 Tasks
**Status:** Final — Revised
**Governed by:** `CLAUDE.md` (Phase 1 Constitution)
**Informed by:** `specs/02-mvp-spec.md` (Phase 2 Spec) · `specs/03-mvp-plan.md` (Phase 3 Plan)
**Next phase:** Phase 5 — Implementation (Claude Code executes tasks in order)

---

## 1. Document Purpose

This document translates the Phase 3 Plan into a dependency-aware, ordered task list for implementation. Each task is small enough to implement in one Claude Code session, has an explicit done condition, and references its dependencies so nothing is built out of order.

Phase 5 (Implementation) executes these tasks one at a time, in order, without skipping ahead.

---

## 2. Task Generation Principles

- **One task = one implementable unit.** If a task takes more than ~45 minutes, it should be split.
- **Dependencies are explicit.** Every task lists what must be done first.
- **Done conditions are binary.** A task is complete or it is not. Partial completion is not done.
- **Checkpoints are non-negotiable.** Two hard stops are embedded in the sequence. The next milestone does not begin until the checkpoint passes.
- **Core tasks and stretch tasks are mutually exclusive.** Stretch tasks have their own section and their own numbering (S-prefix). They are never mixed into the core sequence.
- **Content before wiring.** Logic and content are written before UI. UI is built before it is wired. Wiring happens before AI is added.

---

## 3. Implementation Strategy

Build in six milestones. Each milestone builds on the last and produces something testable.

```
M0: Foundation          → project exists, DB exists, env vars set
M1: Logic + Content     → scoring works, library complete, fallbacks written
M2: Static UI           → all screens exist, navigable, no real data
M3: First Vertical Slice → full loop works without AI
         ↓
    [CHECKPOINT: loop works end-to-end, all 4 DB tables populated]
         ↓
M4: AI Integration      → OpenAI wired, fallback verified
         ↓
    [CHECKPOINT: loop works with AI on AND with API key killed]
         ↓
M5: Polish + Quality    → animations, loading states, errors, mobile QA
M6: Final Gate + Deploy → Definition of Done checklist, Vercel deploy, timed demo
```

**The rule during implementation:** Complete every task in a milestone before starting the next. Do not skip ahead. Do not start M4 until T053 passes. Do not start M5 until T059 passes.

---

## 4. Milestones / Build Phases

| Milestone | Name | Tasks | Gate |
|-----------|------|-------|------|
| M0 | Foundation | T001–T008 | Supabase insert verified |
| M1 | Logic + Content | T009–T023 | Types + scoring + library + context ready |
| M2 | Static UI | T024–T042 | All 5 screens navigable with placeholder data |
| M3 | First Vertical Slice | T043–T053 | Full loop works, DB populated, route guards active |
| — | **CHECKPOINT** | **T053** | **Hard stop — loop verified before AI** |
| M4 | AI Integration | T054–T058 | AI and fallback both work |
| — | **CHECKPOINT** | **T059** | **Hard stop — fallback verified** |
| M5 | Polish + Quality | T060–T071 | Animations, errors, mobile, safety |
| M6 | Final Gate + Deploy | T072–T076 | DoD checklist passed, deployed, demoed |

---

## 5. Dependency-Ordered Task List

---

### M0 — Foundation
*Goal: The project exists, the database is ready, and environment variables are configured. Nothing else can start until this milestone is complete.*

---

**T001**
**Title:** Initialize Next.js 14 project
**Objective:** Create the project with TypeScript strict mode, App Router, and Tailwind CSS.
**Dependencies:** None
**Deliverable:** `npx create-next-app@latest` complete with TypeScript, ESLint, Tailwind, App Router selected. `tsconfig.json` has `"strict": true`. Project runs on `localhost:3000`.
**Notes:** Project name: `unstuck`. Accept all defaults except: no `src/` directory — use the root `app/` structure from Phase 3 Plan.

---

**T002**
**Title:** Configure Tailwind with Unstuck brand color tokens
**Objective:** Add all brand colors to `tailwind.config.ts` so Tailwind utility classes are available throughout the project.
**Dependencies:** T001
**Deliverable:** `tailwind.config.ts` extends `colors` with the following tokens, all usable as Tailwind classes (e.g., `bg-brand-teal`, `text-brand-slate`):
```
brand-slate:       #2C3E50
brand-teal:        #3D7A8A
brand-teal-light:  #EAF4F6
brand-warm:        #E07A5F
brand-warm-light:  #FDF0ED
brand-mist:        #F4F6F7
brand-mid:         #7F8C8D
brand-border:      #E5E7EB
```

---

**T003**
**Title:** Install and configure shadcn/ui
**Objective:** Set up the shadcn/ui component library for use throughout the project.
**Dependencies:** T001, T002
**Deliverable:** `npx shadcn@latest init` complete. Style: Default. Base color: Slate. CSS variables: yes. Minimum components installed: `button`, `card`, `accordion`.
**Notes:** Do not install every component. Install only what is needed, when it is needed.

---

**T004**
**Title:** Install Framer Motion
**Objective:** Add Framer Motion for screen transition animations.
**Dependencies:** T001
**Deliverable:** `npm install framer-motion` complete. A quick smoke test confirms `import { motion } from 'framer-motion'` works without errors.

---

**T005**
**Title:** Create the full folder structure
**Objective:** Create all directories and empty placeholder files per the Phase 3 Plan folder structure.
**Dependencies:** T001
**Deliverable:** The following directories exist (files can be empty for now):
```
app/
  checkin/
  result/
  reset/
  feedback/
  api/analyze/
  api/reset/
  api/feedback/
components/
  shared/
  checkin/
  result/
  reset/
  feedback/
lib/
  context/
  state-detection/
  content/
  openai/
  supabase/
```

---

**T006**
**Title:** Configure environment variables
**Objective:** Create `.env.local` with all required variable names and a `.env.example` with placeholder values for documentation.
**Dependencies:** T001
**Deliverable:** `.env.local` exists locally with all four required keys (values filled in by developer). `.env.example` committed to repo with empty values. The four keys:
```
OPENAI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```
**Notes:** `.env.local` must be in `.gitignore`. Never commit actual key values.

---

**T007**
**Title:** Create Supabase project and run table migrations
**Objective:** Create the Supabase project and initialize all four database tables.
**Dependencies:** T006
**Deliverable:** A Supabase project exists. The following SQL is executed in the Supabase SQL editor and all four tables are created successfully:
```sql
CREATE TABLE checkins (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  signals    TEXT[] NOT NULL,
  context    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE state_results (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checkin_id  UUID NOT NULL,
  session_id  TEXT NOT NULL,
  state_label TEXT NOT NULL,
  explanation TEXT NOT NULL,
  ai_used     BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reset_plans (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_result_id  UUID NOT NULL,
  session_id       TEXT NOT NULL,
  technique_id     TEXT NOT NULL,
  technique_name   TEXT NOT NULL,
  technique_type   TEXT NOT NULL,
  duration_selected TEXT,
  steps            TEXT[] NOT NULL,
  why              TEXT NOT NULL,
  ai_used          BOOLEAN DEFAULT TRUE,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE feedback (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reset_plan_id UUID NOT NULL,
  session_id    TEXT NOT NULL,
  outcome       TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```
**Notes:** No RLS for MVP. Confirm all four tables appear in the Supabase table editor.

---

**T008**
**Title:** Verify Supabase server connection
**Objective:** Confirm the service role key can write to Supabase before any application logic is built.
**Dependencies:** T006, T007
**Deliverable:** A temporary test script (can be a Next.js API route at `/api/test-db`) successfully inserts a row into the `checkins` table and returns the inserted ID. After verification, delete the test route.
**Notes:** This is a setup verification step — not production code. Delete after confirming.

---

### M1 — Logic + Content
*Goal: All core logic, content, and data structures are written. No UI. No wiring. Just the pieces that everything else will depend on.*

---

**T009**
**Title:** Write all TypeScript types in `lib/types.ts`
**Objective:** Define every shared type used across the application. All future files import from here — no local type definitions for shared concepts.
**Dependencies:** T005
**Deliverable:** `lib/types.ts` exports the following types with no `any`:
```typescript
type StateLabel = 'Overactivated' | 'Tense & Overloaded' | 'Wired but Tired' | 'Foggy & Depleted' | 'Shut Down'
type Context = 'private' | 'desk' | 'public' | 'car' | 'bed'
type TechniqueType = 'Breathing' | 'Movement' | 'Physical Sensation' | 'Mental & Grounding'
type Outcome = 'better' | 'same' | 'worse'
type SessionPhase = 'idle' | 'checking-in' | 'analyzing' | 'result' | 'resetting' | 'feedback' | 'complete'

type Signal = {
  id: string
  label: string
  category: 'physical' | 'mental' | 'emotional' | 'behavioral'
  weights: Record<StateLabel, number>
}

type Technique = {
  id: string
  name: string
  type: TechniqueType
  allowedContexts: Context[]
  requiresPrivacy: boolean
  requiresClosedEyes: boolean
  durationOptions: ('30s' | '2min' | '5min')[]
  isBreatheWork: boolean
  defaultSteps: string[]
  defaultWhy: string
}

type CheckinSession = {
  session_id: string
  signals: string[]
  context: Context | null
  checkin_id: string | null
  state: StateLabel | null
  explanation: string | null
  state_result_id: string | null
  technique: Technique | null
  steps: string[]
  why: string | null
  reset_plan_id: string | null
  outcome: Outcome | null
  phase: SessionPhase
}
```

---

**T010a**
**Title:** Write Physical + Mental signals in `lib/state-detection/signals.ts`
**Objective:** Define the first 14 signals (Physical and Mental categories) with user-facing labels and weight tables for all five states. Create the `SIGNAL_TABLE` structure that T010b will extend.
**Dependencies:** T009
**Deliverable:** `lib/state-detection/signals.ts` creates and exports `SIGNAL_TABLE: Record<string, Signal>` with these 14 entries:

| ID | Label | Category |
|----|-------|----------|
| `heart-racing` | Heart beating fast or pounding | physical |
| `tight-chest` | Tight chest or hard to breathe deeply | physical |
| `shallow-breathing` | Shallow or fast breathing | physical |
| `jaw-clenched` | Jaw clenched or teeth grinding | physical |
| `shoulders-tense` | Shoulders raised or tense | physical |
| `stomach-tight` | Stomach tight or uneasy | physical |
| `body-heavy` | Body feels heavy or hard to move | physical |
| `physically-tired` | Physically tired but mentally wired | physical |
| `exhausted-flat` | Exhausted and emotionally flat | physical |
| `racing-thoughts` | Racing or rushing thoughts | mental |
| `mind-blank` | Mind gone blank or can't think | mental |
| `cant-focus` | Can't focus or concentrate | mental |
| `cant-decide` | Can't make decisions | mental |
| `foggy-headed` | Foggy or unclear head | mental |

Weight guidelines: 3 = strongly associated, 2 = moderately, 1 = weakly, 0 = not associated. High arousal/activation signals → higher weights for `Overactivated` and `Tense & Overloaded`. Low energy/shutdown signals → higher weights for `Foggy & Depleted` and `Shut Down`. Mixed signals → higher weight for `Wired but Tired`.

---

**T010b**
**Title:** Write Emotional + Behavioral signals in `lib/state-detection/signals.ts`
**Objective:** Add the remaining 12 signals (Emotional and Behavioral categories) to the existing `SIGNAL_TABLE`.
**Dependencies:** T010a
**Deliverable:** `SIGNAL_TABLE` in `lib/state-detection/signals.ts` is extended with these 12 entries (total: 26 signals):

| ID | Label | Category |
|----|-------|----------|
| `anxious` | Anxious or on edge | emotional |
| `irritable` | Irritable or easily frustrated | emotional |
| `overwhelmed` | Overwhelmed or flooded | emotional |
| `emotionally-flat` | Emotionally numb or flat | emotional |
| `detached` | Disconnected or detached from things | emotional |
| `low-mood` | Low mood or quietly sad | emotional |
| `dread` | Sense of dread or doom | emotional |
| `scrolling-mindless` | Mindlessly scrolling or can't stop | behavioral |
| `avoiding-tasks` | Avoiding things you need to do | behavioral |
| `snapping` | Snapping at people or easily reactive | behavioral |
| `cant-stop-working` | Can't stop working even when tired | behavioral |
| `withdrawing` | Withdrawing or going quiet | behavioral |

Apply the same weight guidelines as T010a. Emotional flatness, detachment, low mood, and withdrawing → higher weights for `Shut Down` and `Foggy & Depleted`. Anxiety, irritability, overwhelm → higher weights for `Overactivated` and `Tense & Overloaded`.

---

**T011**
**Title:** Write `detectState()` scoring function in `lib/state-detection/logic.ts`
**Objective:** Implement the rule-based weighted scoring algorithm that takes selected signal IDs and returns the winning `StateLabel`.
**Dependencies:** T009, T010b
**Deliverable:** `lib/state-detection/logic.ts` exports:
```typescript
function detectState(selectedSignalIds: string[]): StateLabel
```
Algorithm: for each selected signal ID, look up its weights in `SIGNAL_TABLE` and add each weight to the corresponding state's running total. Return the state with the highest total. Tie-breaking priority order: `Overactivated → Tense & Overloaded → Wired but Tired → Foggy & Depleted → Shut Down`.

---

**T012**
**Title:** Verify `detectState()` with representative test inputs
**Objective:** Manually confirm the scoring function returns expected states for at least 5 representative signal combinations.
**Dependencies:** T011
**Deliverable:** A simple test script (or console verification) that runs these five cases and confirms the output matches expectation:
- High-arousal signals only → `Overactivated` or `Tense & Overloaded`
- Low-energy signals only → `Foggy & Depleted` or `Shut Down`
- Mixed high arousal + exhaustion signals → `Wired but Tired`
- Overwhelm + physical tension → `Tense & Overloaded`
- Emotional flat + withdrawing + heavy body → `Shut Down`

If any result feels wrong, adjust the weight table (T010a/T010b) until it aligns.
**Notes:** This is a logic verification step. No test framework required — a script that logs results is sufficient. Delete after verifying.

---

**T013a**
**Title:** Write reset library skeleton + Overactivated + Tense & Overloaded entries in `lib/content/resets.ts`
**Objective:** Create the reset library file with the full typed structure, the `selectTechnique()` function, and complete technique entries for the first two states (10 total entries across 5 contexts each).
**Dependencies:** T009
**Deliverable:** `lib/content/resets.ts` creates and exports:
```typescript
const resetLibrary: Record<StateLabel, Record<Context, Technique[]>>
function selectTechnique(state: StateLabel, context: Context): Technique
```

All 10 entries for `Overactivated` (5 contexts) and `Tense & Overloaded` (5 contexts) are written with:
- `defaultSteps`: 3–5 plain-language steps the user can follow without additional instruction
- `defaultWhy`: 1–2 sentences in brand voice (warm, non-clinical) explaining why this may help
- `allowedContexts`: correctly set — technique only appears under contexts where it belongs
- `isBreatheWork: true` for any breathing technique
- `requiresClosedEyes: true` for any eyes-closed technique (must never appear in `car` slot)
- `requiresPrivacy: true` for any technique needing space or sound (must never appear in `public` or `car` slots)

**Context constraints — hard rules:**
- `car` slot: zero techniques with `requiresClosedEyes: true`
- `public` slot: zero techniques with `requiresPrivacy: true`

---

**T013b**
**Title:** Write reset library entries for Wired but Tired + Foggy & Depleted + Shut Down
**Objective:** Complete the remaining 15 entries in the reset library (3 states × 5 contexts).
**Dependencies:** T013a
**Deliverable:** `lib/content/resets.ts` is extended with complete entries for:
- `Wired but Tired` — 5 context entries
- `Foggy & Depleted` — 5 context entries
- `Shut Down` — 5 context entries

Same content requirements as T013a. After this task, `resetLibrary` has all 25 entries. `selectTechnique()` is already written — no changes needed to the function. All 25 slots must have at least one technique.

**Notes:** Shut Down techniques should be gentle and low-effort — this state means the user has very little capacity. Foggy & Depleted techniques should focus on gentle activation or grounding. Wired but Tired techniques should address both tension and exhaustion simultaneously.

---

**T014**
**Title:** Verify reset library context constraints
**Objective:** Confirm no technique appears in a context where it is unsafe or inappropriate.
**Dependencies:** T013b
**Deliverable:** A verification script (or manual audit) confirms:
- No `car` slot entry has `requiresClosedEyes: true`
- No `public` slot entry has `requiresPrivacy: true`
- All 25 slots (5 × 5) have at least one technique
- All `isBreatheWork: true` techniques have a `defaultSteps` entry that mentions breathing
Delete the script after verification.

---

**T015**
**Title:** Write fallback state explanations in `lib/content/fallbacks.ts`
**Objective:** Write pre-written explanations for all five states that activate when OpenAI is unavailable. These are the ground truth — AI personalizes them, it does not replace them.
**Dependencies:** T009
**Deliverable:** `lib/content/fallbacks.ts` exports:
```typescript
const fallbackExplanation: Record<StateLabel, string>
```
Each explanation is 2–3 sentences in brand voice. Must:
- Frame the state as something that makes sense, not a failure
- Use "may" or "often looks like" — never claim certainty
- End with forward momentum toward the reset
- Use zero clinical language (no: cortisol, HRV, sympathetic, dysregulation)

---

**T016**
**Title:** Write fallback closing messages in `lib/content/fallbacks.ts`
**Objective:** Write three pre-written closing messages (one per outcome) that activate after the user submits feedback.
**Dependencies:** T015
**Deliverable:** `lib/content/fallbacks.ts` also exports:
```typescript
const closingMessage: Record<Outcome, string>
```
Each message: 1–2 sentences. Must:
- Be non-judgmental regardless of outcome
- Not imply the user did something wrong if "same" or "worse"
- Not claim the technique worked if "better"
- Sound human and warm, not like an app response

---

**T017**
**Title:** Initialize Supabase browser client in `lib/supabase/client.ts`
**Objective:** Create the browser-safe Supabase client using public environment variables.
**Dependencies:** T005, T006
**Deliverable:** `lib/supabase/client.ts` exports a singleton Supabase browser client initialized with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Used only for read operations in MVP (not used for any writes).

---

**T018**
**Title:** Initialize Supabase server client in `lib/supabase/server.ts`
**Objective:** Create the server-only Supabase client using the service role key for API route writes.
**Dependencies:** T005, T006
**Deliverable:** `lib/supabase/server.ts` exports a function that returns a Supabase server client initialized with `SUPABASE_SERVICE_ROLE_KEY`. Marked server-only — must not be imported in client components. Used for all DB writes in API routes.

---

**T019**
**Title:** Initialize OpenAI client in `lib/openai/client.ts`
**Objective:** Create the OpenAI client for use in API routes.
**Dependencies:** T005, T006
**Deliverable:** `lib/openai/client.ts` exports a singleton OpenAI client initialized with `OPENAI_API_KEY`. Marked server-only. Uses the `openai` npm package (`npm install openai`). Model is never set here — it is set at the call site and must always be `gpt-4o-mini`.

---

**T020**
**Title:** Build `CheckinSessionContext` in `lib/context/session.tsx`
**Objective:** Create the React Context that holds all in-session state and is shared across all screens.
**Dependencies:** T009
**Deliverable:** `lib/context/session.tsx` exports:
- `CheckinSessionContext` — the context object
- `CheckinSessionProvider` — a client component that wraps the app and holds `CheckinSession` state
- `useCheckinSession()` — a hook that returns the context value and throws if used outside the provider
- Setter functions or a reducer for updating session state

The initial `CheckinSession` state:
```typescript
{
  session_id: '',    // set on mount
  signals: [],
  context: null,
  checkin_id: null,
  state: null,
  explanation: null,
  state_result_id: null,
  technique: null,
  steps: [],
  why: null,
  reset_plan_id: null,
  outcome: null,
  phase: 'idle',
}
```

---

**T021**
**Title:** Wrap `app/layout.tsx` with `CheckinSessionProvider` and initialize `session_id`
**Objective:** Mount the session context across the whole app and generate/retrieve the anonymous session ID from localStorage.
**Dependencies:** T020
**Deliverable:** `app/layout.tsx` wraps all children with `CheckinSessionProvider`. On mount, the provider checks localStorage for an existing `session_id`. If none exists, it generates a UUID (`crypto.randomUUID()`), writes it to localStorage, and sets it in context. If one exists, it reads it and sets it in context.
**Notes:** The localStorage read must happen client-side. Use a `useEffect` or `'use client'` boundary appropriately.

---

**T022**
**Title:** Install Supabase JS package
**Objective:** Add the Supabase client library as a project dependency before any Supabase client files are written.
**Dependencies:** T001
**Deliverable:** `npm install @supabase/supabase-js` complete. The package appears in `package.json`. Importing from `@supabase/supabase-js` resolves without error.
**Notes:** This task exists to make T017 and T018 unambiguous — run the install before writing the client files.

---

**T023**
**Title:** Confirm M1 is complete
**Objective:** Verify all logic and content files are in place before building any UI.
**Dependencies:** T009, T010b, T011, T012, T013b, T014, T015, T016, T017, T018, T019, T020, T021, T022
**Deliverable:** All of the following files exist and are non-empty:
- `lib/types.ts`
- `lib/state-detection/signals.ts` (26 signals)
- `lib/state-detection/logic.ts` (`detectState` exported)
- `lib/content/resets.ts` (25 entries, `selectTechnique` exported)
- `lib/content/fallbacks.ts` (`fallbackExplanation` and `closingMessage` exported)
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/openai/client.ts`
- `lib/context/session.tsx`

**Notes:** This is a review gate, not a code task. Run `tsc --noEmit` to confirm no TypeScript errors before proceeding to M2.

---

### M2 — Static UI
*Goal: All five screens exist and are navigable with placeholder/hardcoded data. No API calls. No real logic. Just the complete UI shell.*

---

**T024**
**Title:** Build `ScreenWrapper` shared component
**Objective:** Create a reusable wrapper that provides consistent padding, max-width, and a Framer Motion entrance animation placeholder for all screens.
**Dependencies:** T001, T002, T004
**Deliverable:** `components/shared/ScreenWrapper.tsx` renders `<div className="max-w-md mx-auto px-5 py-6">` wrapping its children. Includes a `motion.div` with opacity 0→1, y 16→0, 350ms ease-out entrance. Accepts a `className` prop for override.

---

**T025**
**Title:** Build `LoadingState` shared component
**Objective:** Create a reusable loading indicator shown during async operations.
**Dependencies:** T024
**Deliverable:** `components/shared/LoadingState.tsx` renders a centered spinner or pulse animation with an optional `message` prop (e.g., "Figuring out your state…"). Uses brand-teal color. Must appear within 200ms of mount.

---

**T026**
**Title:** Build `ErrorState` shared component
**Objective:** Create a reusable error display shown when API calls fail.
**Dependencies:** T024
**Deliverable:** `components/shared/ErrorState.tsx` renders a calm error message with an optional `onRetry` callback prop. Copy: "Something went wrong. Tap to try again." No technical error details shown to user.

---

**T027**
**Title:** Build `SignalChip` component
**Objective:** A selectable chip for individual signals on the check-in screen.
**Dependencies:** T002, T009
**Deliverable:** `components/checkin/SignalChip.tsx` accepts props: `label: string`, `selected: boolean`, `onToggle: () => void`. When `selected: false`: white background, `brand-border` border, `brand-slate` text. When `selected: true`: `brand-teal-light` background, `brand-teal` border, `brand-teal` text. Rounded-full. Tap triggers `onToggle`. Scale 0.96 on press.

---

**T028**
**Title:** Build `SignalGrid` component
**Objective:** Renders all signals grouped by category with section labels.
**Dependencies:** T027, T010b
**Deliverable:** `components/checkin/SignalGrid.tsx` accepts props: `selectedIds: string[]`, `onToggle: (id: string) => void`. Renders all signals from `SIGNAL_TABLE` grouped into four category sections: Physical, Mental, Emotional, Behavioral. Each section has a small label. Chips flow in a flex-wrap layout.

---

**T029**
**Title:** Build `ContextPicker` component
**Objective:** Renders the five context options for the user to select where they are right now.
**Dependencies:** T002, T009
**Deliverable:** `components/checkin/ContextPicker.tsx` accepts props: `selected: Context | null`, `onSelect: (context: Context) => void`. Renders five options with labels and optional icons/emoji. Options: Private space / At a desk / Out in public / In a car / Lying in bed. One option selected at a time. Selected state: `brand-teal-light` background, `brand-teal` border. Unselected: white, `brand-border` border.

---

**T030**
**Title:** Build the Landing screen (`app/page.tsx`)
**Objective:** The entry point. Calm, clear, single CTA. No data needed.
**Dependencies:** T024, T002
**Deliverable:** `app/page.tsx` renders:
- App name "Unstuck" in `brand-slate`
- Tagline: "Awareness before burnout."
- 1–2 sentences of product promise (from brand copy)
- A single CTA button: "Check in now" — navigates to `/checkin` on tap
- A small, subtle crisis resource link at the bottom (copy: "In crisis? Text or call 988")
- Background: `brand-mist`
**Notes:** No login prompt. No explanation of how the app works. Just the promise and the CTA.

---

**T031**
**Title:** Build the Check-in screen (`app/checkin/page.tsx`) — static
**Objective:** The signal selection and context picker screen with local component state only. No API call yet.
**Dependencies:** T028, T029, T024
**Deliverable:** `app/checkin/page.tsx` renders:
- A heading: "What are you noticing right now?"
- `SignalGrid` with local state for selected signal IDs
- A subheading: "Where are you right now?"
- `ContextPicker` with local state for selected context
- A submit button: "See my state" — disabled until at least 2 signals AND a context are selected
- On submit: `console.log` the signals and context (wired to real logic in M3)
**Notes:** No navigation to `/result` yet. The submit button just logs for now.

---

**T032**
**Title:** Build `StateCard` component
**Objective:** Displays the detected state name and explanation on the Result screen.
**Dependencies:** T002, T009
**Deliverable:** `components/result/StateCard.tsx` accepts props: `state: StateLabel`, `explanation: string`. Renders: state name in large `brand-slate` type, explanation text in `brand-mid`, a `brand-teal-light` background card with `rounded-2xl`. Must not use any clinical framing — the state name is displayed as-is.

---

**T033**
**Title:** Build `EducationToggle` component
**Objective:** A collapsed accordion on the Result screen for optional "Why does this happen?" content.
**Dependencies:** T002
**Deliverable:** `components/result/EducationToggle.tsx` accepts props: `content: string`. Renders a collapsed accordion using shadcn/ui `Accordion`. Label: "Why does this happen?" When expanded, shows `content`. Collapsed by default. The toggle does not change the page layout aggressively — smooth height animation.

---

**T034**
**Title:** Build the Result screen (`app/result/page.tsx`) — static
**Objective:** Displays a hardcoded placeholder state and explanation.
**Dependencies:** T032, T033, T024, T025, T026
**Deliverable:** `app/result/page.tsx` renders:
- `StateCard` with hardcoded placeholder: state = "Tense & Overloaded", explanation = "Your system is running hot right now. [Placeholder explanation]"
- `EducationToggle` with hardcoded placeholder content
- A CTA button: "Get my reset" — navigates to `/reset` on tap
- Heading: "Based on what you shared, you may be in:"
**Notes:** The real state from context replaces the placeholder in M3. No route guard yet — added in M3.

---

**T035**
**Title:** Build `TechniqueCard` component
**Objective:** Displays the technique name and type on the Reset screen.
**Dependencies:** T002, T009
**Deliverable:** `components/reset/TechniqueCard.tsx` accepts props: `name: string`, `type: TechniqueType`. Renders: technique name in `brand-slate`, a small type badge (e.g., "Breathing") in `brand-teal-light` with `brand-teal` text. `rounded-2xl` card style.

---

**T036**
**Title:** Build `StepList` component
**Objective:** Renders numbered step-by-step instructions on the Reset screen.
**Dependencies:** T002
**Deliverable:** `components/reset/StepList.tsx` accepts props: `steps: string[]`. Renders an ordered list of steps. Each step: numbered circle in `brand-teal`, step text in `brand-slate`. Clean spacing, easy to read one step at a time on mobile.

---

**T037**
**Title:** Build `DurationSelector` component
**Objective:** Lets the user pick how long they want to spend on the reset technique.
**Dependencies:** T002, T009
**Deliverable:** `components/reset/DurationSelector.tsx` accepts props: `options: ('30s' | '2min' | '5min')[]`, `selected: string | null`, `onSelect: (duration: string) => void`. Renders the options as chips in a horizontal row. One selectable at a time. Default: first option pre-selected on mount.

---

**T038**
**Title:** Build `SafetyNote` component
**Objective:** Displays a breathwork safety note when the technique involves breathing.
**Dependencies:** T002
**Deliverable:** `components/reset/SafetyNote.tsx` renders the exact copy from the Constitution: *"Stop if you feel dizzy, lightheaded, or uncomfortable."* Styled as a subtle info note (not alarming). Rendered only when `isBreatheWork: true`.

---

**T039**
**Title:** Build the Reset screen (`app/reset/page.tsx`) — static
**Objective:** Displays a hardcoded placeholder technique with full reset UI.
**Dependencies:** T035, T036, T037, T038, T024
**Deliverable:** `app/reset/page.tsx` renders:
- Heading: "Here's something to try right now"
- `TechniqueCard` with hardcoded placeholder name and type
- `SafetyNote` (hardcoded `isBreatheWork: true` for testing)
- `StepList` with 3 hardcoded placeholder steps
- A "Why this may help" section with placeholder text
- `DurationSelector` with `['30s', '2min', '5min']`
- A CTA button: "I'm done" — navigates to `/feedback` on tap
**Notes:** No route guard yet — added in M3.

---

**T040**
**Title:** Build `OutcomePicker` component
**Objective:** The three-option selector on the Feedback screen.
**Dependencies:** T002, T009
**Deliverable:** `components/feedback/OutcomePicker.tsx` accepts props: `selected: Outcome | null`, `onSelect: (outcome: Outcome) => void`. Renders three large tappable options: "Better", "Same", "Worse". One selectable at a time. Selected state: `brand-teal-light` background. Large tap targets (min 48px height).

---

**T041**
**Title:** Build `ClosingMessage` component
**Objective:** The non-judgmental response shown after the user selects an outcome.
**Dependencies:** T002
**Deliverable:** `components/feedback/ClosingMessage.tsx` accepts props: `message: string`. Renders the message in `brand-slate` with gentle styling. Appears only after an outcome is selected. Fade-in animation.

---

**T042**
**Title:** Build the Feedback screen (`app/feedback/page.tsx`) — static
**Objective:** Displays the three outcome options and a closing message after selection.
**Dependencies:** T040, T041, T024
**Deliverable:** `app/feedback/page.tsx` renders:
- Heading: "Did that help at all?"
- Subheading: "No right or wrong answer."
- `OutcomePicker` with local state for selected outcome
- `ClosingMessage` with hardcoded placeholder text, shown after selection
- "Check in again" link → navigates to `/checkin`
- "Done for now" link → navigates to `/`
- Small crisis resource link at the bottom (same as Landing screen)
**Notes:** No route guard yet — added in M3.

---

### M3 — First Vertical Slice
*Goal: The full loop works end-to-end with real logic and real database writes, but no AI. Every screen shows real data. Every API route writes to Supabase. Route guards are activated.*

---

**T043**
**Title:** Build `POST /api/analyze` — input validation only
**Objective:** Create the route file with request parsing and validation. No logic yet.
**Dependencies:** T017, T018, T009
**Deliverable:** `app/api/analyze/route.ts` exports a `POST` handler that:
- Parses the request body as JSON
- Validates: `session_id` (string, required), `signals` (string array, min length 2), `context` (valid `Context` value)
- Returns `400` with `{ error: 'VALIDATION_ERROR', message: '...' }` for any invalid input
- Returns `200` with `{ ok: true }` for valid input (placeholder, replaced next task)

---

**T044**
**Title:** Add `detectState()` to `/api/analyze`
**Objective:** Wire the scoring function into the route. Return the detected state.
**Dependencies:** T043, T011
**Deliverable:** `/api/analyze` now calls `detectState(signals)` and returns `{ state: StateLabel }` alongside the placeholder response. No DB write yet.

---

**T045**
**Title:** Add Supabase writes to `/api/analyze`
**Objective:** Persist the check-in and state result to the database.
**Dependencies:** T044, T018, T015
**Deliverable:** `/api/analyze` now:
1. Writes to `checkins` table → receives `checkin_id`
2. Writes to `state_results` table (using fallback explanation for now) → receives `state_result_id`
3. Returns full response:
```typescript
{
  state: StateLabel
  explanation: string    // fallback for now
  checkin_id: string
  state_result_id: string
  ai_used: false         // false until OpenAI is added
}
```

---

**T046**
**Title:** Wire check-in submission to `/api/analyze`
**Objective:** The Check-in screen submits to the real API route, stores the result in context, and navigates to `/result`.
**Dependencies:** T031, T045, T020
**Deliverable:** The "See my state" button in `app/checkin/page.tsx`:
1. Calls `POST /api/analyze` with `{ session_id, signals, context }` from local state
2. On success: updates context with `{ state, explanation, checkin_id, state_result_id, phase: 'result' }`
3. Navigates to `/result`
4. On error: shows `ErrorState` with retry option
5. While waiting: shows `LoadingState` with message "Figuring out your state…"

---

**T047**
**Title:** Wire the Result screen to real context + enable route guard
**Objective:** Replace the hardcoded placeholder with real data from context. Activate the route guard so direct navigation redirects correctly.
**Dependencies:** T046, T034, T020
**Deliverable:**
- `app/result/page.tsx` reads `state` and `explanation` from `useCheckinSession()` and passes them to `StateCard`. The placeholder is removed.
- Route guard added: if `session.state === null`, redirect to `/` using `useRouter().replace('/')`. This now works correctly because real context data is available after check-in submission.

---

**T048**
**Title:** Build `POST /api/reset` — input validation + technique selection
**Objective:** Create the route file with validation and reset library lookup. No DB write yet.
**Dependencies:** T013b, T009
**Deliverable:** `app/api/reset/route.ts` exports a `POST` handler that:
- Validates: `session_id`, `state` (valid `StateLabel`), `context` (valid `Context`), `state_result_id` (string)
- Calls `selectTechnique(state, context)` from the reset library
- Returns `{ technique, steps: technique.defaultSteps, why: technique.defaultWhy }` (no DB write yet)

---

**T049**
**Title:** Add Supabase write to `/api/reset`
**Objective:** Persist the reset plan to the database.
**Dependencies:** T048, T018
**Deliverable:** `/api/reset` now writes to `reset_plans` table and returns full response:
```typescript
{
  technique: { id, name, type, durationOptions, isBreatheWork }
  steps: string[]
  why: string
  reset_plan_id: string
  ai_used: false
}
```

---

**T050**
**Title:** Wire "Get my reset" to `/api/reset`
**Objective:** The Result screen calls the real API route and navigates to `/reset`.
**Dependencies:** T049, T047, T020
**Deliverable:** The "Get my reset" button in `app/result/page.tsx`:
1. Calls `POST /api/reset` with `{ session_id, state, context, state_result_id }` from context
2. On success: updates context with `{ technique, steps, why, reset_plan_id, phase: 'resetting' }`
3. Navigates to `/reset`
4. On error: shows `ErrorState`
5. While waiting: shows `LoadingState` with message "Finding your reset…"

---

**T051**
**Title:** Wire the Reset screen to real context + enable route guard
**Objective:** Replace hardcoded placeholder with real technique data from context. Activate the route guard.
**Dependencies:** T050, T039, T020
**Deliverable:**
- `app/reset/page.tsx` reads `technique`, `steps`, and `why` from `useCheckinSession()`. Renders `TechniqueCard`, `StepList`, and `SafetyNote` (conditionally on `technique.isBreatheWork`) with real data. `DurationSelector` renders `technique.durationOptions`. The "I'm done" button navigates to `/feedback`.
- Route guard added: if `session.technique === null`, redirect to `/`.

---

**T052**
**Title:** Build `POST /api/feedback` — validation + Supabase write
**Objective:** Create the feedback route that persists the outcome to the database.
**Dependencies:** T018, T016, T009
**Deliverable:** `app/api/feedback/route.ts` exports a `POST` handler that:
- Validates: `session_id`, `reset_plan_id` (string), `outcome` (valid `Outcome`)
- Writes to `feedback` table
- Returns `{ closing_message: closingMessage[outcome] }` from fallback content
- On DB write failure: logs error server-side, still returns 200 with closing message (feedback write failure never blocks the user)

---

**T053**
**Title:** Wire feedback selection to `/api/feedback` + show closing message + enable route guard
**Objective:** The Feedback screen submits to the real API route, displays the real closing message, and the route guard is activated.
**Dependencies:** T052, T042, T020
**Deliverable:**
- When the user selects an outcome in `app/feedback/page.tsx`:
  1. Calls `POST /api/feedback` with `{ session_id, reset_plan_id, outcome }` from context
  2. Updates context with `{ outcome, phase: 'complete' }`
  3. Shows `ClosingMessage` with the `closing_message` from the API response
- Route guard added: if `session.reset_plan_id === null`, redirect to `/`.

---

**T054 — CHECKPOINT: Full Loop Without AI**
**Title:** ✅ CHECKPOINT — Verify end-to-end loop without AI
**Objective:** Confirm the complete loop works from Landing to Feedback with real data and real DB writes before any AI is introduced.
**Dependencies:** T053
**This checkpoint must pass before M4 begins.**

**Verification checklist — all must be true:**
- [ ] User can navigate Landing → Check-in → Result → Reset → Feedback without errors
- [ ] Selecting fewer than 2 signals prevents submission (validation works)
- [ ] The detected state on the Result screen reflects the signals selected (not random)
- [ ] The technique on the Reset screen matches the user's selected context (no context mismatches)
- [ ] The Feedback screen shows a closing message after selecting an outcome
- [ ] All four Supabase tables (`checkins`, `state_results`, `reset_plans`, `feedback`) have a new row after one complete session
- [ ] Navigating directly to `/result`, `/reset`, or `/feedback` redirects to `/` (route guards work)
- [ ] No console errors during a complete run

**If any item fails, fix it before starting T055.**

---

### M4 — AI Integration
*Goal: OpenAI is wired into both AI routes. Explanation and reset copy are personalized. The fallback is explicitly tested.*

---

**T055**
**Title:** Write prompt templates in `lib/openai/prompts.ts`
**Objective:** Define both AI prompt functions as typed, reusable templates.
**Dependencies:** T009, T015, T013b
**Deliverable:** `lib/openai/prompts.ts` exports:

```typescript
function buildExplanationPrompt(state: StateLabel, topSignals: string[]): {
  system: string
  user: string
}

function buildResetPrompt(technique: Technique, state: StateLabel, context: Context): {
  system: string
  user: string
}
```

**Explanation prompt requirements:**
- System: Establishes warm, non-clinical wellness companion role. Includes tone guardrails: use "may", "often", never claim certainty, no clinical terms.
- User: Provides the state label and 3–5 selected signal labels. Asks for a 2–3 sentence explanation of what the user may be experiencing.
- Output format: Plain paragraph, no bullet points, no headers.
- Max tokens: 200

**Reset prompt requirements:**
- System: Same wellness companion framing with tone guardrails.
- User: Provides technique name, type, state, and context. Asks for personalized step-by-step instructions and a "why this may help" sentence.
- Output format: Return as JSON with `{ steps: string[], why: string }`.
- Max tokens: 400

---

**T056**
**Title:** Add OpenAI call to `/api/analyze`
**Objective:** Replace the fallback-only explanation with an AI-generated explanation, with fallback on error.
**Dependencies:** T055, T019, T045
**Deliverable:** `/api/analyze` now:
1. Runs `detectState(signals)` → `state`
2. Identifies the top 3–5 signals most strongly weighted toward the detected state
3. Calls `buildExplanationPrompt(state, topSignals)`
4. Calls OpenAI: `gpt-4o-mini`, the constructed prompt, `max_tokens: 200`, `temperature: 0.7`, timeout 15s
5. On success: uses AI explanation, sets `ai_used: true`
6. On any failure (timeout, error, empty response): uses `fallbackExplanation[state]`, sets `ai_used: false`
7. Returns same response shape as before

---

**T057**
**Title:** Add OpenAI call to `/api/reset`
**Objective:** Replace default technique copy with AI-personalized steps and why, with fallback on error.
**Dependencies:** T055, T019, T049
**Deliverable:** `/api/reset` now:
1. Calls `selectTechnique(state, context)` → `technique`
2. Calls `buildResetPrompt(technique, state, context)`
3. Calls OpenAI: `gpt-4o-mini`, the constructed prompt, `max_tokens: 400`, `temperature: 0.7`, timeout 15s
4. Parses the JSON response → `{ steps, why }`
5. On success: uses AI steps and why, sets `ai_used: true`
6. On any failure (including JSON parse failure): uses `technique.defaultSteps` and `technique.defaultWhy`, sets `ai_used: false`
7. Returns same response shape as before

---

**T058**
**Title:** Tone-check AI output against Constitution guardrails
**Objective:** Manually review 3–5 AI-generated explanations and reset copy samples against the four failure modes.
**Dependencies:** T056, T057
**Deliverable:** Run the full loop 3–5 times with different signal combinations. For each run, check the AI output against:
- [ ] No clinical language (diagnose, treat, disorder, HRV, cortisol, sympathetic)
- [ ] No overconfident certainty ("this will calm you," "proven to")
- [ ] No generic fluff (copy that could appear in any wellness app)
- [ ] No shame or blame ("you've been pushing too hard")

If any violation is found, adjust the prompt in `lib/openai/prompts.ts` and re-test. Repeat until all 4 guardrails pass consistently.

---

**T059 — CHECKPOINT: AI and Fallback Both Work**
**Title:** ✅ CHECKPOINT — Verify AI-on and AI-off loop both work
**Objective:** Confirm the loop works correctly in both AI and fallback modes before adding any polish.
**Dependencies:** T058

Before this checkpoint, test the fallback explicitly:
- Temporarily set `OPENAI_API_KEY` to an invalid value in `.env.local`
- Run the full loop
- Restore the valid API key after testing

**This checkpoint must pass before M5 begins.**

**Verification checklist — all must be true:**
- [ ] Full loop works with OpenAI active — explanations and reset copy feel warm and personalized
- [ ] Full loop works with API key invalidated — fallback content is complete and on-brand
- [ ] No screen shows an error, blank state, or loading spinner that never resolves in fallback mode
- [ ] AI tone output passes all four Constitution guardrails (from T058)
- [ ] All four DB tables still populate correctly in both modes

**If any item fails, fix it before starting T060.**

---

### M5 — Polish + Quality
*Goal: The loop looks and feels right. Animations, loading states, error states, mobile layout, safety compliance, and edge cases are all handled.*

---

**T060**
**Title:** Add Framer Motion entrance animations to all screens via `ScreenWrapper`
**Objective:** Every screen fades in and slides up on mount.
**Dependencies:** T024, T004
**Deliverable:** `ScreenWrapper` wraps children in `<motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }}>`. Verified on all five screens: Landing, Check-in, Result, Reset, Feedback. Animation must not delay content rendering.

---

**T061**
**Title:** Add chip press animation to `SignalChip`
**Objective:** Chips scale slightly on tap to give physical feedback.
**Dependencies:** T027
**Deliverable:** `SignalChip` wraps the chip in `<motion.button whileTap={{ scale: 0.96 }}>`. The animation must not prevent rapid selection of multiple chips.

---

**T062**
**Title:** Verify loading states on Result and Reset screens
**Objective:** Confirm a loading indicator appears within 200ms of the API call starting on both screens.
**Dependencies:** T046, T050
**Deliverable:** On the Result screen (during `/api/analyze` call) and Reset screen (during `/api/reset` call), the `LoadingState` component appears immediately when the screen loads. No blank white screen at any point. Messages: Result → "Figuring out your state…", Reset → "Finding your reset…"

---

**T063**
**Title:** Verify error states on Result and Reset screens
**Objective:** Confirm error states display correctly when API calls fail.
**Dependencies:** T046, T050, T026
**Deliverable:** Temporarily force the API routes to return a 500 error. Verify that:
- [ ] Result screen shows `ErrorState` with a retry option
- [ ] Reset screen shows `ErrorState` with a retry option
- [ ] No crash, no blank screen, no unhandled error

Restore routes to working state after verification.

---

**T064**
**Title:** Wire `DurationSelector` selection to session context
**Objective:** The selected duration is stored in context and included in the feedback DB write.
**Dependencies:** T037, T051, T020
**Deliverable:** When the user selects a duration on the Reset screen, it is stored in `CheckinSession`. When `/api/feedback` is called, the duration is sent along and written to the `duration_selected` column in `reset_plans`. If no duration is selected by the time "I'm done" is tapped, use the first option as the default.

---

**T065**
**Title:** Verify `SafetyNote` renders conditionally on breathwork techniques
**Objective:** Confirm the breathwork safety note appears only for breathing-based techniques.
**Dependencies:** T038, T051
**Deliverable:** Test with a breathing technique: safety note is visible. Test with a non-breathing technique (movement, grounding): safety note is not visible. The exact copy from the Constitution is used: *"Stop if you feel dizzy, lightheaded, or uncomfortable."*

---

**T066**
**Title:** Add static crisis resource link to Landing screen
**Objective:** Constitution compliance — crisis resources must be permanently visible on Landing.
**Dependencies:** T030
**Deliverable:** The Landing screen (`app/page.tsx`) displays a small, non-alarming link at the bottom: "In crisis? Text or call 988." The link opens `tel:988` on mobile. It is always visible, not behind a toggle or modal. Styled in `brand-mid` (secondary text color) at small font size — present but not dominant.

---

**T067**
**Title:** Add static crisis resource link to Feedback screen
**Objective:** Constitution compliance — crisis resources must be permanently visible on Feedback.
**Dependencies:** T042
**Deliverable:** Same link as T066 added to the Feedback screen. Same styling. Always visible regardless of which outcome is selected.

---

**T068**
**Title:** Verify "Check in again" resets session state correctly
**Objective:** Confirm the user can start a new check-in from the Feedback screen without stale state.
**Dependencies:** T042, T020
**Deliverable:** When "Check in again" is tapped on the Feedback screen:
- Context resets to initial state (`signals: [], context: null, state: null`, etc.)
- `session_id` is preserved (same session identity)
- `phase` resets to `'idle'`
- User is navigated to `/checkin`
- The Check-in screen shows a fresh, empty signal selection

---

**T069**
**Title:** Mobile QA on all five screens at 375px
**Objective:** Verify the app works correctly on a 375px-wide mobile screen with no horizontal scrolling.
**Dependencies:** T060, T061, T062, T063, T064, T065, T066, T067, T068
**Deliverable:** Using browser DevTools at 375px width (or a physical device), verify all five screens:
- [ ] Landing — no horizontal scroll, CTA visible above fold, crisis link visible
- [ ] Check-in — signal grid wraps cleanly, context picker is fully visible, submit button reachable with thumb
- [ ] Result — state card fits, explanation text readable, "Get my reset" CTA reachable
- [ ] Reset — technique card, step list, duration selector, and "I'm done" CTA all visible without horizontal scroll
- [ ] Feedback — all three outcome options visible and tappable, closing message visible

Fix any layout issue found. Repeat until all five pass.

---

**T070**
**Title:** Remove all `console.log` statements from committed code
**Objective:** Constitution compliance — no `console.log` in committed code.
**Dependencies:** T069
**Deliverable:** Search the entire codebase for `console.log`. Remove all occurrences. `console.error` in API route error handlers is permitted. Verify the app still runs correctly after removal.

---

**T071**
**Title:** Run `tsc --noEmit` and confirm zero TypeScript errors
**Objective:** Confirm the full codebase passes TypeScript strict mode before the final gate.
**Dependencies:** T070
**Deliverable:** `npx tsc --noEmit` runs with zero errors and zero warnings. Fix any type errors found before proceeding to M6.
**Notes:** This catches any `any` types or missing type annotations that slipped through. All types should flow from `lib/types.ts`.

---

### M6 — Final Gate + Deploy
*Goal: The app passes the full Constitution Definition of Done checklist, is deployed to Vercel, and a timed demo run is completed.*

---

**T072**
**Title:** Run the full CLAUDE.md Definition of Done checklist
**Objective:** Verify every item in the MVP gate from the Constitution before deploying.
**Dependencies:** T071
**Deliverable:** Go through the Constitution's Definition of Done section line by line. Mark each item as passing or failing. Fix every failing item. The checklist is reproduced here:

**Core Loop**
- [ ] User can complete the full check-in without errors
- [ ] App correctly identifies a state based on selected signals
- [ ] Result screen shows a warm, non-clinical explanation of the detected state
- [ ] Reset screen shows technique, steps, and "why this helps" copy
- [ ] Feedback screen captures outcome and saves to database
- [ ] All four Supabase tables receive data during a complete session

**Quality**
- [ ] Every screen has a loading state for async operations
- [ ] Every API error is handled gracefully — no crashes, no blank screens
- [ ] If OpenAI is unavailable, pre-written fallback content appears
- [ ] The crisis safety message (text/call 988) is visible on Landing and Feedback screens
- [ ] The safety note appears before breathwork techniques

**Experience**
- [ ] The full UI loop completes in under 3 minutes of active interaction
- [ ] The app works without errors on a 375px mobile screen
- [ ] Screen transitions feel smooth and calm
- [ ] No clinical, diagnostic, shame, or overconfident language appears anywhere

**Do not begin T073 until every checkbox above is true.**

---

**T073**
**Title:** Configure Vercel deployment
**Objective:** Deploy the app to Vercel and confirm all environment variables are set correctly.
**Dependencies:** T072
**Deliverable:**
- Vercel project connected to the repository
- All four environment variables set in Vercel dashboard (not in code)
- `npm run build` passes with no errors locally before pushing
- Production deployment completes without errors
- The production URL loads the Landing screen correctly

---

**T074**
**Title:** Verify the production loop on Vercel
**Objective:** Confirm the full loop works in the production environment, not just locally.
**Dependencies:** T073
**Deliverable:** On the production Vercel URL, complete one full loop from Landing to Feedback. Verify:
- [ ] Landing loads in under 2 seconds
- [ ] Check-in submission works (not a local/env issue)
- [ ] Result screen shows real state and explanation
- [ ] Reset screen shows real technique
- [ ] Feedback screen completes and writes to Supabase
- [ ] Check Supabase to confirm all four tables received the production session row

---

**T075**
**Title:** Timed demo walkthrough
**Objective:** Confirm the UI loop completes in under 3 minutes of active interaction.
**Dependencies:** T074
**Deliverable:** Run a timed walkthrough of the full loop from landing to closing message. Record the elapsed time (active UI interaction only — start timer at landing, stop at closing message display). Target: under 3 minutes. If over 3 minutes, identify where time is lost and address it (usually: too many signals to scroll, AI call latency, or too-long copy).

---

## 6. Checkpoints / Validation Gates

### CHECKPOINT A — T054: Full loop without AI

Before this passes, M4 does not begin. This checkpoint exists because adding AI to a broken loop produces two simultaneous failure modes that are impossible to debug separately.

**Pass condition:** A complete run from Landing → Feedback with no errors, no blank screens, all four DB tables populated, and route guards correctly redirecting direct navigation.

### CHECKPOINT B — T059: AI and fallback both verified

Before this passes, M5 does not begin. This checkpoint exists because polish on a system that breaks without AI is worthless.

**Pass condition:** Full loop works with AI on. Full loop works with API key invalidated. Fallback content is complete and on-brand for all states.

---

## 7. Stretch Tasks

These tasks are only started after T075 is complete and the core loop is demo-ready. They are never allowed to delay or interrupt the core task sequence.

**S001: Add "Why does this happen?" educational content**
Write substantive educational micro-content for all 5 states and wire it into the `EducationToggle` on the Result screen. Current implementation uses a placeholder.

**S002: Add time-of-day variation to reset recommendations**
Add a `timeOfDay` parameter (`morning | afternoon | evening | night`) to the reset selection logic. Rotate or weight technique selection based on time.

**S003: Optimize OpenAI prompt latency**
Profile the AI calls. If latency consistently exceeds 2 seconds, experiment with reducing prompt length, lowering `max_tokens`, or pre-streaming the response.

**S004: Add Vercel Analytics**
Enable Vercel Analytics (one-click) to track page views and basic loop completion rates.

**S005: Add a brief "how it works" section to Landing**
Add a collapsible or scrollable section on the Landing screen that explains the four questions the app helps the user answer. Collapsed by default so it doesn't slow the CTA.

**S006: Repeat-session technique rotation**
Track which techniques have been shown in a session and avoid immediate repetition if the user taps "Check in again." Requires passing recent `technique_id` values to `/api/reset`.

---

## 8. Rules for Phase 5 Implementation

These rules govern how Claude Code (Phase 5) uses this task document.

**Rule 1: One task at a time.** Start T001. Complete T001. Start T002. Never work on two tasks simultaneously.

**Rule 2: Read the task completely before starting.** Every task has a done condition. Know what "done" means before writing a line.

**Rule 3: Do not start the next milestone until the current one is fully complete.** This is especially critical at M3 → M4 (CHECKPOINT T054) and M4 → M5 (CHECKPOINT T059).

**Rule 4: Checkpoints are hard stops.** If a checkpoint fails, stop. Fix the failure. Run the checkpoint again. Only proceed when it fully passes.

**Rule 5: Do not invent features.** If a task does not mention a feature, that feature does not exist. Scope is defined by Phase 2 and Phase 3. Phase 4 tasks encode it. Phase 5 implements it.

**Rule 6: Reference the Plan for architecture decisions.** If a task is ambiguous about where something lives or how it connects, the Phase 3 Plan (`specs/03-mvp-plan.md`) is the authority. The Constitution (`CLAUDE.md`) is the authority on tone, types, and guardrails.

**Rule 7: Stretch tasks only after T075.** No stretch task is touched before the core loop is demo-ready.

**Rule 8: Never skip tasks.** The order exists because of dependencies. Skipping a task to get to something more interesting creates invisible debt that surfaces as bugs during demo.

---

## 9. Ready-to-Execute Task Format

When Claude Code is handed a task, the handoff should look like this:

> "Please implement task **T027** from `specs/04-tasks.md`.
>
> **Task:** Build `SignalChip` component
> **File:** `components/checkin/SignalChip.tsx`
> **Dependencies:** T002 (Tailwind colors configured), T009 (types written)
> **Done when:** Component renders a selectable chip with correct active/inactive styles and scale animation on tap. Props typed. No inline styles. No `any`."

Claude Code then implements exactly that task and reports done. The next task begins.

---

*This document is Phase 4 of the Unstuck spec-driven development workflow.*
*It is governed by `CLAUDE.md` (Phase 1 Constitution).*
*It is informed by `specs/02-mvp-spec.md` and `specs/03-mvp-plan.md`.*
*Next: Phase 5 — Implementation (execute tasks T001–T075 in order).*
