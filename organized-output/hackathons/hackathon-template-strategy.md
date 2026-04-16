# The "Slightly Unethical" Hackathon Template Strategy That Always Wins

**Topic/Category:** Software Engineering / Hackathon Strategy
**Primary Goal of the Reel:** Share a tactical hackathon preparation strategy — building a pre-configured tech stack template — that eliminates setup time and lets teams focus on solving the actual problem.

---

## Executive Summary

The creator reveals their go-to strategy for consistently winning or placing at hackathons (including events at Harvard and SDSU): arrive with a pre-built template repository that already handles the boilerplate infrastructure every hackathon project needs. While framed as "slightly unethical," the tip is really about smart preparation — having authentication, database connections, front-end/back-end communication, and deployment pre-wired so you can skip hours of setup and jump straight into building novel features.

## Core Insights & Takeaways

- **Insight 1:** Nearly every hackathon project shares four core components — a front end, a back end, a database, and authentication. The technology differs, but the interaction pattern is the same.
- **Insight 2:** Most teams waste their first few hours (sometimes fatally) on infrastructure setup and debugging connection issues, OAuth flows, and database configs — not on the actual hackathon problem.
- **Insight 3:** The winning move is to prepare a skeleton/template repo before the hackathon that already handles inter-component communication, auth flows, and basic database setup, controlled by a single `.env` file for easy endpoint/key swapping.
- **Insight 4:** This approach maximizes the time available for brainstorming, building, and presenting novel features — the things judges actually care about.

## Narrative & Step-by-Step Breakdown

**Beginning (Hook):** The creator opens with a provocative hook — calling the tip "slightly unethical" and backing it with credibility (winning/placing at every hackathon attended, including Harvard and SDSU).

**Middle (Core Strategy):**
1. **Identify the universal pattern** — Front end, back end, database, and auth are present in 9/10 hackathon projects.
2. **Observe the common failure mode** — Teams burn hours connecting these components, hit bugs with OAuth or database connections, and sometimes quit before reaching the actual problem.
3. **Choose your preferred stack** — The creator's personal stack:
   - **Front end:** Next.js + Vercel
   - **Back end:** FastAPI + Fly.io
   - **Auth & Database:** Supabase
4. **Build a template repo** — Pre-configure all four components to communicate with each other. Include a working auth flow and basic user database.
5. **Use a single `.env` file** — Make it easy to swap out Supabase project keys, back-end URLs, and other environment variables for each new hackathon.
6. **At the hackathon** — Skip setup entirely. Extend the template to solve the specific problem, giving you maximum time for novel features.

**End (Call to Action):** Encourages viewers to build their own template in whatever stack they prefer, go to hackathons, and "collect that check."

## Visual Context & On-Screen Text

*No frames were extracted for this reel. This analysis is based on the transcription and caption only.*

## Hook & Call to Action

- **The Hook:** "This slightly unethical tip is the reason I have won or placed at every single hackathon I've ever attended. Winning thousands at universities like Harvard and SDSU." — Combines curiosity ("unethical"), credibility (consistent wins), and specificity (named universities and prize money).
- **Call to Action:** "Drop a follow, and I'll see you tomorrow" — standard engagement ask plus a daily content commitment signal.
