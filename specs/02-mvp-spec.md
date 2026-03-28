# Phase 2: Specify — MVP Specification
# Unstuck

**Document type:** Phase 2 Spec
**Status:** Final
**Governed by:** `CLAUDE.md` (Phase 1 Constitution)
**Next phase:** Phase 3 — Plan (architecture, folder structure, schema, API contracts)

---

## 1. Product Name

**Unstuck**

Tagline: *Awareness before burnout.*

---

## 2. Product Summary

Unstuck is a brain-body awareness app that helps people recognize early signs of overload, understand what state they may be in, and get a personalized reset before stress turns into shutdown.

It is not a meditation app. It is not a mood tracker. It is not a therapy tool. It is a real-time awareness and regulation tool that turns vague feelings into named states and named states into practical next steps.

---

## 3. Purpose

The purpose of Unstuck is to help people become more aware of their mental and physical state in real time, so they can respond with the right action instead of pushing through, crashing, or feeling lost in what they are experiencing.

Most people are told to manage stress. Unstuck teaches them to *notice* it — earlier, more clearly, and with a specific action waiting on the other side.

---

## 4. Core Intention

Unstuck is designed to make self-awareness easier and more practical.

A lot of people feel off, overwhelmed, foggy, tense, restless, or emotionally flat — but they do not know what is happening, why it is happening, or what to do next. They push through. They ignore the signals. They hit a wall.

The app closes that gap by:

- Translating what the user notices in their body and mind into a likely nervous system state
- Giving that state a clear, non-clinical name
- Offering a practical reset matched to that state and their current context
- Asking if it helped — and using that signal to close the loop

The core transformation the app delivers:

> **"I feel off" → "I understand what may be happening and I know what to do next."**

---

## 5. Target User

### Who they are

High-performing, high-effort people who are used to pushing through — students, athletes, young professionals, founders, and creators — who regularly experience stress, overload, brain fog, physical tension, or emotional flatness without fully understanding what their body is signaling.

Wellness-curious users who want practical tools, not lectures.

### How they behave

- They often miss early signs of overload until it's too late
- They do not use traditional wellness tools consistently because those tools feel passive, generic, or like another chore
- They want to feel better *right now*, not after a 30-day program
- They are skeptical of clinical language but open to body-based explanations
- They check their phone when they feel stuck — and that's exactly when Unstuck should be useful

### Their entry point

They feel *something* — off, tense, foggy, flat, overwhelmed, restless, disconnected — but they can't name it and don't know what to do. That is the moment Unstuck is built for.

### What they are NOT

- They are not in crisis
- They are not seeking a diagnosis
- They are not mental health patients
- They are not wellness enthusiasts who track every metric

---

## 6. Core Problem

People often miss the early warning signs of stress and nervous-system overload — not because they don't care, but because they don't have a simple, fast way to check in with themselves and act on what they notice.

Most existing wellness tools fail them in one of four ways:

1. **Too generic** — breathing exercises and meditation suggestions that don't reflect how the user actually feels right now
2. **Too passive** — mood logging, journaling, or tracking that requires effort without immediate payoff
3. **Too educational** — content-heavy experiences that explain the problem but don't help in the moment
4. **Too clinical** — language and framing that feels like a diagnostic tool, not a real-time aid

As a result, users stay disconnected from what their body is telling them, and they don't know how to regulate themselves in the moment. They push through until they crash.

---

## 7. Core Solution

Unstuck helps users move through a simple, structured check-in that produces a named state, a personalized reset, and a feedback loop — all in under five minutes.

The solution has four steps:

1. **Notice** — The user selects signals they're experiencing right now (physical, mental, emotional). The app guides them to notice, not just report.
2. **Identify** — The app maps their signals to a likely nervous system state and names it clearly.
3. **Reset** — The app delivers a reset technique matched to that state and where the user currently is.
4. **Reflect** — The user reports whether it helped. The loop closes.

This is not a content library the user browses. It is a structured, responsive experience that meets the user at their current state and gives them one next step.

---

## 8. Why It Matters

Most stress management tools assume the user already knows what they're dealing with. Unstuck doesn't. It starts one step earlier — at the point where the user just feels *off* but doesn't know why.

That gap is where people lose time, make poor decisions, push too hard, or shut down entirely. Catching it early — before overload becomes crisis — is where real regulation happens.

Unstuck makes self-awareness practical, fast, and immediately actionable. It doesn't require the user to be a wellness expert, to remember a technique, or to commit to a habit. It just asks: *what are you noticing right now?* — and then it takes it from there.

---

## 9. What Makes Unstuck Different

Most wellness tools start with content, routines, or passive tracking. **Unstuck starts with awareness.**

Instead of asking users to browse resources or log emotions in a vague way, it helps them answer four specific questions — in order:

| # | Question | What happens |
|---|----------|--------------|
| 1 | What am I noticing right now? | User selects signals from a curated list |
| 2 | What state might I be in? | App names a likely nervous system state |
| 3 | What should I do next? | App delivers a context-matched reset |
| 4 | Did that actually help? | User gives quick feedback; loop closes |

The order matters. Awareness always comes before action. The state is always named before the reset is offered. This sequence is not flexible — it is the product.

---

## 10. Core User Journey

The MVP protects exactly one loop:

```
Landing → Check-in → Result → Reset → Feedback
```

### Screen 1: Landing

**What the user sees:** A calm, clear entry screen with a single call to action.

**What it communicates:** "You feel off. We can help you figure out what's happening and what to do next."

**What the user does:** Taps "Check in now."

**What happens next:** User proceeds to Check-in. No account. No login. No setup.

---

### Screen 2: Check-in

**What the user sees:** A curated list of plain-language signals organized by type (physical, mental, emotional, behavioral). A context picker asking where they are right now.

**What it communicates:** "What are you noticing? You don't have to know what it means — just tell us what's happening."

**What the user does:**
- Selects the signals that apply right now (multi-select)
- Selects their current context: private space / at a desk / out in public / in a car / lying in bed

**What happens next:** Signals and context are submitted. The app calculates the most likely state.

**Guardrail:** The check-in never asks the user to diagnose themselves. It asks what they *notice*, not what they *have*.

---

### Screen 3: Result

**What the user sees:** A named nervous system state and a brief, plain-language explanation of what that state means.

**The five possible states:**
- Overactivated
- Tense & Overloaded
- Wired but Tired
- Foggy & Depleted
- Shut Down

**What it communicates:** "Based on what you selected, you may be in [State]. Here's what that often feels like — and why your body might be doing this."

**What the user does:**
- Reads the state name and explanation
- Optionally expands "Why does this happen?" for a brief educational micro-explanation
- Taps "Get my reset"

**Guardrail:** The state is always framed as "may be" or "often looks like" — never as a certainty or diagnosis.

---

### Screen 4: Reset

**What the user sees:** One primary reset technique matched to their state and context, with step-by-step instructions. A duration option (30 seconds / 2 minutes / 5 minutes).

**What it communicates:** "Here's something you can do right now, right where you are."

**What the user does:**
- Reviews the technique
- Selects a duration if shown
- Completes the reset
- Taps "I'm done"

**Guardrail:** The reset must be doable in the context the user selected. A user who is in public is never shown a technique that requires lying down or making sounds. A user in a car is never shown a technique that requires closing their eyes.

---

### Screen 5: Feedback

**What the user sees:** A simple, low-pressure reflection prompt with three choices.

**What it communicates:** "We're not looking for a perfect answer. Just what's true right now."

**What the user does:** Selects one:
- Better
- Same
- Worse

**What happens next:**
- The app responds with a brief, non-judgmental message regardless of outcome
- The user is offered a gentle exit: "Done for now" or "Check in again"

**Guardrail:** No response to feedback ever implies the user did something wrong. No guilt. No pressure to try again immediately.

---

## 11. MVP Goal

Deliver a working, polished, end-to-end version of the core loop that a real user can complete in under five minutes — with no instruction, no login, and no prior knowledge of nervous system science — and come away feeling like they were heard and given something useful.

The MVP exists to prove one thing: **the loop works.**

---

## 12. In Scope for MVP

### Core functionality

- Landing screen with clear value proposition and single CTA
- Check-in screen with multi-select signal list and context picker
- State result screen with named state, plain-language explanation, and optional educational expansion
- Reset delivery screen with technique instructions and duration options
- Post-reset feedback screen with three-option prompt and response
- Anonymous session management (no login required)
- AI-generated state explanation and personalized reset copy
- Fallback pre-written content when AI is unavailable
- Context-aware reset delivery (technique adapts to where the user is)
- Mobile-responsive design optimized for phone screens

### States supported at launch

All five nervous system states must be supported with at least one named explanation and at least one reset per context type.

### Contexts supported at launch

All five contexts must be supported: private space, at a desk, in public, in a car, lying in bed.

### AI role at launch

AI personalizes the explanation and reset copy. State detection is rule-based. The AI never diagnoses — it narrates and guides.

---

## 13. Out of Scope for MVP

The following are hard exclusions. They are not deferred — they are not in this product at this stage.

| Feature | Reason excluded |
|---------|-----------------|
| User accounts and authentication | Adds friction, not needed to prove the loop |
| Session history and pattern tracking | Requires persistent storage and history UI — not MVP |
| Push notifications | Requires device permissions and scheduling logic |
| Habit tracking or streaks | Turns a tool into a commitment — wrong for MVP |
| Wearable or biometric integrations | Hardware dependency, out of scope entirely |
| Social features or sharing | Misaligned with private, personal-use nature of the app |
| Custom reset libraries or user favorites | Content management scope |
| Onboarding flow or user profiling | No login means no lasting profile |
| Analytics dashboard or admin view | Post-launch |
| Voice input or audio guidance | Scope expansion |
| Multiple language support | Post-launch |

---

## 14. Product Principles for This MVP

These principles govern every product and design decision. When in doubt, return here.

1. **The loop is sacred.** Every decision protects Landing → Check-in → Result → Reset → Feedback. If a feature disrupts the loop, it doesn't ship.
2. **Awareness before action.** The state is always named before the reset is offered. This order is not optional.
3. **One thing at a time.** Each screen has one job. One question. One CTA. No competing actions.
4. **Plain language always.** No clinical terms. No jargon. No assumptions about what the user knows.
5. **Context is real.** The reset must be doable where the user actually is right now. Context is not cosmetic — it changes the output.
6. **Never certain, always useful.** The app never claims to diagnose. It always offers a practical next step.
7. **Speed is care.** The user is not okay right now. Respect their state by making the experience fast and low-effort.
8. **No shame, no blame.** Feedback screens never imply failure. The user cannot do this wrong.

---

## 15. User Experience Requirements

### Language requirements

The app must avoid four tone failure modes on every screen:

- **Clinical framing** — No diagnostic language, medical terminology, or disorder names
- **Overconfident certainty** — No "you are in X state" — always "you may be" or "this often looks like"
- **Generic fluff** — No "take a deep breath and be kind to yourself" without context or instruction
- **Shame or blame** — No language that implies the user caused their state or failed to regulate it

### Design requirements

- Every screen must have one clear primary action
- The user should never feel confused about what to do next
- The visual design must feel calm, grounded, and safe — never clinical, never loud
- Color and spacing are used to communicate containment, not stimulation
- The experience must feel like it was designed for someone who is already a little overwhelmed

### Performance requirements

- The app must load the landing screen in under 2 seconds
- The check-in must be completable in under 60 seconds
- The result and reset must appear without perceptible delay
- The feedback screen must appear immediately after the reset is marked complete

### Failure state requirements

- If the AI is unavailable, the app falls back to pre-written state explanations and reset instructions
- The fallback must be indistinguishable in quality from AI-generated content from the user's perspective
- No screen should ever show an error, loading spinner, or blank state to the user

---

## 16. Acceptance Criteria

Each screen must pass all criteria before the MVP is considered shippable.

### Landing screen

- [ ] A first-time user can understand the purpose of the app within 5 seconds without reading any explanatory text
- [ ] There is exactly one CTA visible above the fold
- [ ] The CTA navigates the user to the check-in screen without login or setup
- [ ] No account prompt appears

### Check-in screen

- [ ] The signal list contains plain-language descriptions that a non-expert user can understand without explanation
- [ ] The user can select multiple signals
- [ ] The context picker is visible and required before submission
- [ ] All five contexts are available: private / desk / public / car / bed
- [ ] The user can submit the check-in in under 60 seconds from landing on this screen
- [ ] The check-in never uses clinical diagnostic language

### Result screen

- [ ] The state name appears prominently and is phrased in plain language
- [ ] The explanation is framed as "may be" or "often looks like" — never as a certainty
- [ ] An optional educational expansion is available but collapsed by default
- [ ] The CTA to get a reset is clear and one tap away
- [ ] The explanation does not use clinical terms, disorder names, or diagnostic framing

### Reset screen

- [ ] The technique shown is contextually appropriate for the context the user selected
- [ ] The instructions are clear enough to follow without external guidance
- [ ] At least one duration option is available (30s / 2min / 5min)
- [ ] A user who selected "in public" is never shown a technique requiring privacy
- [ ] A user who selected "in a car" is never shown a technique requiring closed eyes
- [ ] "I'm done" is available without requiring a set timer to expire

### Feedback screen

- [ ] Exactly three options are presented: Better / Same / Worse
- [ ] The app responds to all three outcomes with a non-judgmental, non-prescriptive message
- [ ] No response implies the user did something wrong
- [ ] The user is offered a graceful exit after feedback

### Overall loop

- [ ] A user can complete Landing → Check-in → Result → Reset → Feedback in under 5 minutes
- [ ] The user never sees an error state, broken UI, or blank screen during the loop
- [ ] The fallback content (no AI) is complete for all five states across all five contexts
- [ ] The experience works on a mobile browser without horizontal scrolling

---

## 17. Non-Goals

These are deliberate product decisions, not limitations.

**Unstuck does not track history in the MVP.** Pattern recognition requires multiple sessions and a persistent identity. That's a post-MVP feature. The MVP proves the single-session loop works.

**Unstuck does not ask users to log in.** The user is already stressed. Adding an account step at the beginning adds friction at exactly the wrong moment. Anonymous sessions are a feature, not a limitation.

**Unstuck does not teach nervous system science.** It makes awareness practical. Educational content is optional and secondary — never the main event.

**Unstuck does not give advice.** It offers a technique. The distinction matters. Advice implies authority and prescription. A technique is a tool the user can try.

**Unstuck does not build habits.** It shows up when you need it. Streaks, reminders, and habit loops are a future product. The MVP earns trust first.

**Unstuck does not compete with therapy.** It is a consumer wellness tool. Users in crisis are shown a safety message and directed to appropriate support. The app never positions itself as treatment.

---

## 18. Success Definition

The MVP is successful when all of the following are true:

**The loop is complete and working.**
A real user — not a developer, not someone who knows the system — can open the app, complete the full loop from landing to feedback, and exit without confusion, error, or instruction.

**The state result feels accurate.**
When shown a state name, users recognize it as plausible given what they selected. They don't need to be told "that's exactly right" — they need to think "yeah, that tracks."

**The reset feels relevant.**
The technique shown matches where the user is and what they're dealing with. It is not a generic suggestion. It is specific enough that the user can imagine doing it in their actual current situation.

**The tone feels human, not clinical.**
No screen makes the user feel like they're being assessed, diagnosed, or evaluated. The language feels like a calm, knowledgeable friend — not a medical interface.

**The loop is completable in under 5 minutes.**
Speed is a core part of the value proposition. A user in distress does not have patience for a slow experience.

**The fallback works.**
If the AI goes down, the user experience is unaffected. Pre-written content covers all five states across all five contexts with the same quality standard as AI-generated content.

**The app is demonstrable at the hackathon.**
A judge who has never heard of Unstuck can be walked through one complete loop, understand the value proposition by the end, and not ask "but what is this actually for?"

---

*This document is Phase 2 of the Unstuck spec-driven development workflow.*
*It is governed by `CLAUDE.md` (Phase 1 Constitution).*
*Next: `specs/03-architecture.md` — Phase 3: Plan.*
