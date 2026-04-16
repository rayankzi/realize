# Audit Your Instagram with Claude: Two Methods Explained

**Topic/Category:** AI Tools / Social Media Strategy / Instagram Growth
**Primary Goal of the Post:** Teach creators and marketers how to use Claude AI to audit their Instagram account performance using two different methods — a live API connector (Windsor.ai) or a browser-based approach (Claude in Chrome) — complete with exact setup steps and ready-to-use prompts.

---

## Executive Summary

This carousel is a comprehensive how-to guide for using Claude AI to analyze Instagram performance data without needing to manually interpret analytics. The post covers two distinct methods: Option A uses Windsor.ai as a connector to give Claude live, structured access to backend Instagram metrics (engagement rates, watch times, story exits, audience demographics), while Option B uses the Claude Chrome extension to visually browse your profile and Insights dashboard in real time. Both methods require a paid Claude plan, and the guide includes exact prompts to run each type of audit, a comparison of what data each method can access, and a decision framework for choosing between them.

---

## Key Insights & Main Ideas

- **Two valid audit methods:** Option A (Windsor.ai connector) provides deep, structured API data; Option B (Claude in Chrome) provides a quick, zero-setup visual audit with no third-party accounts.
- **Paid Claude plan required for both:** Pro ($20/mo), Max ($100/mo), or Team ($25/user/mo). Free tier can only use a manual CSV export fallback.
- **Professional account is a prerequisite:** Personal Instagram accounts have no API access or Insights dashboard — you must switch to a Business or Creator account first (free, instant, reversible).
- **Windsor.ai is Claude's verified connector:** It bridges Instagram's Graph API to Claude. Has a Forever Free plan (1 source, 30-day history) and a 30-day trial.
- **Chrome method is limited to visible data:** Can read what's on screen (captions, likes, comments, Insights dashboard) but cannot access backend metrics like story exits or watch time.
- **Free plan fallback exists:** Export a CSV from Meta Business Suite → upload to Claude → ask Claude to analyze it. No paid plan required for this method.
- **Model choice matters for Chrome audits:** Pro plan is limited to Haiku 4.5; Max/Team/Enterprise can use Sonnet 4.6 (complex audits) or Opus 4.6 (maximum depth).

---

## Detailed Breakdown / Step-by-Step

**Slide 1 — Cover:** Introduces the concept: "Audit Your Instagram with Claude." Claude can analyze performance and tell you exactly what's working.

**Slide 2 — Prerequisites & Overview:**
- Two audit options introduced (A = Connector, B = Chrome)
- Both require paid Claude plan
- Before starting either method: switch Instagram to a Professional (Business or Creator) account
  - Open Instagram → profile picture → hamburger menu (≡) → Settings and privacy → Account type and tools → Switch to Professional account → Choose Business or Creator → pick a category

**Slide 3 — Option A, Setup: Windsor.ai Connector**
- Requires: Instagram Business/Creator account, paid Claude plan, Windsor.ai account
- Windsor.ai is in Claude's official Connectors Directory
- Step 1: Connect Instagram to Windsor.ai
  1. Go to `onboard.windsor.ai`, create account (30-day trial, no credit card)
  2. Click "Add data source" → search "Instagram Insights" (own account) or "Instagram Public" (any public profile)
  3. Click "Authenticate via Facebook" — log in with the Facebook account linked to your Instagram
  4. Select the Instagram profile(s) to analyze → Windsor auto-syncs the data

**Slide 4 — Option A, Steps 2 & 3: Add Windsor to Claude + Audit Prompts**
- Step 2: Add Windsor connector to Claude
  1. Open claude.ai in browser or desktop app (not mobile)
  2. Click "+" button in lower left of any chat → Connectors → search "Windsor.ai" → click Connect
  3. Sign in with Windsor account to authorize
  4. Set permissions to "Always allow" (skips re-authorization in new chats)
- Step 3: Run the audit with plain-English prompts (data streams live, no exports needed)

**Slide 5 — Option B, Setup: Claude in Chrome**
- Requires: Google Chrome or Edge, paid Claude plan, Instagram logged in
- Chrome/Edge only (not Brave, Arc, Firefox, Safari)
- Step 1: Install Claude Chrome Extension
  1. Chrome Web Store → search "Claude" → find Anthropic's extension → Add to Chrome
  2. Accept permissions (click, navigate, take screenshots)
  3. Pin extension to toolbar
  4. Sign in with Claude account
  5. In claude.ai → Settings → Connectors → "Claude in Chrome" → toggle on

**Slide 6 & 7 — Option B, Steps 2 & 3: Enable in Chat + Chrome Audit Prompts**
- Step 2: Enable Claude in Chrome for a specific chat
  1. Start a new Claude chat → click "+" → hover Connectors → toggle "Claude in Chrome" on
  2. Select model: Sonnet 4.6 (complex multi-step audits) or Opus 4.6 (maximum depth)
  3. Log in to Instagram in Chrome (gives access to Insights dashboard)
- Step 3: Run the audit — Claude navigates your browser, reads the screen, and reports back

**Slide 8 — Data Comparison: What Each Method Can Access**
- Windsor.ai (Option A): Posts, Reels, Stories, Audience, Profile, Competitors (all backend metrics)
- Claude in Chrome (Option B): Profile page, Post grid, Insights dashboard, Competitor profiles (all screen-visible only)

**Slide 9 — Decision Summary: Which Option Should You Use?**
- Option A if: you want structured data, recurring marketing analysis, follower growth trends
- Option B if: you want a quick visual audit with zero extra setup
- Using both: Chrome for quick read, connector for deep numbers
- Free plan fallback: export CSV from Meta Business Suite → upload to Claude chat

**Slide 10 — Closing CTA:** Comment "AUDIT" to receive the full setup guide link.

---

## Notable Visual Context

- The carousel uses Claude's official brand design (cream/beige background, terracotta/black typography, Claude asterisk logo) — lending credibility and making it look like official documentation.
- Options A and B are consistently color-coded throughout (blue for Option A / Connector, green for Option B / Chrome), making it easy to follow a single path through the carousel without confusion.
- Slide 8 uses a two-panel grid layout to visually compare what each method can and cannot access, with a clear callout: "Limited to what's visible on screen" for Option B.
- Exact prompts in Slides 4 and 6/7 are displayed in monospace/code-style text boxes, clearly distinguishing them as copy-paste ready content.
- Slide 9's decision framework is presented as a scannable bullet list, not a table — optimized for mobile reading.

---

## Verbatim Templates & Scripts

**Option A — Windsor.ai Connector Audit Prompts:**

> "Audit my Instagram for the last 30 days. What's my engagement rate, top posts, and follower trend?"

> "Which content type gets the most saves — Reels, carousels, or photos?"

> "What time of day are my followers most active? When should I post?"

> "Give me 3 recommendations to improve reach based on my last 60 days."

> "Compare my Reel average watch time vs. my posting frequency this month."

**Option B — Claude in Chrome Audit Prompts:**

> "Go to instagram.com/[yourhandle]. Read my last 12 posts and summarize my content mix, engagement, and caption style."

> "Navigate to business.facebook.com, open my Instagram Insights, and give me a plain-English summary of what you see."

> "Open my profile and my top competitor's profile in two tabs. Compare posting frequency and visible engagement."

> "Browse my last 20 posts. Which ones have the most likes and comments? Build a quick table."

---

## Call to Action / Conclusion

The post closes with a comment trigger ("Comment 'AUDIT'") to receive the full setup guide link — a classic lead generation mechanic. Secondary CTA: follow `@mrsocialgrowthstudio_` for more AI + social media tips. The hashtags used (`#ai`, `#claudecowork`, `#claude`, `#claudecode`) signal the post is targeting AI-curious creators and marketers, not technical developers. The overall tone is practical and tutorial-driven, with zero fluff — every slide delivers actionable setup instructions.
