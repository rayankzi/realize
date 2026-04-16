# 3 Secret Claude Code Hacks to Supercharge Your AI Coding

**Topic/Category:** Tech / AI Developer Tools
**Primary Goal of the Post:** Share three lesser-known Claude Code tips that reduce hallucinations, improve reasoning depth, and speed up task completion through CLAUDE.md rules, the "ultrathink" keyword, and subagent usage.

---

## Executive Summary

This carousel presents three practical "secret hacks" for getting better results from Claude Code (Anthropic's AI coding CLI tool). The creator walks through specific prompting and configuration techniques — adding a web-search rule to the CLAUDE.md file, appending "ultrathink" to prompts, and instructing Claude to use subagents — each claiming significant performance improvements in accuracy and speed. The post is designed as a quick-reference guide for developers already using Claude Code who want to level up their workflow.

## Key Insights & Main Ideas

- **Insight 1:** Adding a rule to CLAUDE.md that forces Claude to search the web for the latest documentation before making changes can dramatically reduce hallucinations (claimed 95% reduction).
- **Insight 2:** Writing "ultrathink" at the end of your prompt activates extended thinking/reasoning mode, making Claude "10x more powerful" for complex tasks.
- **Insight 3:** Telling Claude to use subagents (parallel sub-processes) to look up documentation makes it solve tasks up to 5x faster by parallelizing research.

## Detailed Breakdown / Step-by-Step

- **Slide 1 (Cover):** Title card — "3 Claude Secret Hacks" — featuring the creator taking a mirror selfie with red-tinted sunglasses and a laptop, setting a casual tech-creator tone.

- **Slide 2 (Hack #1 — Kill 95% of Hallucinations):** Instructs users to create a `.md` file by typing `/init` in Claude Code, then add a rule:
  > `## Rules`
  > `ALWAYS before making any change. Search on the web for the newest documentation. And only implement if you are 100% sure it will work.`

- **Slide 3 (Hack #2 — 10x More Powerful Claude):** Advises writing "Ultrathink" at the end of your prompt. Shows a Claude Code terminal (v2.1.74, Opus 4.6, Claude Max) with the example prompt:
  > `You are an enterprise grade engineer. You are paid millions. You don't make mistakes. Use ultrathink`

- **Slide 4 (Hack #3 — Solve Tasks 5x Faster):** Tells users to instruct Claude to use subagents for documentation lookup. Shows a Claude Code terminal with the example prompt:
  > `Before making any changes. Always look up the latest documentation using 3 sub agents`

- **Slide 5 (CTA):** Closing slide with the Claude Code pixel mascot and the text: `Comment "SKILLS" for all my Claude Skills`.

## Notable Visual Context

All instructional slides (2-4) share a consistent dark grid-background aesthetic with bold serif headline text, orange/coral underline accents, and rounded-corner black code boxes for the instructions. Each slide follows a clear visual hierarchy: bold claim at top (e.g., "It will kill 95% hallucinations"), instruction in the code box, and a real Claude Code terminal screenshot below as proof. The terminal screenshots show Claude Code v2.1.74 running Opus 4.6 on Claude Max, lending authenticity to the tips.

## Verbatim Templates & Scripts

**CLAUDE.md Rule (Hack #1):**
```
## Rules
ALWAYS before making any change. Search on the web for the newest documentation. And only implement if you are 100% sure it will work.
```

**Ultrathink Prompt Example (Hack #2):**
> You are an enterprise grade engineer. You are paid millions. You don't make mistakes. Use ultrathink

**Subagent Prompt Example (Hack #3):**
> Before making any changes. Always look up the latest documentation using 3 sub agents

## Call to Action / Conclusion

The post closes with a clear engagement hook: Comment "SKILLS" to receive all of the creator's Claude skills. The caption reinforces this with: "Comment 'skills' for my claude skills." This is a lead-generation strategy to drive comments and share a curated set of Claude Code skill configurations with the audience.
