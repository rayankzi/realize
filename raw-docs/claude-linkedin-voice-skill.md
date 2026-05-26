# Building a Custom Claude Skill for LinkedIn Personal Branding

**Topic/Category:** AI-Powered Workflows / Personal Branding
**Primary Goal of the Post:** To teach users how to build a custom Claude skill that automates their unique writing voice for LinkedIn, eliminating repetitive editing of "AI tells."

---

## Executive Summary

This post addresses a common frustration for content creators using AI: the loss of personal voice and the emergence of generic "AI tells" (e.g., "Hot take," "Let that sink in"). The creator shares her solution—building a dedicated `SKILL.md` for Claude. By answering six foundational branding questions and using Claude to draft a skill file, she successfully automated her voice, ensuring every post sounds like her without the manual cleanup.

## Key Insights & Main Ideas

- **AI Homogenization:** Generic AI prompts often produce repetitive hooks and cadences that dilute a personal brand.
- **The "SKILL.md" Solution:** Moving beyond simple prompting to a structured "skill" file allows for persistent, default constraints on Claude's output.
- **Foundational Questions:** Successful voice automation requires answering specific questions about brand values, voice baseline, writing process, format, length, and recurring elements.
- **Multi-Surface Utility:** These skills can be deployed both in the Claude.ai web interface (via ZIP upload) and in Claude Code (as a local file).
- **Compounding Brand Value:** Using a consistent skill ensures that every post strengthens the brand identity rather than just filling a slot in the content calendar.

## Detailed Breakdown / Step-by-Step

### 1. The Strategy (Questions to Ask Yourself)
Before touching AI, define the following six elements to shape your `SKILL.md`:
1. **Brand Identity:** What does your brand stand for? (Shapes the description)
2. **Voice Baseline:** What voice should every post carry? (Sets the tone)
3. **Writing Style:** How do you typically write a post? (Sets the style rules)
4. **Formatting:** What format do your posts follow? (Defines hook patterns)
5. **Length Guidance:** How long should each post be?
6. **Recurring Elements:** Are there specific hashtags or sign-offs you always use?

### 2. The Implementation (Drafting with Claude)
- Provide your answers to the six questions to Claude.
- **Prompt:** "Write me a SKILL.md for a linkedin-post skill. Here are my answers to the six questions: [Your Answers]..."
- Claude will generate a Markdown file containing metadata, voice baselines, and a "No-fly zone" for generic phrases.

### 3. The Deployment
- **Claude.ai:** Go to Customize → Skills → Upload skill. Upload a ZIP of the folder containing your `SKILL.md`.
- **Claude Code:** Save the file to `~/.claude/skills/linkedin-post/SKILL.md`.

### 4. The Invocation
- Use natural language: *"Use the linkedin-post skill to write about [topic]."*
- Use slash commands (Claude Code): ` /linkedin-post write about [topic]`

## Notable Visual Context

The carousel uses a clean, professional aesthetic with high-contrast green and blue gradients. 
- **Slide 3** effectively uses a grid layout to present the six foundational questions.
- **Slide 4 & 6** show side-by-side "Prompt vs. Response" examples, visually proving how a short, 1-line prompt can generate a highly structured, multi-paragraph response when a skill is active.
- **Slide 5** provides a split-screen UI guide for both the web interface and the terminal, making the technical setup feel accessible.

## Verbatim Templates & Scripts

### The "SKILL.md" Prompt Template
> Write me a SKILL.md for a linkedin-post skill. Here are my answers to the six questions: my brand is —, my voice is —, my format is —, my length is —...

### Sample SKILL.md Structure
```markdown
---
name: linkedin-post
description: Write LinkedIn posts in my brand voice. Strip AI tells.
---

# Voice baseline
- approachable, honest, thought leader...

# No-fly zone
- "let that sink in," "hot take"...
```

## Call to Action / Conclusion

The creator emphasizes that while AI handles the labor, "The idea stays mine. The voice stays mine." She encourages users to comment "skill" to receive her exact template, driving engagement and building a lead list for her branding methodology.
