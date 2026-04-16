# 3 Claude Code GitHub Repos You Haven't Heard About

**Topic/Category:** Tech / AI Developer Tools
**Primary Goal of the Post:** Introduce three lesser-known, free GitHub repositories that upgrade how developers use Claude Code — moving from chatbot-style usage to infrastructure-level workflows.

---

## Executive Summary

Most developers underutilize Claude Code by treating it like a simple chatbot. This post highlights three free GitHub repositories — CLI-Anything, Gstack, and Get Shit Done 2 — that transform Claude Code into a more powerful development operating system. Each repo addresses a different bottleneck: converting open-source tools into CLI interfaces, adopting CEO-level planning and review workflows, and porting the GSD framework to work with any AI model. The core message is that better infrastructure around Claude Code leads to dramatically better output.

## Key Insights & Main Ideas

- **Insight 1:** The bottleneck in AI-assisted development isn't the model — it's the infrastructure and workflow around it. Upgrading your stack matters more than upgrading your prompts.
- **Insight 2:** CLI-Anything lets you turn any open-source project into a CLI tool without building from scratch, positioning CLIs as the successor to MCPs for agent-native software.
- **Insight 3:** Gstack, built by Y Combinator CEO Garry Tan, provides a complete system of skills/modes (Founder/CEO review, engineering review, design audit, QA, shipping) that turns Claude Code into an operating system for product development.
- **Insight 4:** Get Shit Done 2 (GSD 2) evolved from a Claude Code prompt framework into a standalone CLI built on the Pi SDK, making it model-agnostic — it works on any AI model, not just Claude.
- **Insight 5:** The gap between knowing about a tool and actually installing/using it is where most people stall. Action beats awareness.

## Detailed Breakdown / Step-by-Step

- **Slide 1 — Hook:** "3 Repos You Haven't Heard About" — pairs the Claude Code and GitHub logos with the tagline "Let me drop the sauce (They're free .99)."
- **Slide 2 — CLI-Anything:** Take any open-source project and turn it into a CLI tool. "CLIs are in, MCPs are out." Shows the GitHub repo header ("CLI-Anything: Making ALL Software Agent-Native") and two installation steps: (1) Add the CLI-Anything marketplace, (2) Install the cli-anything plugin.
- **Slide 3 — Gstack:** Built by the CEO of Y Combinator. A table of skills/modes is shown including `/plan-ceo-review` (Founder/CEO mode), `/plan-eng-review` (Eng manager/tech lead), `/plan-design-review` (Senior product designer), `/design-consultation` (Design consultant), `/review` (Paranoid staff engineer), `/ship` (Release engineer), and `/browse` (QA engineer). Each skill has a defined role and function.
- **Slide 4 — Get Shit Done 2:** The GSD framework, originally built for Claude Code, now works as a standalone CLI on any model. Shows the npm package page with install command: `npm install -g gsd-pi`. Built on the Pi SDK for direct TypeScript control.
- **Slide 5 — Why These Matter:** Three reasons: (1) Turn any tool into a CLI without building from scratch, (2) Copy a Y Combinator CEO's exact Claude setup, (3) Use proven dev frameworks on any AI model.
- **Slide 6 — Get These Repos:** Lists all three repo URLs with a CTA to comment "AI AGENT" for direct links.
- **Slide 7 — Quick Tip:** "Don't just star these, install one today and try it. The gap between knowing about a tool and using it is where most people stall."
- **Slide 8 — CTA:** "FOLLOW YOUR BOY FOR MORE."

## Notable Visual Context

The carousel uses a consistent burnt-orange background with bold white typography and a pixelated hacker-themed mascot character (hoodie, sunglasses, green circuit-board aesthetic). Each repo slide includes a screenshot of the actual GitHub README or npm page, lending credibility. The Gstack slide features a detailed table showing 7+ skill commands with their modes and descriptions, giving viewers a concrete preview of the system's depth. The visual style is designed for quick scanning — large headers, minimal body text, high contrast.

## Verbatim Templates & Scripts

**CLI-Anything Installation Steps:**

```
# Add the CLI-Anything marketplace
/plugin marketplace add HKUDS/CLI-

# Install the cli-anything plugin
/plugin install cli-anything
```

**GSD 2 Installation:**

```
npm install -g gsd-pi
```

**Gstack Skills Table:**

| Skill | Mode | What it does |
|-------|------|-------------|
| `/plan-ceo-review` | Founder / CEO | Rethink the problem. Find the 10-star product hiding inside the request. |
| `/plan-eng-review` | Eng manager / tech lead | Lock in architecture, data flow, diagrams, edge cases, and tests. |
| `/plan-design-review` | Senior product designer | Designer's eye audit. 80-item checklist, letter grades, AI Slop detection, DESIGN.md inference. Report only — never touches code. |
| `/design-consultation` | Design consultant | Build a complete design system from scratch. Browses competitors to get in the ballpark, proposes safe choices AND creative risks, generates realistic product mockups, and writes DESIGN.md. |
| `/review` | Paranoid staff engineer | Find the bugs that pass CI but blow up in production. Triages Greptile review comments. |
| `/ship` | Release engineer | Sync main, run tests, resolve Greptile reviews, push, open PR. For a ready branch, not for deciding what to build. |
| `/browse` | QA engineer | Give the agent eyes. It logs in, clicks through your app, takes screenshots, catches breakage. Full QA pass in 60 seconds. |

**GitHub Repository Links:**

> - Get Shit Done 2: https://github.com/gsd-build/gsd-2
> - G Stack: https://github.com/garrytan/gstack
> - CLI Anything: https://github.com/HKUDS/CLI-Anything

## Call to Action / Conclusion

The post encourages viewers to comment "AI Agent" for direct links to all three repositories. The quick tip emphasizes taking action — install one repo today rather than just starring it. The creator signs off with "FOLLOW YOUR BOY FOR MORE," driving followers. Hashtags used: #ClaudeCode, #AIAgents, #GitHubRepos, #BuildInPublic, #AIWorkflow — positioning the content within the AI developer tools and builder community.
