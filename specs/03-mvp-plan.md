# Phase 3: Plan — MVP Architecture
# Unstuck

**Document type:** Phase 3 Plan
**Status:** Final
**Governed by:** `CLAUDE.md` (Phase 1 Constitution)
**Informed by:** `specs/02-mvp-spec.md` (Phase 2 Spec)
**Next phase:** Phase 4 — Tasks (ordered build list with dependencies)

---

## 1. Document Purpose

This document translates the Constitution and Spec into a concrete implementation plan. It makes architecture decisions explicit so that Phase 4 (Tasks) can be generated cleanly and Phase 5 (Implementation) has no ambiguity about how the system works.

This document answers:
- How is the app structured?
- How does data move through the core loop?
- Where does logic live?
- How does AI fit in?
- What happens when things fail?
- What gets stored, and where?

This document does **not** contain a task list, implementation code, or feature additions beyond the MVP.

---

## 2. Planning Principles

All architecture decisions in this document are evaluated against the following, in order:

1. **Does it protect the core loop?** A more elegant solution that risks breaking the loop is the wrong choice.
2. **Is it the simplest option that meets the spec?** If a simpler approach exists, it wins.
3. **Can it be built and demoed in a hackathon timeframe?** If it takes more than a day to set up, it's too complex.
4. **Is it debuggable?** If something breaks at 3am before a demo, can it be diagnosed quickly?
5. **Does it leave room to grow without being designed for growth right now?** The MVP does not engineer for scale. It earns the right to scale later.

---

## 3. MVP Technical Approach

### Stack

| Layer | Tool | Rationale |
|-------|------|-----------|
| Framework | Next.js 14 (App Router) | File-based routing, API routes, server components — all in one |
| Styling | Tailwind CSS | Utility-first, no context-switching, enforces design consistency |
| Components | shadcn/ui | Pre-built accessible components, Tailwind-compatible, no fighting the library |
| Animation | Framer Motion | Simple declarative animations for screen transitions and micro-interactions |
| Database | Supabase (Postgres) | Managed Postgres, instant REST API, no setup overhead |
| AI | OpenAI `gpt-4o-mini` | Fast, cheap, sufficient quality for explanation and copy personalization |
| Deployment | Vercel | Zero-config Next.js deployment, environment variable management |
| Language | TypeScript (strict mode) | Catches bugs at compile time; non-negotiable per Constitution |

### Approach Summary

The app is a **Next.js multi-page application** where each step of the core loop is a distinct route. In-session state flows through a React Context provider. All AI and database calls happen server-side in API routes. State detection is a synchronous pure function. The reset library is a static typed object in source code. Fallback content is pre-written and embedded in the codebase. No background jobs. No real-time. No authentication.

This approach produces a system that can be built in 24–48 hours, demoed reliably, and extended after the hackathon without a rewrite.

---

## 4. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (Client)                    │
│                                                         │
│   CheckinSessionContext (React Context)                 │
│   ┌──────────┐ ┌──────────┐ ┌────────┐ ┌───────────┐  │
│   │ Landing  │→│ Check-in │→│ Result │→│   Reset   │  │
│   │  /       │ │ /checkin │ │/result │ │  /reset   │  │
│   └──────────┘ └────┬─────┘ └───┬────┘ └─────┬─────┘  │
│                     │           │             │         │
└─────────────────────┼───────────┼─────────────┼─────────┘
                      │           │             │
              POST /api/analyze   │     POST /api/reset
                      │     POST /api/feedback  │
┌─────────────────────┼───────────┼─────────────┼─────────┐
│                  Next.js API Routes (Server)             │
│                                                         │
│   /api/analyze          /api/reset      /api/feedback   │
│   ┌────────────────┐    ┌────────────┐  ┌────────────┐  │
│   │ 1. Run scoring │    │ 1. Lookup  │  │ 1. Write   │  │
│   │ 2. Call OpenAI │    │    library │  │    to DB   │  │
│   │ 3. Write to DB │    │ 2. Call AI │  │            │  │
│   │ 4. Return data │    │ 3. Write DB│  │            │  │
│   └────────────────┘    └────────────┘  └────────────┘  │
│         │                     │                          │
└─────────┼─────────────────────┼──────────────────────────┘
          │                     │
    ┌─────┴──────┐        ┌─────┴──────┐
    │  OpenAI    │        │  Supabase  │
    │ gpt-4o-mini│        │  Postgres  │
    └────────────┘        └────────────┘
```

### Key architectural boundaries

- **Client components** handle UI, user interaction, and context state only. Zero API or DB calls.
- **API routes** handle all server-side logic: state detection, AI calls, DB writes, validation.
- **`lib/`** contains all pure logic: detection scoring, content library, prompt templates, TypeScript types.
- **Supabase** receives data during a session but is never queried to drive the UI. Context state drives the UI.

---

## 5. Route / Screen Structure

```
app/
├── layout.tsx              Root layout — wraps app with CheckinSessionProvider
├── page.tsx                /            Landing screen
├── checkin/
│   └── page.tsx            /checkin     Check-in screen
├── result/
│   └── page.tsx            /result      Result screen
├── reset/
│   └── page.tsx            /reset       Reset screen
├── feedback/
│   └── page.tsx            /feedback    Feedback screen
└── api/
    ├── analyze/
    │   └── route.ts        POST /api/analyze
    ├── reset/
    │   └── route.ts        POST /api/reset
    └── feedback/
        └── route.ts        POST /api/feedback
```

### Route navigation flow

```
/  →  /checkin  →  (POST /api/analyze)  →  /result
                                              ↓
                         /feedback  ←  /reset  ←  (POST /api/reset)
                              ↓
                        (POST /api/feedback)
                              ↓
                        /feedback [complete state]
```

### Route guard rule

Each screen (beyond landing) checks whether the required context data is present. If a user lands on `/result` without a state in context, they are redirected to `/`. This prevents broken states without requiring a backend session.

```
/checkin  — no guard (always accessible)
/result   — requires: signals, context in session
/reset    — requires: state, explanation in session
/feedback — requires: technique in session
```

---

## 6. Component Structure

Components are organized by screen, with a small set of shared primitives. No global component abstraction layer beyond `ScreenWrapper`, `LoadingState`, and `ErrorState`.

```
components/
├── shared/
│   ├── ScreenWrapper.tsx       Max-width centering, padding, animation entrance
│   ├── LoadingState.tsx        Spinner + message for async screens
│   └── ErrorState.tsx          Fallback UI for broken states
│
├── checkin/
│   ├── SignalGrid.tsx          Renders the full grid of selectable signal chips
│   ├── SignalChip.tsx          Individual selectable chip with active state
│   └── ContextPicker.tsx       Context selector (5 options, horizontal scroll or grid)
│
├── result/
│   ├── StateCard.tsx           State name + explanation display
│   └── EducationToggle.tsx     Collapsed "Why does this happen?" accordion
│
├── reset/
│   ├── TechniqueCard.tsx       Technique name, type badge, and description
│   ├── StepList.tsx            Numbered step-by-step instructions
│   ├── DurationSelector.tsx    30s / 2min / 5min tab/chip selector
│   └── SafetyNote.tsx          Breathwork safety note (conditional)
│
└── feedback/
    ├── OutcomePicker.tsx       Three-option selector: Better / Same / Worse
    └── ClosingMessage.tsx      Non-judgmental response after selection
```

### Component rules (from Constitution)
- One component per file
- No component exceeds 150 lines — split if larger
- No inline styles — Tailwind only
- Props are always typed with TypeScript interfaces
- No `any`

---

## 7. State Management Strategy

### In-session state: React Context

A single context provider, `CheckinSessionContext`, wraps the app in `layout.tsx`. It holds all data produced during the current session and is the single source of truth for screen rendering.

```typescript
// lib/context/session.tsx

type CheckinSession = {
  session_id: string           // UUID from localStorage, created on first visit
  signals: string[]            // IDs of selected signals
  context: Context | null      // User's current context
  checkin_id: string | null    // UUID from DB after /api/analyze
  state: StateLabel | null     // Detected state label
  explanation: string | null   // AI-generated or fallback explanation
  state_result_id: string | null
  technique: Technique | null  // Selected reset technique
  steps: string[]              // AI-personalized or fallback steps
  why: string | null           // AI-personalized or fallback "why this helps"
  reset_plan_id: string | null
  outcome: Outcome | null      // better / same / worse
  phase: SessionPhase          // Current step in the loop
}

type SessionPhase =
  | 'idle'
  | 'checking-in'
  | 'analyzing'
  | 'result'
  | 'resetting'
  | 'feedback'
  | 'complete'
```

### What lives in context vs. what lives in local component state

**In context (shared across screens):**
- Everything listed in `CheckinSession` above

**In local component state (screen-level only):**
- Which signals the user has tapped so far (before submission)
- Which context option is hovered/selected (before submission)
- Which duration is selected on the reset screen
- Whether the education toggle is open on the result screen
- Loading / error states for API calls

### Session persistence

The `session_id` is stored in `localStorage` and retrieved on mount. Everything else is in-memory only and resets when the user closes the tab — correct behavior for a single-session loop.

There is no "resume session" feature in the MVP. If the user leaves and comes back, they start a fresh check-in.

---

## 8. Data Flow Across the Core Loop

### Step-by-step flow with all data movements

```
Step 1: User arrives at Landing (/)
  → Mount: check localStorage for session_id
  → If none: generate UUID, write to localStorage
  → Set session_id in context
  → User taps "Check in now" → navigate to /checkin

Step 2: User completes check-in (/checkin)
  → User taps signal chips → updates local component state
  → User selects context → updates local component state
  → User taps "See my state" →
    → Write signals + context to CheckinSessionContext
    → Set phase = 'analyzing'
    → Navigate to /result (which shows LoadingState)
    → POST /api/analyze { session_id, signals, context }

Step 3: /api/analyze (server)
  → Validate inputs
  → Run detectState(signals) → state: StateLabel
  → Call OpenAI: generateExplanation(state, signals) → explanation: string
    (on failure: use fallbackExplanation[state])
  → Write to Supabase: checkins table → checkin_id
  → Write to Supabase: state_results table → state_result_id
  → Return { state, explanation, checkin_id, state_result_id }

Step 4: /result receives response
  → Store state, explanation, checkin_id, state_result_id in context
  → Set phase = 'result'
  → Render StateCard with state + explanation
  → User taps "Get my reset" →
    → Set phase = 'resetting' (brief loading state)
    → POST /api/reset { session_id, state, context, state_result_id }

Step 5: /api/reset (server)
  → Validate inputs
  → Look up resetLibrary[state][context] → technique: Technique
  → Call OpenAI: personalizeReset(technique, state, context) → { steps, why }
    (on failure: use technique.defaultSteps, technique.defaultWhy)
  → Write to Supabase: reset_plans table → reset_plan_id
  → Return { technique, steps, why, reset_plan_id }

Step 6: /reset receives response
  → Store technique, steps, why, reset_plan_id in context
  → Set phase = 'resetting'
  → Navigate to /reset
  → Render TechniqueCard + StepList + DurationSelector
  → User taps "I'm done" → navigate to /feedback

Step 7: /feedback (/feedback)
  → User selects Better / Same / Worse
  → POST /api/feedback { session_id, reset_plan_id, outcome }
  → Store outcome in context
  → Set phase = 'complete'
  → Render ClosingMessage

Step 8: Session complete
  → User sees closing message + exit options
  → "Check in again" → reset context, navigate to /checkin
  → "Done for now" → navigate to /
```

---

## 9. State Detection Design

### Algorithm

State detection is a **pure synchronous function** that runs entirely on the server inside `/api/analyze`. It takes an array of selected signal IDs and returns the highest-scoring `StateLabel`.

```typescript
// lib/state-detection/logic.ts

function detectState(selectedSignalIds: string[]): StateLabel {
  const scores: Record<StateLabel, number> = {
    'Overactivated': 0,
    'Tense & Overloaded': 0,
    'Wired but Tired': 0,
    'Foggy & Depleted': 0,
    'Shut Down': 0,
  }

  for (const signalId of selectedSignalIds) {
    const signal = SIGNAL_TABLE[signalId]
    if (!signal) continue
    for (const [state, weight] of Object.entries(signal.weights)) {
      scores[state as StateLabel] += weight
    }
  }

  return Object.entries(scores)
    .sort(([, a], [, b]) => b - a)[0][0] as StateLabel
}
```

### Signal table structure

```typescript
// lib/state-detection/signals.ts

type Signal = {
  id: string
  label: string           // User-facing plain language label
  category: 'physical' | 'mental' | 'emotional' | 'behavioral'
  weights: Record<StateLabel, number>  // 0–3 for each state
}

const SIGNAL_TABLE: Record<string, Signal> = {
  'racing-thoughts': {
    id: 'racing-thoughts',
    label: "Racing or rushing thoughts",
    category: 'mental',
    weights: {
      'Overactivated': 3,
      'Tense & Overloaded': 2,
      'Wired but Tired': 2,
      'Foggy & Depleted': 0,
      'Shut Down': 0,
    }
  },
  // ... all 26 signals
}
```

### Signal categories (for display grouping on check-in screen)

| Category | Examples |
|----------|---------|
| Physical | Heart racing, tight chest, shallow breathing, jaw clenched, shoulders up |
| Mental | Racing thoughts, can't focus, mind blank, can't decide anything |
| Emotional | Anxious, irritable, emotionally flat, detached, overwhelmed |
| Behavioral | Scrolling without purpose, avoiding tasks, snapping at people, can't stop working |

### Tie-breaking rule

If two states score equally, prefer the state earlier in this priority order:
`Overactivated → Tense & Overloaded → Wired but Tired → Foggy & Depleted → Shut Down`

This ensures a deterministic result and favors higher-activation states (which are more commonly what users are actually experiencing when they open the app).

### Minimum signal rule

If fewer than 2 signals are selected, do not run detection. Return a validation error to the client, which shows "Please select at least 2 signals to continue."

---

## 10. Reset Selection Design

### Structure

The reset library is a **static TypeScript object** in `lib/content/resets.ts`. It is not fetched from a database. It maps every `StateLabel × Context` combination to an array of `Technique` objects.

```typescript
// lib/content/resets.ts

type Technique = {
  id: string
  name: string
  type: TechniqueType          // 'Breathing' | 'Movement' | 'Physical Sensation' | 'Mental & Grounding'
  allowedContexts: Context[]   // Enforces context guardrails at the data level
  requiresPrivacy: boolean      // true = not for public/car
  requiresClosedEyes: boolean   // true = not for car
  durationOptions: ('30s' | '2min' | '5min')[]
  isBreatheWork: boolean        // true = show safety note
  defaultSteps: string[]        // Pre-written fallback instructions
  defaultWhy: string            // Pre-written fallback "why this helps"
}

const resetLibrary: Record<StateLabel, Record<Context, Technique[]>> = {
  'Overactivated': {
    'private': [...],
    'desk': [...],
    'public': [...],
    'car': [...],
    'bed': [...],
  },
  // ... all 5 states
}
```

### Selection algorithm

```typescript
function selectTechnique(state: StateLabel, context: Context): Technique {
  const candidates = resetLibrary[state][context]
  // For MVP: always return first technique
  // Post-MVP: rotate based on session history to avoid repetition
  return candidates[0]
}
```

### Context guardrail enforcement

The `allowedContexts` array on each technique is the enforcement mechanism. The library only includes each technique under context keys where it is allowed. This means:

- A technique with `allowedContexts: ['private', 'bed']` appears **only** in the `private` and `bed` arrays
- It will never appear in `public`, `desk`, or `car`
- The selection function never needs to filter — the library is pre-filtered by design

### Minimum content requirement

Before MVP ships, the library must contain at least one technique for every `StateLabel × Context` combination: **5 states × 5 contexts = 25 minimum entries**. Techniques can be shared across contexts if appropriate.

---

## 11. AI Usage Design

### Two AI calls in the loop

#### Call 1: Generate state explanation — inside `/api/analyze`

**Purpose:** Produce a warm, 2–3 sentence plain-language explanation of what the user may be experiencing in this state, personalized by referencing the signals they selected.

**Input to prompt:**
- The detected `StateLabel`
- The 3–5 selected signal labels most relevant to this state (highest-weighted signals for the detected state)

**Prompt location:** `lib/openai/prompts.ts` — function `buildExplanationPrompt(state, signals)`

**Model:** `gpt-4o-mini`
**Max tokens:** 200
**Temperature:** 0.7

**Output shape:** `{ explanation: string }` — a single paragraph, 2–3 sentences

**Fallback:** `lib/content/fallbacks.ts` — `fallbackExplanation[state]` — one pre-written explanation per state

---

#### Call 2: Personalize reset copy — inside `/api/reset`

**Purpose:** Personalize the step-by-step instructions and "why this helps" copy to feel specific to this user's state and context, not generic.

**Input to prompt:**
- The `Technique` object (name, type, `defaultSteps`, `defaultWhy`)
- The detected `StateLabel`
- The user's `Context`

**Prompt location:** `lib/openai/prompts.ts` — function `buildResetPrompt(technique, state, context)`

**Model:** `gpt-4o-mini`
**Max tokens:** 400
**Temperature:** 0.7

**Output shape:** `{ steps: string[], why: string }`

**Fallback:** `technique.defaultSteps` and `technique.defaultWhy` from the reset library

---

### Prompt engineering rules

All prompts must:

1. Open with the role: *"You are a warm, knowledgeable wellness companion. You are not a therapist or doctor."*
2. Specify the output format explicitly (plain language, 2–3 sentences, no bullet headers, etc.)
3. Include a tone guardrail: *"Do not use clinical language. Do not claim certainty about outcomes. Use 'may', 'often', 'many people notice' instead of 'will' or 'is proven to'."*
4. Stay under the `max_tokens` limit — prompts should be economical
5. Never ask the AI to detect the state — the state is always provided as a given

---

## 12. Fallback / Failure Handling Strategy

### Principle

The app must work identically with or without AI. The user experience is the same either way. The AI failure mode is invisible to the user.

### Failure handling per API route

#### `/api/analyze` failure modes

| Failure | Handling |
|---------|---------|
| OpenAI API unavailable | Use `fallbackExplanation[state]` from `lib/content/fallbacks.ts` |
| OpenAI returns empty / malformed response | Same — fall to pre-written content |
| OpenAI call times out (>15s) | Abort call, use fallback |
| Supabase write fails | Log error server-side, continue — do not block the user's loop |
| Fewer than 2 signals selected | Return 400 validation error, show message on client |
| Unknown signal ID in payload | Skip the signal in scoring — do not throw |

#### `/api/reset` failure modes

| Failure | Handling |
|---------|---------|
| OpenAI API unavailable | Use `technique.defaultSteps` and `technique.defaultWhy` |
| No technique found for state × context | Should never happen if library is complete — but if it does, use first technique for the state across any context |
| Supabase write fails | Log error, continue — do not block |

#### `/api/feedback` failure modes

| Failure | Handling |
|---------|---------|
| Supabase write fails | Log error server-side, show success to user — feedback not critical to the experience |

### Client-side failure modes

| Failure | Handling |
|---------|---------|
| API call returns 500 | Show `ErrorState` component with a friendly message and a "try again" CTA |
| Navigation to guarded screen without context data | Redirect to `/` |
| Session_id missing from localStorage | Generate a new one on the spot |
| Framer Motion animation fails to load | Content renders without animation — never block on animation |

### What never fails silently

- API routes always return a structured JSON response (success or error shape)
- Client components always have a fallback render state
- No screen ever shows a blank white page

---

## 13. Database / Persistence Plan

### Database: Supabase (Postgres)

Four tables. No foreign key constraints required for MVP — simpler to implement and still traceable via `session_id`.

---

### Table: `checkins`

```sql
CREATE TABLE checkins (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  TEXT NOT NULL,
  signals     TEXT[] NOT NULL,       -- Array of signal IDs
  context     TEXT NOT NULL,         -- One of 5 context values
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `state_results`

```sql
CREATE TABLE state_results (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checkin_id   UUID NOT NULL,        -- References checkins.id (soft FK)
  session_id   TEXT NOT NULL,
  state_label  TEXT NOT NULL,        -- One of 5 StateLabel values
  explanation  TEXT NOT NULL,        -- AI-generated or fallback
  ai_used      BOOLEAN DEFAULT TRUE, -- False if fallback was used
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `reset_plans`

```sql
CREATE TABLE reset_plans (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_result_id  UUID NOT NULL,    -- References state_results.id (soft FK)
  session_id       TEXT NOT NULL,
  technique_id     TEXT NOT NULL,    -- ID from the reset library
  technique_name   TEXT NOT NULL,
  technique_type   TEXT NOT NULL,
  duration_selected TEXT,            -- 30s / 2min / 5min (set when user picks)
  steps            TEXT[] NOT NULL,  -- AI-personalized or fallback steps
  why              TEXT NOT NULL,    -- AI-personalized or fallback why
  ai_used          BOOLEAN DEFAULT TRUE,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table: `feedback`

```sql
CREATE TABLE feedback (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reset_plan_id  UUID NOT NULL,      -- References reset_plans.id (soft FK)
  session_id     TEXT NOT NULL,
  outcome        TEXT NOT NULL,      -- better / same / worse
  created_at     TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Supabase client setup

Two Supabase clients:

```
lib/supabase/client.ts   — Browser client (anon key) — read-only in MVP
lib/supabase/server.ts   — Server client (service role key) — used in API routes for all writes
```

The service role key must **never** be exposed to the client. It lives only in server-side environment variables.

### Row Level Security

For MVP: RLS can be disabled. This is a hackathon. The app has no user auth, no sensitive PII, and no financial data. Enable basic RLS post-launch if needed.

---

## 14. API Design

### `POST /api/analyze`

**Purpose:** Run state detection, generate explanation, persist to DB.

**Request body:**
```typescript
{
  session_id: string    // UUID from localStorage
  signals: string[]     // Array of signal IDs (min 2)
  context: Context      // 'private' | 'desk' | 'public' | 'car' | 'bed'
}
```

**Processing steps:**
1. Validate inputs (check required fields, min 2 signals, valid context)
2. Run `detectState(signals)` → `state: StateLabel`
3. Run `buildExplanationPrompt(state, signals)` → call OpenAI → `explanation: string`
   - On failure: use `fallbackExplanation[state]`
4. Write to `checkins` table → `checkin_id`
5. Write to `state_results` table → `state_result_id`
6. Return success response

**Success response:**
```typescript
{
  state: StateLabel
  explanation: string
  checkin_id: string
  state_result_id: string
  ai_used: boolean
}
```

**Error response:**
```typescript
{
  error: string   // Human-readable message
  code: string    // 'VALIDATION_ERROR' | 'INTERNAL_ERROR'
}
```

---

### `POST /api/reset`

**Purpose:** Select technique, personalize copy, persist to DB.

**Request body:**
```typescript
{
  session_id: string
  state: StateLabel
  context: Context
  state_result_id: string
}
```

**Processing steps:**
1. Validate inputs
2. Run `selectTechnique(state, context)` → `technique: Technique`
3. Run `buildResetPrompt(technique, state, context)` → call OpenAI → `{ steps, why }`
   - On failure: use `technique.defaultSteps`, `technique.defaultWhy`
4. Write to `reset_plans` table → `reset_plan_id`
5. Return success response

**Success response:**
```typescript
{
  technique: {
    id: string
    name: string
    type: TechniqueType
    durationOptions: ('30s' | '2min' | '5min')[]
    isBreatheWork: boolean
  }
  steps: string[]
  why: string
  reset_plan_id: string
  ai_used: boolean
}
```

---

### `POST /api/feedback`

**Purpose:** Persist feedback outcome to DB.

**Request body:**
```typescript
{
  session_id: string
  reset_plan_id: string
  outcome: Outcome   // 'better' | 'same' | 'worse'
}
```

**Processing steps:**
1. Validate inputs
2. Write to `feedback` table
3. Return closing message

**Success response:**
```typescript
{
  closing_message: string   // One of 3 pre-written closing messages by outcome
}
```

**Note:** Closing messages are pre-written in `lib/content/fallbacks.ts` — no AI involved. A DB write failure here does not block the response.

---

## 15. External Services / Integrations

### OpenAI

- Package: `openai` (official npm package)
- Initialized once in `lib/openai/client.ts` using `process.env.OPENAI_API_KEY`
- Used server-side only — never imported in client components
- Model: `gpt-4o-mini` exclusively
- Timeout: 15 seconds — abort call and use fallback if exceeded

### Supabase

- Package: `@supabase/supabase-js`
- Browser client: initialized with `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Server client: initialized with `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
- The server client is used for all writes in API routes

### Vercel

- Deployment target — zero additional configuration for Next.js
- Environment variables set via Vercel dashboard
- No edge functions, no serverless configuration customization needed

### Required environment variables

```bash
# OpenAI
OPENAI_API_KEY=

# Supabase (public — safe for browser)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Supabase (private — server only)
SUPABASE_SERVICE_ROLE_KEY=
```

---

## 16. Build Priority Strategy

Build in vertical slices, not horizontal layers. Each slice must be working and testable before starting the next.

### Priority order

| Priority | What gets built | Why |
|----------|-----------------|-----|
| 1 | Project scaffold, TypeScript config, Tailwind config, folder structure, environment | Foundation — everything else depends on this |
| 2 | All TypeScript types in `lib/types.ts` | Types enforce correctness throughout; define them first |
| 3 | Signal table + scoring function in `lib/state-detection/` | Core logic — can be tested in isolation |
| 4 | Reset library in `lib/content/resets.ts` (all 25 entries) | Core content — needed before any reset screen exists |
| 5 | Fallback content in `lib/content/fallbacks.ts` | Safety net — must exist before AI is wired |
| 6 | `CheckinSessionContext` provider | State management backbone |
| 7 | Landing screen | Entry point — simplest screen |
| 8 | Check-in screen (UI only — no API call) | Signal chips + context picker, submit button |
| 9 | `/api/analyze` route (detection + DB write, no AI yet) | Wire up detection; confirm DB writes work |
| 10 | Result screen (shows state from context, no explanation yet) | Proves the state flows from check-in to result |
| 11 | `/api/reset` route (library lookup + DB write, no AI yet) | Wire up reset selection |
| 12 | Reset screen | Full screen with static content |
| 13 | Feedback screen + `/api/feedback` route | Closes the loop |
| 14 | **Loop verification** — run end to end, fix anything broken | Non-negotiable checkpoint before adding AI |
| 15 | OpenAI integration in `/api/analyze` | Add explanation personalization |
| 16 | OpenAI integration in `/api/reset` | Add reset copy personalization |
| 17 | Prompt templates in `lib/openai/prompts.ts` | Fine-tune tone and output quality |
| 18 | Error handling and fallback testing | Kill the AI key, run the loop, verify fallback works |
| 19 | Screen transitions with Framer Motion | Polish |
| 20 | Mobile QA on 375px | Final check |

**The rule:** Do not add AI before step 14. Do not add animations before step 18. Do not add polish before the loop works.

---

## 17. Simplifications for MVP

These are deliberate choices to ship faster. Each one is the right call for a hackathon MVP.

| Simplification | What was avoided | Why it's right |
|---------------|-----------------|----------------|
| Signal chips instead of sliders | 5 rating sliders with 0–10 range | Chips are faster to complete, more mobile-friendly, and sufficient for scoring |
| No free-text input | Free text → safety scanning → AI parsing → UX complexity | 4 engineering problems, 0 impact on core loop |
| Static reset library in code | CMS, admin interface, DB-backed content | Content changes = code deploys. Fine for MVP. |
| One technique per reset session | Carousel, "try another" feature | Forces content quality; proves one good reset is enough |
| No session resume | Auth, session persistence, history UI | Single-session loop. Resume is a post-MVP feature. |
| Pre-written closing messages | AI-generated closing messages | Closing messages don't need personalization; pre-written is faster and safer |
| Soft FK references in DB | Full FK constraints | Easier to set up in Supabase without migration tooling |
| No RLS for MVP | Row-level security policies | No PII, no auth — RLS adds setup time with no security benefit at hackathon scale |
| Single Vercel deployment | Multi-environment (dev/staging/prod) | One environment is enough for a hackathon |
| No API rate limiting | Rate limiting middleware | Not needed until post-launch |
| Context state, no server session | Server-side session with DB sync | React context is sufficient for a single-session, single-tab flow |

---

## 18. Key Risks / Tradeoffs

### Risk 1: OpenAI response latency

**Risk:** The AI explanation call may take 2–4 seconds. If the loading state is not polished, this feels broken.

**Mitigation:** Navigate to `/result` immediately after check-in submission and show a smooth loading state during the API call. The loading state is a designed part of the experience, not a failure mode. Target: spinner visible within 200ms of submission.

---

### Risk 2: State detection accuracy feels off

**Risk:** If a user selects signals and gets back a state that doesn't resonate, they lose trust in the product immediately.

**Mitigation:** The signal weight table must be carefully designed before the loop is tested. Build a test script that runs the scoring function against representative signal sets and verifies expected outputs. Review with the spec's five state descriptions. The weight table is tunable — it's just a data file.

---

### Risk 3: Content gaps in the reset library

**Risk:** A specific state × context combination has no technique, or has a technique that feels wrong for the context.

**Mitigation:** Build all 25 entries in Priority step 4 before wiring up any screens. Verify every entry manually before the loop test in step 14. There are no acceptable blank entries.

---

### Risk 4: Context filtering failure

**Risk:** A user in a car is shown a technique that requires closing eyes. This is a Constitution violation and a UX trust breaker.

**Mitigation:** Enforced at the data level (`allowedContexts` array). The selection function cannot return a technique not in the user's context slot. Write a test that iterates all 25 library entries and verifies the `car` slot contains no `requiresClosedEyes: true` techniques.

---

### Risk 5: Session context lost on route refresh

**Risk:** If the user refreshes the browser mid-loop, the React Context resets and they land on a screen without the required data.

**Mitigation:** Route guards redirect to `/` if required context data is missing. The user loses their place in the loop but is never shown a broken screen. This is acceptable MVP behavior — adding sessionStorage persistence is a post-MVP improvement.

---

### Risk 6: Supabase setup time

**Risk:** Getting Supabase configured, tables created, and API keys working can take 30–60 minutes if done without preparation.

**Mitigation:** Create the Supabase project and run the four `CREATE TABLE` statements first, before writing any application code. Verify the server client can insert a row before building any API routes. This is Priority step 1.

---

## 19. What This Phase Intentionally Defers

This plan does **not** specify:

**To Phase 4 (Tasks):**
- The ordered list of implementation tasks with dependencies
- The step-by-step Supabase setup instructions
- The full signal weight table (all 26 signals × 5 states)
- The complete reset library (all 25 technique entries with pre-written content)
- The exact prompt template text in `lib/openai/prompts.ts`
- The pre-written fallback explanations for all 5 states
- The pre-written closing messages for Better / Same / Worse
- The specific shadcn/ui components to install
- The exact Tailwind utility classes for each component
- The Vercel deployment steps

**To Phase 5 (Implementation):**
- Any actual source code
- Environment variable values
- The content of the signal labels (what words the user sees)
- The content of the technique step instructions

---

## 20. Readiness for Phase 4 Tasks

This plan is complete enough to generate Phase 4 if all of the following are true:

- [x] The route structure is fully defined (5 screens + 3 API routes)
- [x] The component tree is defined per screen
- [x] The data flow across all 5 steps is documented
- [x] The TypeScript type definitions are specified
- [x] The database schema is fully specified (4 tables with SQL)
- [x] All API contracts are defined (inputs, processing steps, outputs, error shapes)
- [x] The state detection algorithm is specified
- [x] The reset selection algorithm is specified
- [x] The AI integration design is specified (both calls, both prompts, both fallbacks)
- [x] The build priority order is defined (20 steps in order)
- [x] The simplifications are explicit (no ambiguity about what's cut)
- [x] The key risks are named with mitigations

**Phase 4 (Tasks) can now produce an ordered, dependency-aware task list that maps directly to this plan.**

---

*This document is Phase 3 of the Unstuck spec-driven development workflow.*
*It is governed by `CLAUDE.md` (Phase 1 Constitution).*
*It is informed by `specs/02-mvp-spec.md` (Phase 2 Spec).*
*Next: `specs/04-tasks.md` — Phase 4: Tasks (ordered build list with dependencies).*
