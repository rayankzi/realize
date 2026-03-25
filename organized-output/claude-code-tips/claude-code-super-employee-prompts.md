# 4 Claude Code Prompts That Turn It Into a Super-Employee

**Topic/Category:** Tech / AI Productivity / Claude Code
**Primary Goal of the Post:** To share four specific prompts that transform Claude Code from a basic chatbot into an autonomous business tool — covering persistent memory, decision logging, inbox management, and automated task execution.

---

## Executive Summary

This carousel by @itstylergermain argues that most people drastically underuse Claude Code, treating it like a chatbot when it can function as a full-time autonomous assistant. The post provides four concrete, copy-paste prompts that set up Claude Code as a persistent memory system, a decision accountability tracker, an email inbox manager, and an autonomous to-do executor. The creator claims to use all four systems personally, positioning them as battle-tested rather than theoretical.

## Key Insights & Main Ideas

- **Claude Code is massively underutilized:** Most users treat it like a chatbot or web search tool, missing its potential as an autonomous agent that can run parts of a business.
- **Persistent memory is the foundation:** By creating a `/memory` directory with categorized markdown files and instructing Claude via `CLAUDE.md` to read them each session, Claude Code retains context across conversations.
- **Decision logging creates accountability:** Logging decisions with reasoning, expected outcomes, and a 30-day review date creates a built-in feedback loop for self-improvement.
- **Email triage can be automated with tone-matching:** Using the Google Workspace CLI, Claude Code can scan, categorize, label, and draft replies for emails — matched to your personal writing tone — without auto-sending.
- **Autonomous task execution is possible:** A to-do dashboard with a cron job lets Claude Code work through prioritized tasks on its own, logging activity as it goes.

## Detailed Breakdown / Step-by-Step

**Slide 1 — Cover:** "4 Claude Code Prompts That Turn It Into a Super-Employee" with a pixel-art Claude mascot and multi-monitor developer setup backdrop.

**Slide 2 — Prompt 1: Persistent Memory System**
Headline: "Your Claude Code will never forget again." Provides a prompt to create a `/memory` directory with `decisions.md`, `people.md`, `preferences.md`, and `user.md`, plus a `CLAUDE.md` file that instructs Claude to read these at session start and update them at session end.

**Slide 3 — Prompt 2: Decision Logging System**
Headline: "Hold yourself accountable." Provides a prompt to create a `decisions.csv` that logs date, decision, reasoning, expected outcome, and a 30-day review date. Includes a cron job that checks daily for review-due decisions and a `review.sh` script to surface flagged items.

**Slide 4 — Prompt 3: Inbox Manager**
Headline: "Clean up your inbox." Provides a prompt for an hourly cron job that scans Gmail, triages into URGENT / NEEDS REPLY / FYI / JUNK categories, auto-labels using existing labels, and drafts replies for urgent emails tone-matched to the user's last 20 sent emails. Explicitly states "Never auto-send." References the Google Workspace CLI and a Workspace CLI Skill from AI Innovators.

**Slide 5 — Prompt 4: Autonomous To-Do Dashboard**
Headline: "Hold yourself accountable." Provides a prompt to build a local web UI to-do dashboard where tasks have priority levels. An hourly cron job autonomously works through tasks starting with highest priority, logs what was done, and marks tasks complete. State stored in `tasks.json`, activity logged to `tasks.log`.

**Slide 6 — CTA:** "Want to Copy These Prompts For Yourself?" with a photo of the creator surrounded by AI tool logos (Claude, ChatGPT, Google Gemini, Sidekick). Directs users to comment "PROMPTS" for the link to a free group.

## Notable Visual Context

The carousel uses a consistent dark theme with coral/salmon-colored accent text for key terms (file names, system concepts, categories). Each prompt slide shows the prompt text in a code-block-style container with a rounded border, giving it a terminal/IDE aesthetic. The cover and closing slides use a real photo of a multi-monitor developer setup as the background, reinforcing the "power user" positioning. The pixel-art Claude mascot on the cover adds personality. The closing slide features a photo of the creator wearing a "LEARN AI" hoodie surrounded by floating AI tool logos.

## Verbatim Templates & Scripts

> **Prompt 1 — Persistent Memory:**
> Create a persistent memory system for yourself. Make a /memory directory with files organized by category: decisions.md, people.md, preferences.md, and user.md.
>
> Write a CLAUDE.md that instructs you to read these files at the start of every session and update them at the end.

> **Prompt 2 — Decision Logging:**
> Create a decision logging system. Every time I describe a decision I'm making, log it to decisions.csv with: date, decision, reasoning, expected outcome, and a 30-day review date.
>
> Set up a cron job that checks daily if any decisions have hit their review date and appends a "REVIEW DUE" flag. Build a review.sh script that surfaces only those flagged items.

> **Prompt 3 — Inbox Manager:**
> Build an hourly cron job that scans my Gmail inbox, triages new emails into URGENT / NEEDS REPLY / FYI / JUNK, auto-labels using my existing labels (infer meaning from history), and saves drafted replies for URGENT and NEEDS REPLY emails — tone-matched to my last 20 sent emails. Never auto-send.
>
> You already have access to the Google Workspace CLI, and my (Tyler Germain's) Workspace CLI Skill from AI Innovators.
>
> Store state in emails_processed.json. Log to inbox_manager.log.

> **Prompt 4 — Autonomous To-Do Dashboard:**
> Build a to-do dashboard with a local web UI. I can add, edit, and delete tasks with priority levels. Set up an hourly cron job — if the task list is not empty, work through tasks autonomously starting with highest priority, log what was done, and mark complete.
>
> Store tasks in tasks.json. Log all activity to tasks.log.

## Call to Action / Conclusion

The post closes with a direct engagement hook: comment "PROMPTS" to receive access to the full prompts via a free group. The creator positions these as practical, personally-tested systems rather than hypothetical ideas, emphasizing that "none of these are hypothetical, I use all of them." The "save for later" bookmark icon appears on every slide, encouraging saves for algorithmic reach.
