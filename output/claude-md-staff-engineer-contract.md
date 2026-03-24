# Boris Cherny's CLAUDE.md File: The Config That Makes Claude Code Think Like a Staff Engineer

**Topic/Category:** Tech / AI Developer Tools / Claude Code Configuration
**Primary Goal of the Post:** To share and break down the personal CLAUDE.md configuration file of Boris Cherny (founder of Claude Code), revealing the 33 rules across 3 sections that govern how Claude Code operates in his repositories.

---

## Executive Summary

Boris Cherny publicly shared his personal CLAUDE.md file — the configuration that controls how Claude Code behaves inside a repository. The carousel breaks down the file into three major sections: Workflow Orchestration (6 subsections covering how Claude plans, delegates, learns, verifies, and fixes), Task Management (6-step process for tracking work), and Core Principles (3 guiding rules). The post positions this as the blueprint top engineers use to ship 10x faster from the terminal, framing CLAUDE.md as a "contract" between developer and AI agent.

## Key Insights & Main Ideas

- **CLAUDE.md is a behavioral contract:** It's not just configuration — it defines how Claude Code should think, plan, verify, and self-correct inside your project.
- **Plan Mode Default is rule #1:** Claude should enter plan mode for ANY non-trivial task (3+ steps or architectural decisions), and if something goes sideways, it must STOP and re-plan immediately.
- **Subagents are a first-class strategy:** The file explicitly instructs Claude to offload research, exploration, and parallel analysis to subagents to keep the main context window clean.
- **Self-improvement is built in:** After ANY user correction, Claude must update a `tasks/lessons.md` file, write preventive rules, and review those lessons at the start of every session.
- **Verification is mandatory before marking tasks done:** Claude must never mark a task complete without proving it works — run tests, check logs, diff against main, and ask "Would a staff engineer approve this?"
- **Elegance is balanced, not maximized:** For non-trivial changes, pause and ask if there's a more elegant way. But for simple fixes, skip this — don't over-engineer.
- **Autonomous bug fixing means zero hand-holding:** When given a bug, Claude should just fix it — point at logs, errors, failing tests, and resolve them without asking.

## Detailed Breakdown / Step-by-Step

**Slide 1 — Full Overview (Annotated):**
The complete CLAUDE.md file displayed with three labeled sections (Workflow, Tasks, Principles) and a photo of Boris Cherny. This is the "at a glance" view showing all 33 rules.

**Slide 2 — Workflow Orchestration (Highlighted):**
Zooms into the 6 workflow subsections with the "Workflow" label emphasized:
1. Plan Mode Default — Always plan before building
2. Subagent Strategy — Delegate liberally, one task per subagent
3. Self-Improvement Loop — Log mistakes, write rules, iterate
4. Verification Before Done — Prove it works before marking complete
5. Demand Elegance (Balanced) — Seek elegance but don't over-engineer
6. Autonomous Bug Fixing — Just fix it, no hand-holding

**Slide 3 — Task Management (Highlighted):**
Zooms into the 6-step task management process with the "Tasks" label emphasized:
1. Plan First — Write plan to `tasks/todo.md` with checkable items
2. Verify Plan — Check in before starting implementation
3. Track Progress — Mark items complete as you go
4. Explain Changes — High-level summary at each step
5. Document Results — Add review section to `tasks/todo.md`
6. Capture Lessons — Update `tasks/lessons.md` after corrections

**Slide 4 — Core Principles (Highlighted):**
Zooms into the 3 core principles with the "Principles" label emphasized:
- **Simplicity First** — Make every change as simple as possible. Impact minimal code.
- **No Laziness** — Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact** — Only touch what's necessary. No side effects with new bugs.

**Slide 5 — Call to Action:**
Branded "Lead Gen Man" slide prompting users to comment "MD" to get the full CLAUDE.md file breakdown.

## Notable Visual Context

The carousel uses a clean, minimal design with a beige/cream background and code-style formatting for the CLAUDE.md content. Each slide progressively highlights a different section by graying out the non-focused areas, creating a "spotlight" effect that guides the reader through the three pillars. Color-coded sidebar labels (brown for "Workflow," orange for "Tasks," teal for "Principles") provide quick visual navigation. Slide 1 includes a headshot of Boris Cherny for authority signaling. The final slide uses bold branding ("Lead Gen Man") with a lime-green CTA button aesthetic.

## Verbatim Templates & Scripts

The full CLAUDE.md file content as displayed in the carousel:

```markdown
## Workflow Orchestration

### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop
- After ANY correction from the user: update tasks/lessons.md with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes -- don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests -- then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

## Task Management
1. Plan First: Write plan to tasks/todo.md with checkable items
2. Verify Plan: Check in before starting implementation
3. Track Progress: Mark items complete as you go
4. Explain Changes: High-level summary at each step
5. Document Results: Add review section to tasks/todo.md
6. Capture Lessons: Update tasks/lessons.md after corrections

## Core Principles
- Simplicity First: Make every change as simple as possible. Impact minimal code.
- No Laziness: Find root causes. No temporary fixes. Senior developer standards.
- Minimal Impact: Only touch what's necessary. No side effects with new bugs.
```

## Call to Action / Conclusion

The post ends with a strong engagement CTA: "Comment 'MD' to get the full CLAUDE.md breakdown." The caption reinforces the value proposition — "3 sections. 33 rules. Zero hand-holding. This is how top engineers ship 10x faster from the terminal." The post is attributed to Boris Cherny (@boris_cherny) and positioned as insider knowledge from the founder of Claude Code himself.
