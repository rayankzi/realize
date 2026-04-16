# The 5-Layer Memory Architecture for Claude Code

**Topic/Category:** AI Tools / Claude Code Configuration
**Primary Goal of the Reel:** Introduce a comprehensive 5-layer memory system for Claude Code that goes far beyond the default CLAUDE.md setup, giving Claude persistent context, live awareness, and behavioral learning across sessions.

---

## Executive Summary

This reel presents a layered memory architecture for Claude Code that solves the problem of context loss between sessions. The creator argues that most users only use CLAUDE.md (layer 1), but a truly powerful setup requires five distinct layers — each handling a different type of memory: permanent rules, session continuity, live git context, behavioral learning, and a full knowledge base. The full setup is available as an open-source repo called "recall-stack."

## Core Insights & Takeaways

- **Insight 1:** CLAUDE.md is not a memory system — it's a static config file that loads rules but doesn't remember anything between sessions.
- **Insight 2:** primer.md provides session continuity by rewriting itself at the end of every session with active project state, last completed work, next steps, and open blockers.
- **Insight 3:** memory.sh injects live git context (last 5 commits, modified files, current branch) at launch so Claude already knows what changed before you type anything.
- **Insight 4:** A self-learning agent memory layer extracts behavioral patterns from past sessions and changes how Claude responds in future ones — described as "actual learning, not retrieval."
- **Insight 5:** Connecting an Obsidian vault makes your entire personal knowledge base available as Claude's working context.

## Narrative & Step-by-Step Breakdown

- **Beginning (Hook):** The creator opens with a bold corrective statement — "CLAUDE.md is not a memory system and primer.md is not enough" — immediately challenging common assumptions.
- **Middle (Core Architecture):** Each of the five layers is introduced sequentially, with a clear explanation of what it does and why the other layers can't replace it:
  1. **CLAUDE.md** — Permanent rules and preferences. Static. No memory.
  2. **primer.md** — Self-rewriting session state. Active project, last completed, next steps, blockers.
  3. **memory.sh** — Shell script that injects live git context at launch.
  4. **Self-learning agent memory (Hindsight)** — Extracts behavioral patterns and adapts Claude's responses over time.
  5. **Obsidian vault** — Full knowledge base as working context.
- **End (Call to Action):** The creator highlights that "most people have layer 1, some have layer 2, but almost nobody has all 5," then directs viewers to comment "memory" for the full guide and repo.

## Visual Context & On-Screen Text

No frames were extracted for this reel. This analysis is based on the transcription and caption only. On-screen text likely mirrored the layer names and descriptions spoken in the transcription based on the structured delivery style.

## Hook & Call to Action

- **The Hook:** "CLAUDE.md is not a memory system and primer.md is not enough" — a direct challenge to common practice that creates immediate curiosity for Claude Code users who thought they had a complete setup.
- **Call to Action:** Comment "memory" for the full setup guide. The repo is linked at `github.com/ksukirya/recall-stack`.
