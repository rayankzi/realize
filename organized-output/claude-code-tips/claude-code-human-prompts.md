# Claude Code Prompts That Make It Feel Human

**Topic/Category:** Tech / AI Productivity / Developer Tools
**Primary Goal of the Post:** To share four specific prompts that transform Claude Code from a generic AI coding assistant into a personalized, context-aware "second brain" that remembers you, briefs you, and operates like a human co-worker.

---

## Executive Summary

This carousel presents four advanced Claude Code prompts designed to unlock its full potential as a persistent, personalized AI assistant. Rather than treating Claude Code as a one-off coding tool, the post argues that with the right prompts, it can maintain memory across sessions, develop a consistent personality tuned to your working style, deliver automated morning briefings, and power a real-time to-do dashboard. The overall message is that Claude Code's value multiplies dramatically when you invest in setting up these foundational systems.

## Key Insights & Main Ideas

- **Claude Code is more than a code generator:** It can function as a persistent second brain if configured with the right prompts and file structures.
- **Memory persistence is achievable:** By creating a `/memory` directory with structured markdown files and a `CLAUDE.md` instruction file, Claude can retain context across sessions.
- **Personality consistency matters:** Defining a `personality.md` based on observed interaction patterns gives Claude a stable "soul" for how it thinks, communicates, and makes decisions.
- **Automation is built-in:** Claude Code's scheduled tasks feature can power daily briefings sent to Slack via webhooks.
- **Real-time dashboards are possible:** Combining Next.js, Supabase, and Supabase Realtime lets Claude manage a live to-do dashboard that updates instantly as agents complete tasks.

## Detailed Breakdown / Step-by-Step

**Slide 1: Cover — "Claude Code Prompts That Make It Feel Human"**
Introduces the theme with a pixel-art character evolution graphic (small generic bot to a larger, more human-looking character), reinforcing the idea of transforming Claude from basic to personalized. Posted by @itstylergermain.

**Slide 2: Build a Persistent Memory System**
Prompt instructs Claude to create a `/memory` directory with four files: `decisions.md`, `people.md`, `preferences.md`, and `user.md`. A `CLAUDE.md` file is then written to instruct Claude to read all memory files at session start. A hook is created to update these files at session end.

**Slide 3: Define a Soul & Personality**
Prompt tells Claude to read everything in the `/memory` directory and then write a `personality.md` that defines how it should think, communicate, and make decisions. The personality is based entirely on patterns observed in existing files, becoming its "soul" for every future session. Users can insert additional relevant details.

**Slide 4: Set Up a Morning Briefing System**
Prompt configures an automated morning briefing using Claude Code's scheduled tasks. Every day at 8am, Claude reads `/memory` files, checks `active.md` in `/todos`, summarizes recent work, and generates 3 priorities for the day. The briefing is sent to Slack as a DM via a webhook (stored in `.env` as `SLACK_WEBHOOK_URL`).

**Slide 5: Develop a To-Do Dashboard**
Prompt asks Claude to build a real-time to-do dashboard using Next.js and Supabase. It sets up a `todos` table with fields for `title`, `status`, `priority`, `assigned_agent`, and `updated_at`. Supabase Realtime is enabled so the UI updates live via websockets. The dashboard is styled dark, minimal, and clean.

**Slide 6: CTA — "Want These Exact Prompts?"**
Directs users to comment "CLAUDE" to receive the prompts via DM.

## Notable Visual Context

The carousel uses a consistent dark theme with coral/salmon accent colors for highlighted keywords. A recurring pixel-art mascot character appears on every slide, giving the content a distinctive brand identity. The prompt text on slides 2-5 is displayed in monospace font inside dark code-block-style containers with a vertical accent bar, mimicking a terminal or IDE aesthetic. Key terms like "persistent memory," "personality.md," "Supabase Realtime," and "websockets" are highlighted in the accent color to draw attention to technical specifics.

## Verbatim Templates & Scripts

**Prompt 1 — Persistent Memory System:**
> Create a persistent memory system for me. Make a /memory directory with these files: decisions.md, people.md, preferences.md, and user.md.
>
> Then write a CLAUDE.md that tells you to read all of these files at the start of every session, then create a hook that updates them at the end.

**Prompt 2 — Soul & Personality Layer:**
> Read everything in my /memory directory, then write a personality.md that defines how you should think, communicate, and make decisions when working with me.
>
> Base it entirely on patterns you observe in my files. This becomes your soul for every future session.
>
> Other information:
> [Insert any other relevant details here]

**Prompt 3 — Automated Morning Briefing:**
> Set up an automated morning briefing using Claude Code's scheduled tasks.
>
> Every day at 8am, you should: read my /memory files, check active.md in /todos, summarize what I was last working on, and generate 3 priorities for today.
>
> Then send the briefing to my Slack as a DM using a webhook. Store the webhook URL in my .env file as SLACK_WEBHOOK_URL.

**Prompt 4 — Real-Time To-Do Dashboard:**
> Build me a real-time to-do dashboard using Next.js and Supabase. Set up a todos table in Supabase with fields for title, status, priority, assigned_agent, and updated_at.
>
> Enable Supabase Realtime on the table so the UI updates live via websockets — no refresh needed. When an agent completes a task, it should update the status directly in Supabase and the dashboard reflects it instantly. Style it dark, minimal, and clean.

## Call to Action / Conclusion

The post closes with a direct engagement hook: users are invited to comment "CLAUDE" on the post to receive the exact prompts via DM. The "save for later" bookmark icon appears on every slide, encouraging saves. The overall message positions Claude Code as an underutilized tool that most people use at a fraction of its capability, and these four prompts as the key to unlocking its full potential as a personalized AI co-worker.
