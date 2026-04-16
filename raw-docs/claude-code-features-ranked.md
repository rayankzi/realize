# All Important Claude Code Features Ranked by Complexity

**Topic/Category:** Tech Tutorial, AI Coding Tools
**Primary Goal of the Reel:** To give a concise overview of every major Claude Code feature, ordered from simplest to most complex, so viewers understand the full toolkit available to them.

---

## Executive Summary

This reel is a rapid-fire walkthrough of six Claude Code features arranged on a complexity ladder: CLAUDE.md files, custom slash commands, skills, MCPs, custom subagents, and hooks. The creator explains what each feature does, where it lives in your project structure, and gives a brief use case — all in under a minute. The caption reinforces that this is meant to be a single-video reference guide for Claude Code's capabilities.

## Core Insights & Takeaways

- **Insight 1:** Claude Code's feature set can be understood as a progression from simple configuration (CLAUDE.md) to powerful automation (hooks), and learning them in that order is the most effective approach.
- **Insight 2:** Most features live in the `.claude/` folder of your project — commands in `.claude/commands/`, skills as folders with multiple documents and tools, agents in `.claude/agents/`, and hooks/MCPs configured in `settings.json`.
- **Insight 3:** MCPs are described as the "USB-C adapter" for Claude Code — they are the bridge to external services like Notion or Google Calendar, configured via `settings.json`.
- **Insight 4:** Custom subagents run in a separate context window from the main agent, each with their own instruction file defining behavior and task scope.
- **Insight 5:** Hooks can trigger at three distinct points: when you submit a prompt, when Claude Code writes to a file, or when Claude Code pauses to ask for your input — making them ideal for things like auto-formatting.

## Narrative & Step-by-Step Breakdown

**Beginning (Hook):** The creator opens with a direct promise — "Here's all the important Claude Code features in order of complexity" — immediately establishing the video's value proposition.

**Middle (Feature-by-Feature Walkthrough):**

1. **CLAUDE.md File** — A project-level file that defines rules for how Claude Code operates. Loaded into context at the start of every session.
2. **Custom Slash Commands** — Markdown files in `.claude/commands/` that specify a particular workflow for Claude Code to follow.
3. **Skills** — A more advanced version of slash commands. These are entire folders that can contain multiple documents, APIs, or scripts that Claude Code can use as tools.
4. **MCPs (Model Context Protocol servers)** — External service connectors configured in `settings.json`. Described as the "USB-C adapter" letting Claude Code interface with tools like Notion or Google Calendar.
5. **Custom Subagents** — Defined in `.claude/agents/`. These are separate context windows with their own instruction files, scoped to specific task types.
6. **Hooks** — Shell commands triggered at specific workflow events: prompt submission, file writes, or when Claude Code pauses for user input. Common use case: auto-formatting code on file write.

**End (CTA):** The creator mentions comprehensive video guides for each feature are available in their school community, with a link in bio.

## Visual Context & On-Screen Text

No frames were extracted for this reel. This analysis is based on the transcription and caption only. Given the tutorial nature of the content, the video likely featured on-screen text labels for each feature, possibly with visual diagrams or file structure screenshots — but this cannot be confirmed without frame data.

## Hook & Call to Action

- **The Hook:** A direct, no-fluff opener — "Here's all the important Claude Code features in order of complexity" — immediately signals a high-density, organized overview that appeals to developers who want a quick reference.
- **Call to Action:** The creator promotes their school community for comprehensive video guides on each feature, directing viewers to a "link in bio."
