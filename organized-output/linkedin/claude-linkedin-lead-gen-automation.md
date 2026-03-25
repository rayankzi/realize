# How to Get Unlimited Leads Using Claude Code + LinkedIn

**Topic/Category:** Lead Generation / Sales Automation / AI Tools
**Primary Goal of the Post:** Walks through a complete system for automating LinkedIn lead generation and cold email reply classification using Claude Code, a browser agent, Google Sheets, Slack, and n8n — all with free or low-cost tools you own outright.

---

## Executive Summary

This carousel by Suprava Sabat presents a fully autonomous LinkedIn outreach and lead management system built on top of Claude Code. The system finds leads on LinkedIn, sends connection requests and InMails via a browser agent, classifies cold email replies (hot/warm/cold), and routes notifications through Slack — all orchestrated by n8n workflows. The key selling point is that you own the entire stack with no recurring SaaS fees ($80–$500/month savings), and the system is designed to avoid LinkedIn detection flags.

## Key Insights & Main Ideas

- **Full Automation Stack:** Claude Code acts as the brain — it builds the spreadsheet, writes message templates, and generates all browser automation scripts. A browser agent (using `@vercel/agent-browser`) executes LinkedIn actions via accessibility tree rather than CSS selectors, making it more stable and less detectable.
- **Zero Recurring Cost:** The entire system uses free tools — Google Sheets, Slack, Modal, and n8n — with the only potential cost being Instantly or Smartlead if you're running cold email campaigns.
- **Smart Reply Classification:** Cold email replies are automatically classified as hot, warm, or cold. Hot replies trigger an immediate LinkedIn connection request; cold replies get nurtured. All notifications appear in Slack with a full thread summary, suggested reply, and direct link to your Instantly inbox.
- **LinkedIn Safety:** The post highlights that traditional LinkedIn automation tools risk account suspension. This system claims zero flags for LinkedIn to detect because it uses a browser agent that mimics real human interaction patterns.
- **Live Proof:** The creator demonstrated the system live on camera, successfully sending connection requests to Gary Vee, Alex Hormozi, and Leila Hormozi.

## Detailed Breakdown / Step-by-Step

**Slide 1 — Title Card:** "How to Get Unlimited Leads using LinkedIn + Claude Code" with a visual of a laptop showing Claude Code and a spreadsheet.

**Slide 2 — What the System Does:** Overview of capabilities — finds leads on LinkedIn, sends connection requests & InMails, classifies cold email replies, and runs autonomously. Includes a system architecture diagram showing the flow: Lead List (Google Sheets) → Queue Builder → InMail Queue + Connection Queue → Outreach Orchestrator → Browser Agent → LinkedIn. A parallel flow handles: Cold Email Reply → Modal Agent → Classify + Summarize → Slack Notification → n8n Workflow → Add to Queue P1.

**Slide 3 — What You Need:** Lists the tech stack — Claude Code, Google Sheets (free), Slack (free), Modal (free), n8n (free), and optionally Instantly or Smartlead for cold email. Includes an automation stack diagram showing Claude Code at the center connected to all tools. "You own the system outright. Nothing recurring."

**Slide 4 — The Problem:** Existing LinkedIn automation tools cost $80–$500/month, require manual configuration, and one mistake gets your account suspended or banned. Shows an actual LinkedIn account restriction notice as proof.

**Slide 5 — Step 1: Google Credentials:** Set up Google Cloud Console → create new project → enable Google Sheets + Drive API → create OAuth Client ID (Desktop App) → download JSON → rename to credentials.json → drop into project folder. "Do this before anything else."

**Slide 6 — Step 2: Build the Spreadsheet:** Open Claude Code → paste the spreadsheet prompt. Claude builds 4 tabs: Sample Leads, Blacklist, InMail Queue, Connection Queue. Replace sample leads with your real list. Shows Claude Code terminal output with the script structure and CLI interface details.

**Slide 7 — Step 4: Add Message Templates:** Claude writes 3 connection message types: (1) Warm lead who replied to cold email (pulls email context from the row), (2) Generic: "Noticed your company in the space, would love to connect," (3) Fallback: "Connecting with industry professionals to share insights." Advice: "Tweak to match your offer before running."

**Slide 8 — Step 5: Install the Browser Agent:** Run `npm install @vercel/agent-browser` in terminal. Uses accessibility tree (not CSS selectors) — less tokens, less bugs, more stable than Playwright. Claude then builds all browser actions on top of it.

**Slide 9 — What Slack Looks Like:** Every reply notification shows: lead classification (cold/warm/hot), full thread summary, suggested reply ready to copy, direct link to Instantly inbox. Cold replies get nurtured; hot replies get a connection request sent immediately. Shows an n8n workflow diagram with Webhook → conditional logic → Google Sheets lookup → HTTP Request.

**Slide 10 — Step 8: Build the n8n Workflow:** When a warm or hot reply comes in: find lead in Sample Leads sheet by email → validate LinkedIn URL (contains /in/) → if already in Connection Queue, update priority to 1 → if not in queue, use LinkUp to find LinkedIn URL and append as Priority 1 → if already sent, ignore. Next time the script runs, these priority leads go first.

**Slide 11 — The Live Demo:** Tested with Gary Vee, Alex Hormozi, and Leila Hormozi. Agent visits profile → finds Connect button or clicks three-dot menu → sends connection request. All 3 went through live on camera. Shows a screenshot of the LinkedIn invitation dialog on Alex Hormozi's profile.

**Slide 12 — Quick Summary:** Claude Code builds it → Browser agent runs it → Slack tells you who replied → n8n handles the rest. Includes a visual pipeline diagram of these four stages.

## Notable Visual Context

- **System Architecture Diagram (Slide 2):** Shows two parallel flows — the main outreach pipeline (Lead List → Queue Builder → Outreach Orchestrator → Browser Agent → LinkedIn) and the reply classification pipeline (Cold Email Reply → Modal Agent → Classify → Slack → n8n → Queue).
- **Automation Stack Diagram (Slide 3):** Hub-and-spoke layout with Claude Code at center, connected to Google Sheets ("Memory"), Slack ("Feedback Loop"), n8n ("Nervous System"), Modal ("Muscles"), and Instantly/Smartlead ("Voice").
- **LinkedIn Restriction Screenshot (Slide 4):** Real LinkedIn account restriction notice showing "Access to your account has been restricted" — used to illustrate the risk of traditional automation tools.
- **Claude Code Terminal Output (Slide 6):** Shows the actual script structure with filtering logic, CLI interface flags (--mode, --source, --limit, --dry-run, --status), and Google Sheets auth details.
- **n8n Workflow Diagrams (Slides 9 & 10):** Visual node-based workflow editors showing webhook triggers, conditional logic, Google Sheets integration, and HTTP request nodes.
- **Live Demo Screenshot (Slide 11):** Actual LinkedIn profile of Alex Hormozi with the "Add a note to your invitation" dialog open, proving the system works in real-time.

## Verbatim Templates & Scripts

> **Connection Message — Warm Lead (who replied to cold email):**
> Pulls email context from the row (personalized based on prior interaction)

> **Connection Message — Generic:**
> "Noticed your company in the space, would love to connect"

> **Connection Message — Fallback (85 chars):**
> "Hi Seth, connecting with [industry] professionals to share insights. Would be great to connect."

> **InMail Message — Owner Level (CEO):**
> Subject: Quick question about VaynerMedia
> Body:
> Hi Gary,
>
> I work with companies like VaynerMedia in the [industry] space to help them [key value prop — e.g., close more deals, reduce overhead, increase ROI].
>
> Most CEOs I talk to are focused on efficiency and growth — curious if that's on your radar too.
>
> Would a 15-minute call this week make sense? Happy to share what's working for similar companies.
>
> Best,
> [Your Name]

> **InMail Message — GM/Director Level (VP Marketing):**
> Subject: Idea for SparkToro's team

## Call to Action / Conclusion

The post ends with a clear CTA: "Save this. And comment 'workflow' if you need a detailed workflow on this. Follow for more content on lead gen." The caption reinforces this with "Comment 'workflow' and I'll share a detailed guide on this!" Hashtags used: #claude #n8n #leads #coldemail #linkedinleads — indicating the post targets the intersection of AI automation, lead generation, and cold outreach audiences.
