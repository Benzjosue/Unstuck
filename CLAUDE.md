# CLAUDE.md — Unstuck
## Phase 1: Constitution

> This document is the operating constitution for the Unstuck project.
> It defines what this product is, what it must never become, and how every decision should be made.
> Read this entire file before writing any code.
> When in doubt, return here first.

---

## 0. Before Any Code Is Written

The following must be true before implementation begins:

- [ ] You have read this entire document
- [ ] You know what the core loop is and can state it in one sentence
- [ ] You know what the MVP includes and what it does not
- [ ] You know the Decision Hierarchy and can apply it to a tradeoff
- [ ] You know the tone rules and can identify a violation on sight
- [ ] You know which features are stretch and will not build them first
- [ ] You have the environment variables ready (Supabase + OpenAI)

Do not begin Phase 5 (Implement) until all boxes above are checked.

---

## 1. Product Identity

### What Unstuck Is
A consumer wellness app that helps people recognize early signs of nervous system overload, understand their current state, and take fast, practical action to feel better — in the moment, wherever they are.

### What Unstuck Is Not
- Not a diagnostic tool
- Not a medical or therapeutic app
- Not a mood tracker or journaling app
- Not a productivity system
- Not a complex wellness platform
- Not a substitute for professional mental health care

### The Single Most Important Sentence
> "I feel off → I open Unstuck → I feel better."

If the app cannot deliver that in under 3 minutes, it has failed its core purpose.

### Positioning
Unstuck is a **nervous system awareness and reset tool**, positioned as **general wellness software**.
It helps users notice and respond to their own state. It does not assess, diagnose, or treat.

---

## 2. The Core Loop

This is the MVP. Everything else is secondary.

```
Landing → Check-in → Result → Reset → Feedback
```

**The core loop is the product.** A polished core loop beats a feature-rich broken product.
The core loop must work completely before any other feature is touched.

### What Each Step Does
| Step | User Action | App Response |
|------|-------------|--------------|
| Landing | Arrives, reads, decides | Explains what the app does. One clear CTA. |
| Check-in | Selects signals, rates feelings, picks context | Collects structured input. |
| Result | Reads their state | App identifies state and explains it warmly. |
| Reset | Chooses duration, follows steps | App delivers a context-appropriate technique. |
| Feedback | Reports how they feel after | App captures outcome. Session complete. |

---

## 3. Decision Hierarchy

When a tradeoff arises — between speed and quality, between adding a feature and protecting the loop, between a clever solution and a simple one — use this hierarchy. Higher beats lower. Always.

```
1. Protect the core loop
   The loop must always work, end to end, without errors.

2. Protect user clarity and emotional safety
   The user must always feel understood, never confused or alarmed.

3. Prefer simplicity and speed
   The simpler, faster solution is correct unless there is a specific reason otherwise.

4. Preserve polish and consistency
   Design quality matters. A broken but beautiful screen is still broken.
   A working but ugly screen is better than a broken one.

5. Defer stretch features
   If it is not in the MVP scope, it does not exist yet.
```

**How to use this:** When you face a decision with no clear answer, ask: which option better satisfies item 1? If tied, move to item 2. Continue down the hierarchy until resolved.

---

## 4. Product Principles

These are non-negotiable. They apply to every feature, screen, and line of copy.

1. **Awareness before action.** Always show the user what state they are in before suggesting what to do. Never skip to solutions.
2. **Speed is a feature.** Three minutes or less, end to end. Every unnecessary step is a failure.
3. **Context always matters.** Never recommend a technique the user cannot do where they are right now.
4. **Hybrid logic is the rule.** Rule-based scoring detects the state. AI explains and personalizes. AI never detects alone.
5. **Warm, not clinical.** Every word should feel like a calm, smart friend — not a doctor, a bot, or a wellness brand.
6. **Feedback is core, not optional.** The post-reset feedback screen is not a nice-to-have. It completes the loop.
7. **Mobile first, always.** Design for 375px. Test on 375px. Desktop is a bonus.
8. **Anonymous by default.** Do not require sign-up. Users must experience value before being asked for anything.
9. **Pre-written content is the safety net.** If AI is unavailable, the app must still work using pre-written resets.
10. **Never make promises the app cannot keep.** Do not use language like "this will calm you" or "you'll feel better." Use "may help" and "many people notice."

---

## 5. MVP Scope

### ✅ In Scope — Build These

1. Landing page with CTA
2. Check-in screen: signal selection, 5 rating sliders, context selector, optional free text
3. Result screen: state label + AI-generated warm explanation
4. Reset screen: technique name, step-by-step instructions, "why this helps", duration selector
5. Feedback screen: outcome capture + closing message
6. Supabase: persist check-ins, state results, reset plans, and feedback
7. OpenAI (gpt-4o-mini): generate explanation and personalized reset copy
8. Anonymous sessions via session_id — no forced sign-up
9. Pre-written fallback content for every state if OpenAI is unavailable

### 🚫 Out of Scope — Do Not Build These Until the Core Loop Is Complete and Verified

- History or trends screen
- User authentication or account creation
- Repeat-session technique variation
- Onboarding flow or tutorial
- Push notifications or reminders
- HRV or biometric integration
- Streak tracking or habit features
- Any admin, analytics, or settings screen

**Hard gate:** Do not begin any out-of-scope feature until every item in the Definition of Done is satisfied. No exceptions.

---

## 6. Tone & Copy Guardrails

### Voice
Warm. Calm. Intelligent. Specific. Human. Like a trusted friend who understands the nervous system.

### Four Failure Modes — Avoid All of These

**1. Clinical / diagnostic language**
Never use: diagnose, treat, disorder, condition, HRV, sympathetic nervous system, dorsal vagal, dysregulation, cortisol, clinical, therapeutic.

**2. Overconfident certainty**
Never write: "this will calm you," "you'll feel better," "this works," "this is proven to."
Always write: "may help," "many people notice," "this can," "you might find."

**3. Generic wellness fluff**
Never write anything that could appear in any wellness app. No "take a deep breath and center yourself." Every sentence should feel specific to this user's moment.

**4. Shame or blame language**
Never imply the user caused their state or should have caught it sooner. Never use: "you've been pushing too hard," "if only you'd," "you need to." The app is a supporter, not a judge.

### Tone Examples

**Good:**
> "Your system is running hot right now. Racing thoughts and tight shoulders are your body bracing — even when nothing is actually happening. Let's give it a reason to ease off."

**Bad — clinical:**
> "You are experiencing sympathetic nervous system overactivation. Elevated cortisol is affecting your focus. You should practice diaphragmatic breathing."

**Bad — overconfident:**
> "This breathing exercise will calm your nervous system and restore your HRV within minutes."

**Bad — generic fluff:**
> "Take a moment to breathe and center yourself. You deserve peace."

**Bad — shame:**
> "It sounds like you've been pushing yourself too hard. Make sure you're taking care of yourself."

### Framing Rules
- Always frame the state as something that makes sense given the user's situation — not a flaw
- Always frame the reset as an option the user is choosing — not a prescription
- Always end explanations with forward momentum toward the next step
- Never frame the app as knowing more about the user than the user does

---

## 7. UX & Design Principles

### Mobile First
- All screens: `max-w-md mx-auto px-5 py-6`
- Design for 375px width minimum
- Every interaction must be reachable with one thumb

### Speed and Flow
- No screen should require more than 60 seconds to complete
- Loading states must appear within 1 second of any API call
- Never show a blank screen — always show a loading state or error state
- Transitions between screens must feel smooth and calm, not abrupt

### Calm Visual Language
- Soft spacing, clean cards, generous white space
- No aggressive colors, sharp shadows, or clinical whites
- Rounded corners everywhere (`rounded-2xl` for cards, `rounded-xl` for buttons, `rounded-full` for chips)
- Avoid dashboards, grids of numbers, or anything that looks like a medical app

### Design System (Reference — Full Tokens in Phase 3)
```
Primary text / dark:     #2C3E50  (brand-slate)
Primary accent:          #3D7A8A  (brand-teal)
Accent light bg:         #EAF4F6  (brand-teal-light)
CTA / warm accent:       #E07A5F  (brand-warm)
CTA light bg:            #FDF0ED  (brand-warm-light)
Page background:         #F4F6F7  (brand-mist)
Secondary text:          #7F8C8D  (brand-mid)
Borders:                 #E5E7EB  (brand-border)
```

### Animation Standard
- Screen entrance: `opacity 0→1, y 16→0, 350ms ease-out`
- Chip selection: `scale 0.96 on tap`
- Never use animation to delay content from appearing

---

## 8. Coding Standards

These apply to every file, every function, every commit.

- **TypeScript strict mode.** `strict: true` in tsconfig. No `any`. Type everything.
- **Tailwind only.** Zero inline styles. Zero CSS modules. If Tailwind can't do it, reconsider the design.
- **All AI and database calls through API routes.** Never from client components.
- **Validate all API inputs.** Every route must check its inputs before processing.
- **Handle every error.** API routes must return meaningful errors. Never let errors silently fail.
- **Handle every loading state.** No screen should go blank while waiting for data.
- **No `console.log` in committed code.**
- **One component per file.** Keep components under 150 lines. Split if larger.
- **No hardcoded secrets.** Always use `process.env.VARIABLE_NAME`.
- **No new packages without a comment** explaining why the package is needed.

---

## 9. AI Usage Rules

These are constitutional rules, not implementation specs.

**Rule 1: AI never detects the state.** State detection is always rule-based scoring. AI receives the already-detected state label and explains or personalizes it. This is non-negotiable.

**Rule 2: AI always has a fallback.** Every AI call must have a pre-written fallback that activates if the API is unavailable, slow, or errors. The app must work without AI.

**Rule 3: One model only.** Always `gpt-4o-mini`. Never `gpt-4o`, `gpt-3.5`, or any other model.

**Rule 4: All prompts in one place.** Every prompt template lives in `lib/openai/prompts.ts`. Nowhere else.

**Rule 5: AI personalizes, it does not invent.** AI selects from pre-approved content and personalizes language. It does not create new techniques, new states, or new health claims.

**Rule 6: Set token limits.** Every OpenAI call must set `max_tokens`. Explanation: 200. Reset copy: 400.

---

## 10. Safety & Compliance Guardrails

### Regulatory Positioning
Unstuck is general wellness software. It must never cross into medical device, diagnostic tool, or mental health treatment territory.

### Required Language Rules
- Never claim the app diagnoses, treats, prevents, or cures any condition
- Never use: "medical," "diagnose," "treat," "cure," "therapy," "clinical"
- Always describe the app as: "a nervous system awareness and reset tool"

### Safety Gates
- Include a safety note before any breathwork: *"Stop if you feel dizzy, lightheaded, or uncomfortable."*
- If a user's free-text input contains language suggesting self-harm or crisis → show the crisis resource message immediately. Do not proceed to the reset screen.

### Crisis Response Message (exact copy — do not modify)
> "It sounds like you might be going through something serious right now. Please reach out to the 988 Suicide & Crisis Lifeline by calling or texting 988. You don't have to face this alone."

---

## 11. Never Do Rules

### Product & UX
- Never show the result screen before the check-in is complete
- Never recommend a technique unavailable in the user's current context
- Never use clinical, diagnostic, or shame language in any user-facing copy
- Never make overconfident promises about outcomes
- Never require account creation before the user experiences value
- Never build a stretch feature before the core loop is verified complete

### Technical
- Never change working UI when adding a new feature — add only, never refactor what works
- Never use inline styles — Tailwind only
- Never skip TypeScript types on any prop, param, or return value
- Never call OpenAI or Supabase from a client component
- Never use a model other than gpt-4o-mini
- Never ask AI to detect the state — rule-based scoring only
- Never hardcode secrets or API keys
- Never leave an API route without error handling
- Never skip a loading state or error state on any async operation
- Never create files outside the defined folder structure without explicit instruction

---

## 12. Definition of Done — MVP Gate

**The MVP is not ready to demo until every single item below is true.**
One failed item means the MVP is not done.

### Core Loop
- [ ] User can complete the full check-in without errors
- [ ] App correctly identifies a state based on signals and ratings
- [ ] Result screen shows a warm, non-clinical explanation of the detected state
- [ ] Reset screen shows technique, steps, and "why this helps" copy
- [ ] Feedback screen captures outcome and saves to database
- [ ] All four Supabase tables receive data during a complete session

### Quality
- [ ] Every screen has a loading state for async operations
- [ ] Every API error is handled gracefully — no crashes, no blank screens
- [ ] If OpenAI is unavailable, pre-written fallback content appears
- [ ] The crisis safety message appears when triggered
- [ ] The safety gate appears before breathwork techniques

### Experience
- [ ] The full loop completes in under 3 minutes
- [ ] The app works without errors on a 375px mobile screen
- [ ] Screen transitions feel smooth and calm
- [ ] No clinical, diagnostic, shame, or overconfident language appears anywhere

---

## 13. Implementation Notes
*These are lightweight references for later phases. Full specs belong in Phase 3 (Plan) and Phase 4 (Tasks).*

**Tech Stack:** Next.js 14 App Router · Tailwind CSS · shadcn/ui · Framer Motion · Supabase · OpenAI gpt-4o-mini · Vercel

**Core Tables:** `checkins`, `state_results`, `reset_plans`, `feedback`

**Two API Routes:** `POST /api/analyze` (detect state + generate explanation) · `POST /api/reset` (select technique + generate copy)

**State Detection:** Rule-based weighted scoring across 26 signals + rating bonuses → highest score wins. Full table in `lib/state-detection/logic.ts`.

**The 5 States:** Overactivated · Tense & Overloaded · Wired but Tired · Foggy & Depleted · Shut Down

**Session State:** Carry data across screens via React context (`useCheckin` hook). Do not re-fetch from DB between screens.

**Anonymous Sessions:** Use `session_id` (UUID in localStorage). No sign-up required for MVP.

**Defaults:** Slider range 0–10 · Duration options 2min and 5min · Free text max 200 chars · Loading timeout 15s

---

### What Should Move to Later Phases

**Phase 2: Specify**
- Full user journey with acceptance criteria per screen
- The 5 states with detailed descriptions and primary goals
- Signal list with user language mappings
- Reset technique library with evidence levels
- Post-reset feedback question copy
- Onboarding blurb and educational micro-content
- Free-text interpretation guide

**Phase 3: Plan**
- Complete folder structure with file paths
- Database schema with full SQL
- TypeScript type definitions
- Session state interface (`CheckinSession`)
- Full API route specifications (inputs, outputs, processing steps)
- Full signal weight table
- AI prompt templates
- Component breakdown per screen
- Tailwind config with full color tokens

**Phase 4: Tasks**
- Ordered task list with dependencies
- Build timeline and phase gates
- Per-screen implementation checklist
- Supabase setup steps
- Vercel deployment steps

**Phase 5: Implement**
- Actual source code
- Environment variable values
- Pre-written reset content library
- Defaults for every underspecified interaction

---

*End of Phase 1 Constitution.*
*This document governs everything that follows.*
*When Phases 2–5 conflict with this document, this document wins.*
