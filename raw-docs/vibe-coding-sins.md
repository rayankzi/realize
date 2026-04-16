# 7 Vibe Coding Sins That Will Destroy Your Codebase

**Topic/Category:** Tech / Developer Education / AI Tools
**Primary Goal of the Reel:** To warn developers — especially those who rely heavily on AI coding tools — about dangerous habits ("sins") that lead to insecure, unmaintainable, and broken codebases.

---

## Executive Summary

The creator delivers a sharp, opinionated breakdown of seven critical mistakes developers make when "vibe coding" (letting AI do all the work without understanding it). The central thesis is simple: **Read the code.** Whether it's auth systems with insecure JWT handling, copying entire errors into AI without diagnosing them first, blindly adopting AI-chosen tech stacks, or letting AI handle payments and sensitive user data — all of these sins stem from the same root cause: developers not engaging with what the AI produces. The video is fast-paced, conversational, and clearly Part 1 of a series.

## Core Insights & Takeaways

- **Read the code your AI writes:** If you can't explain how it works, you can't debug or optimize it — that's a liability, not a feature.
- **Don't blindly copy-paste errors into AI:** Read the error yourself first. Dumping the full stack trace into a model like Gemini can trigger 12 unnecessary changes and multiply your bugs.
- **Don't let AI pick your stack:** Do your own research. AI often picks generic or suboptimal tools; a little investigation frequently surfaces better alternatives for your specific use case.
- **Never delegate auth and payments entirely to AI:** Passwords may end up in plain text, API keys may be exposed, and sensitive data (IDs, SSNs) may be mishandled. If you get breached, ignorance is not a defense.
- **Insecure JWT defaults are a real risk:** No refresh tokens, sessions that never expire, secrets stored client-side — these are silent failures that ship if you don't read the output.
- **Clerk is recommended for authentication:** The creator explicitly endorses Clerk (not an ad) as a superior alternative to AI-generated auth systems.
- **Part 2 is coming:** The creator signals this list isn't exhaustive; more sins will be covered in a follow-up.

## Narrative & Step-by-Step Breakdown

**Beginning (Hook):** Opens with a direct, punchy line — "Never commit these seven sins when you're vibe coding" — immediately signaling high-stakes, actionable content for the AI-dev audience.

**Middle (Core Sins Covered):**

1. **Sin 1 — Not reading the code:** AI builds an auth system, it "works," but JWT tokens have no refresh, sessions never expire, secrets are on the client. You never checked.
2. **Sin 2 — Copy-pasting errors into AI without reading them:** A one-line fix turns into 12 AI-generated changes and 3 new bugs. Read the error first.
3. **Sin 3 — Letting AI choose your tech stack:** Not knowing what you're using or why. Research tools yourself; you'll often find better options (e.g., Clerk for auth).
4. **Sin 4 — Letting AI handle auth and payments with sensitive data:** Passwords in plain text, exposed API keys, mishandled SSNs/IDs. Legal and security exposure is on you.

**End:** Creator acknowledges the video is running long, teases Part 2, and closes on the recurring theme: **Read.**

## Visual Context & On-Screen Text

No frames were extracted for this reel. This analysis is based entirely on the transcription and caption. The caption itself is a single word — **"READ"** — with a megaphone emoji, which functions as a thematic anchor and reinforces the creator's core message throughout.

## Hook & Call to Action

- **The Hook:** "Never commit these seven sins when you're vibe coding." — A bold, list-format promise that triggers curiosity and is immediately relatable to developers using AI tools.
- **Call to Action:** Implicit — the creator signals Part 2 is coming, which encourages followers to stay tuned. No explicit link-in-bio CTA, but the one-word caption ("READ") serves as a punchy, memorable takeaway.
