# How to Make Claude Code Never Forget Anything

**Topic/Category:** Tech Tutorial / AI Developer Tools
**Primary Goal of the Reel:** Teach developers a simple 3-file system to give Claude Code persistent memory across sessions, so it never loses context between conversations.

---

## Executive Summary

The creator addresses a core frustration with Claude Code: it starts every session with zero memory. The solution is a lightweight, 3-file system — `primer.md`, `.claude-memory.md`, and `tasks/lessons.md` — that collectively store project state, commit history, and user corrections. By having Claude read these files at the start of each session, the tool effectively "remembers" everything from previous sessions without the user needing to re-explain anything.

## Core Insights & Takeaways

- **Insight 1:** Claude Code has no built-in persistent memory between sessions — every new session starts completely blank with no context about prior work.
- **Insight 2:** A 3-file system can solve this entirely: a session state file (primer.md), an auto-logged commit history (.claude-memory.md via git hook), and a lessons/corrections file (tasks/lessons.md).
- **Insight 3:** The system is largely automated — the git hook handles commit logging, Claude rewrites the primer at session end, and corrections accumulate passively as you work. Minimal manual upkeep required.

## Narrative & Step-by-Step Breakdown

1. **Hook/Problem Statement:** The creator opens by stating the core problem — Claude Code forgets everything the second you close it. Every session starts from zero with no memory or context.

2. **The Solution Overview:** Three files. That's the whole system.

3. **File 1 — `primer.md`:** Claude rewrites this file completely at the end of every session. When the next session starts, Claude reads it back first. It then knows exactly where you left off, what's in progress, and what's blocked.

4. **File 2 — `.claude-memory.md`:** A git hook automatically writes to this file on every commit — date, time, commit message — all logged forever without any manual effort. Claude can see the full project history passively.

5. **File 3 — `tasks/lessons.md`:** Every correction you give Claude gets written here as a rule. Claude reads these rules at session start and applies them before touching any code. This prevents repeated mistakes.

6. **The Result:** Open a session and Claude reads all three files. It knows your project, your history, and your preferences. You never re-explain anything again.

7. **Call to Action:** Comment "setup" for the exact prompts to set this up.

## Visual Context & On-Screen Text

No frames were extracted for this reel. This analysis is based on the transcription and caption only. The visual content likely included screen recordings or text overlays showing the three file names and their purposes, which is a common format for developer-focused reels.

## Hook & Call to Action

- **The Hook:** "Claude Code forgets everything the second you close it" — a relatable pain point stated directly in the first sentence, immediately resonating with anyone who has used Claude Code.
- **Call to Action:** Comment "setup" to receive the exact prompts needed to configure this 3-file memory system. Repeated both at the start and end of the caption for emphasis.
