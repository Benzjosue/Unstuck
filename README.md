# Unstuck

**A nervous system awareness and reset tool — check in, identify your state, and take action in a single focused loop.**

---

## Live Demo

**[unstuck-4jakm0x6h-benzjosues-projects.vercel.app](https://unstuck-4jakm0x6h-benzjosues-projects.vercel.app/)**

---

## Why I Built This

Most wellness apps ask for too much — streaks, journaling, long-term commitment — or offer advice too generic to be useful in the moment. Neither helps when you're at your desk at 2pm feeling foggy and overwhelmed and just want one practical thing to do right now.

Unstuck solves a narrow problem deliberately well: recognize what state you're in, get a reset that fits your context, and move on. No account required. No streak to maintain.

---

## The Problem

Stress and overload don't always feel the same. A racing mind, a heavy body, emotional flatness, that wired-but-can't-rest feeling — these are different states that call for different responses. Most people can't name what they're experiencing in the moment, which means they can't respond to it effectively.

Generic advice doesn't account for where you are or what you're doing. Context matters. State matters.

---

## The Solution

A five-screen loop designed to move fast:

1. **Check in** — select signals you're noticing right now
2. **Get a state** — rule-based scoring identifies which of five states fits
3. **Read an explanation** — a short, warm, non-clinical description of what may be happening
4. **Follow a reset** — a technique chosen for your state and your current location
5. **Give feedback** — rate how you feel after; session complete

The verified demo run completed in **45 seconds** of active interaction.

---

## Core User Flow

```
Landing → Check-in → Result → Reset → Feedback
```

| Screen   | What happens                                                                       |
| -------- | ---------------------------------------------------------------------------------- |
| Landing  | Product overview, single CTA                                                       |
| Check-in | Select signals (26 options across 4 categories), pick context (5 options)          |
| Result   | Detected state label + AI-generated warm explanation                               |
| Reset    | Technique matched to state + context, step-by-step instructions, duration selector |
| Feedback | Outcome selection (Better / Same / Worse), personalized closing message            |

---

## Screenshots

> All screenshots are from the mobile-first production experience at 375px.

### Landing

![Landing screen](./screenshots/01-landing.png)
*Landing screen on mobile: product promise, primary CTA, and persistent crisis resource link.*

### Check-in

![Check-in: signal selection](./screenshots/02-checkin-signals.png)
*Check-in screen: users select the signals they are noticing across physical, mental, emotional, and behavioral categories.*

![Check-in: context selection](./screenshots/03-checkin-context.png)
*Check-in screen: context selection and submission CTA, allowing the app to tailor the reset to the user's current environment.*

### Result

![Result screen](./screenshots/04-result.png)
*Result screen: detected state label, AI-generated explanation, and education toggle.*

### Reset

![Reset: steps](./screenshots/05-reset-steps.png)
*Reset screen: context-aware technique, conditional breathwork safety note, duration selector, and numbered step list.*

![Reset: why + CTA](./screenshots/06-reset-why-cta.png)
*Reset screen: supporting 'why this may help' explanation and completion CTA.*

### Feedback

![Feedback screen](./screenshots/07-feedback.png)
*Feedback screen: outcome selection, personalized closing message, and repeat check-in options.*

---

## From Hackathon Concept to Completed MVP

Unstuck started as a hackathon concept built around one question: _can you build something genuinely useful for nervous system awareness in a weekend?_

The initial build validated the core loop and signal-to-state mapping. After the hackathon, I committed to completing it properly — writing a full product specification, defining a constitution for what the app must and must never do, and working through a structured six-milestone task breakdown before touching production code.

The result is an MVP that passes a formal Definition of Done checklist, has explicit safety guardrails, handles AI failures gracefully, and is deployed to production.

**Milestones:**

| #   | Milestone            | Focus                                                       |
| --- | -------------------- | ----------------------------------------------------------- |
| M0  | Foundation           | Project setup, Supabase schema, env configuration           |
| M1  | Logic + Content      | State detection, reset library, pre-written fallback copy   |
| M2  | Static UI            | All five screens navigable with placeholder data            |
| M3  | First Vertical Slice | Real API calls, DB writes, route guards active              |
| M4  | AI Integration       | OpenAI wired to both routes, fallback explicitly verified   |
| M5  | Polish + Quality     | Animations, error states, mobile QA, TypeScript strict pass |
| M6  | Final Gate + Deploy  | Definition of Done checklist, Vercel deploy, timed demo     |

---

## Key Features

- **Rule-based state detection** — 26 signals, weighted scoring across 5 states; deterministic and debuggable
- **AI-personalized copy** — OpenAI generates the explanation and reset instructions; pre-written fallback activates automatically on any failure
- **Context-aware resets** — technique selection accounts for where the user is (desk, public, car, bed, private space)
- **Route guards** — `/result`, `/reset`, and `/feedback` redirect to `/` if accessed without completing prior steps
- **Anonymous sessions** — UUID stored in `localStorage`; no account required
- **Silent AI fallback** — if OpenAI is unavailable, the app continues with pre-written content; the user sees no error
- **Crisis resource** — 988 link present on Landing and Feedback screens, always visible and tappable
- **Breathwork safety gate** — safety note displayed before any breathwork technique
- **Mobile-first** — designed and tested at 375px; all interactions reachable with one thumb

---

## Tech Stack

| Layer      | Technology               |
| ---------- | ------------------------ |
| Framework  | Next.js 14 (App Router)  |
| Language   | TypeScript (strict mode) |
| Styling    | Tailwind CSS             |
| Components | shadcn/ui                |
| Animation  | Framer Motion            |
| Database   | Supabase (PostgreSQL)    |
| AI         | OpenAI gpt-4o-mini       |
| Deployment | Vercel                   |

---

## Architecture Overview

```
app/
├── page.tsx                  # Landing
├── checkin/page.tsx          # Check-in form
├── result/page.tsx           # State + explanation
├── reset/page.tsx            # Technique + steps
├── feedback/page.tsx         # Outcome capture
└── api/
    ├── analyze/route.ts      # State detection + explanation + DB write
    ├── reset/route.ts        # Technique selection + reset copy + DB write
    └── feedback/route.ts     # Outcome write

lib/
├── state-detection/
│   ├── signals.ts            # 26 signals with per-state weights
│   └── logic.ts              # detectState() — pure rule-based scoring
├── content/
│   ├── resets.ts             # Reset library: 25 state × context slots
│   └── fallbacks.ts          # Pre-written explanations and closing messages
├── openai/
│   ├── client.ts             # Server-only OpenAI client
│   └── prompts.ts            # All prompt templates in one place
├── supabase/
│   ├── server.ts             # Service role client (API routes only)
│   └── client.ts             # Anon client (browser)
└── context/session.tsx       # React context for cross-screen session state
```

**Key architectural decisions:**

- **AI never detects state.** `detectState()` is pure rule-based scoring. AI receives the already-detected label and personalizes the copy. This keeps detection reliable, testable, and independent of API availability.
- **All AI and DB calls in API routes.** Client components never touch OpenAI or Supabase directly.
- **Session state in React context.** Data flows across screens via `CheckinSessionProvider`. No redundant fetching between screens.
- **Fallback-first design.** Every AI call has a pre-written fallback that activates silently on timeout, error, or malformed response.

---

## AI Usage

**What AI does:**

- Generates the personalized 2–3 sentence explanation on the Result screen (`gpt-4o-mini`, max 200 tokens)
- Generates personalized step-by-step instructions and a "why this may help" sentence for the Reset screen (`gpt-4o-mini`, max 400 tokens, returns structured JSON)

**What AI does not do:**

- Detect or classify the user's state — always rule-based scoring
- Choose the technique — always a lookup against the pre-written reset library
- Operate without a safety net — every call has an explicit fallback

**Prompt design principles:**

- Warm, non-clinical language
- Hedged framing ("may", "often", "can") — never certainty claims
- No clinical terminology (HRV, cortisol, sympathetic nervous system)
- No shame or blame language
- Specific to this user's moment — not copy-pasteable into any wellness app

All prompt templates live in `lib/openai/prompts.ts`. No prompt logic is scattered across routes.

---

## Database / Persistence

Four Supabase tables, connected via soft references through `session_id`:

| Table           | Purpose                                               |
| --------------- | ----------------------------------------------------- |
| `checkins`      | Selected signals, context, session ID                 |
| `state_results` | Detected state, explanation, `ai_used` flag           |
| `reset_plans`   | Technique, steps, why copy, selected duration         |
| `feedback`      | Outcome (better / same / worse), linked to reset plan |

Sessions are anonymous — identified by a UUID generated on first visit and persisted in `localStorage`. No sign-up required.

The service role key is used only in API routes (server-side). The anon key is scoped to the browser. Secrets never reach the client.

---

## Safety + Fallback Design

**AI fallback:**
Both `/api/analyze` and `/api/reset` wrap OpenAI calls in try/catch with a 15-second timeout. Any failure — network error, timeout, empty response, or malformed JSON — activates the pre-written fallback silently. The user never encounters an error from AI unavailability.

**Feedback writes:**
`/api/feedback` logs DB errors server-side but always returns 200. A failed feedback write never blocks the user from seeing their closing message.

**Safety gates:**

- Breathwork techniques display a safety note before instructions: _"Stop if you feel dizzy, lightheaded, or uncomfortable."_
- 988 crisis link is present on Landing and Feedback screens — always visible, never behind a toggle.

---

## Development Process

This project was built spec-first. Before writing production code, I authored:

- A **product constitution** defining what the app is, what it must never become, and a decision hierarchy for resolving tradeoffs
- A **full MVP specification** covering states, signals, techniques, tone rules, and database schema
- A **75-task implementation plan** across six milestones, with explicit checkpoints that had to pass before the next milestone could begin

I used Claude (Anthropic) as a development partner throughout — writing code, reviewing architecture decisions, and catching edge cases. The distinction that matters: I drove the product direction, defined the constraints, validated each milestone manually, debugged failures, and made every architectural decision. AI accelerated execution within a structure I designed.

**Decisions that required real judgment:**

- Choosing rule-based detection over AI detection — for reliability and debuggability
- Designing the fallback chain to be invisible to users
- Making feedback DB failures non-blocking by design
- Writing prompt guardrails that prevent clinical, overconfident, or generic copy

---

## Running Locally

```bash
git clone https://github.com/Benzjosue/Unstuck
cd Unstuck
npm install
```

Create a `.env.local` file in the project root with the variables listed below, then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

```env
OPENAI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

All four are required. No leading spaces after `=`.

**Supabase schema:**

```sql
CREATE TABLE checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  signals TEXT[] NOT NULL,
  context TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE state_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checkin_id UUID NOT NULL,
  session_id TEXT NOT NULL,
  state_label TEXT NOT NULL,
  explanation TEXT NOT NULL,
  ai_used BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reset_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_result_id UUID NOT NULL,
  session_id TEXT NOT NULL,
  technique_id TEXT NOT NULL,
  technique_name TEXT NOT NULL,
  technique_type TEXT NOT NULL,
  duration_selected TEXT,
  steps TEXT[] NOT NULL,
  why TEXT NOT NULL,
  ai_used BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reset_plan_id UUID NOT NULL,
  session_id TEXT NOT NULL,
  outcome TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Deployment

Deployed on Vercel. To deploy your own instance:

1. Push the repo to GitHub
2. Import at [vercel.com/new](https://vercel.com/new)
3. Add the four environment variables under Project Settings → Environment Variables
4. Deploy

`npm run build` passes with zero errors and zero TypeScript warnings.

---

## What I Learned

**On product:** Defining what a product is _not_ is as important as defining what it is. The constitution forced decisions I would have otherwise deferred — and those decisions made every subsequent implementation choice cleaner.

**On AI integration:** Keeping AI out of state detection entirely was the right call. Rule-based scoring is deterministic, debuggable, and testable. AI adds warmth to the output; it doesn't drive the logic. That separation is what makes the system reliable.

**On fallbacks:** Building the fallback path before the AI path forced me to think clearly about what the app needs to guarantee. The fallback isn't a degraded experience — it's a complete one.

**On spec-driven development:** Writing a 75-task breakdown before coding felt like overhead at first. In practice, it eliminated the most common source of scope creep: building the wrong thing next. Every task had a clear done condition.

**On TypeScript:** Strict mode from the start, with all types flowing from a single `lib/types.ts`, kept the codebase consistent and made refactors safe. Zero type errors at the final gate.

---

## Future Improvements

These are ideas for a future iteration. None are in the current codebase.

- **Session history** — view past check-ins and state patterns over time
- **User accounts** — optional sign-up to persist history across devices
- **Technique rotation** — avoid recommending the same reset in consecutive sessions
- **Onboarding flow** — brief first-visit explanation for new users
- **Push notifications** — optional check-in reminders at user-defined times
- **Biometric input** — HRV or wearable data as an additional input signal

---

## Resume / Interview Talking Points

- Built a production consumer wellness web app end-to-end: spec, architecture, implementation, and deployment
- Designed a hybrid AI/rule-based architecture — deterministic scoring for reliability, AI for personalization — with explicit fallback paths covering all failure modes
- Wrote a product constitution before writing production code; used it as the tiebreaker for every architectural tradeoff
- Implemented anonymous session persistence, cross-screen React context, input-validated API routes, route guards, and full DB write coverage across four Supabase tables
- Applied spec-driven development: 75 tasks across 6 milestones with explicit checkpoints that gated each phase
- Zero TypeScript errors in strict mode at final delivery; verified demo loop runs in 45 seconds

---

## Closing

Unstuck is a project I built because I wanted something like it to exist. The constraint that mattered most was written into the product constitution from the start:

> _"I feel off → I open Unstuck → I feel better. If the app can't deliver that in under three minutes, it has failed."_

The verified demo run: 45 seconds.

---

## Repo Description

> A mobile-first nervous system awareness tool: check in, identify your state, and get a context-aware reset — no account required, verified demo in 45 seconds.

---

## Title / Tagline Alternatives

1. **Unstuck** — _"Notice what's off. Do something about it."_
2. **Unstuck** — _"A fast check-in and reset tool for when you feel off but can't name why."_
3. **Unstuck** — _"Awareness before action. A nervous system reset tool built for real moments."_
