# Make Claude Ask YOU First: The AskUserQuestion Prompting Technique

**Topic/Category:** AI / Prompting / Claude Code
**Primary Goal of the Post:** Teaches a 4-step technique for getting better results from Claude by making it ask clarifying questions before starting work, rather than trying to write the perfect prompt upfront.

---

## Executive Summary

This carousel introduces a prompting workflow for Claude (specifically Claude Code) where instead of crafting a perfect prompt, you instruct Claude to ask you clarifying questions via the `AskUserQuestion` tool before it begins working. The technique flips the traditional prompting paradigm: rather than you perfecting your instructions, Claude interviews you with structured forms to extract exactly what it needs. This leads to better-aligned outputs, fewer hallucinations, and an iterative refinement process driven by questions rather than editing bad outputs.

## Key Insights & Main Ideas

- **Stop writing perfect prompts:** Instead of spending time engineering the ideal prompt, give Claude a rough task and tell it to ask you questions first.
- **Claude's AskUserQuestion tool creates interactive forms:** Claude can generate multiple-choice and open-ended question forms to gather your requirements before starting work.
- **Iteration through questions, not editing:** The feedback loop happens before output generation, saving time on revisions.
- **1M+ token context reduces hallucinations:** With Claude's large context window, feeding in your answers and uploaded files leads to more accurate, grounded outputs.
- **Mid-conversation recovery:** If Claude gets sidetracked, you can use the same technique to reset and realign without losing context.

## Detailed Breakdown / Step-by-Step

**Slide 1 — Cover:** "Make Claude Ask YOU First" — sets up the core concept with a visual of an ear with the Claude logo, implying Claude should listen before acting.

**Slide 2 — Step 1: Start with any task.** Provides a copy-paste prompt template that tells Claude to read uploaded files, ask clarifying questions using AskUserQuestion, and only begin once aligned. Includes an example of requesting a LinkedIn lead magnet.

**Slide 3 — Step 2: Claude creates a form.** Shows Claude generating structured question forms with multiple-choice options (e.g., "What's your core offer?", "Do you have existing LinkedIn content or brand docs?"). The forms allow selecting options or typing custom answers.

**Slide 4 — Step 3: Answer the questions.** Demonstrates the Q&A exchange where you answer Claude's clarifying questions about core offer, target audience, format preference, brand documents, pain points, CTAs, and differentiated POV. Claude then confirms it has everything and outlines a plan.

**Slide 5 — Step 4: Claude starts working.** Shows Claude producing a detailed PDF guide structure with sections, cover page copy, myths vs. truths frameworks, and a channel comparison table — all informed by the earlier Q&A.

**Slide 6 — Mid-conversation recovery.** Provides a second copy-paste prompt for when Claude gets sidetracked, instructing it to generate an AskUserQuestion form to diagnose what went wrong and then a second form to get back on track.

**Slide 7 — Why this works.** Lists four reasons: you stop writing perfect prompts, Claude forces you to be clear, you iterate through questions instead of editing bad outputs, and 1M+ token context reduces hallucinations.

**Slide 8 — CTA:** "Found this helpful? Repost this to help someone in your network." Branded with "How to Prompt."

## Notable Visual Context

The carousel uses a clean, warm design with a terracotta/burnt orange accent color and grid-paper background. Each step slide includes actual screenshots of the Claude Code terminal interface showing the AskUserQuestion forms and chat exchanges, providing concrete visual proof of how the technique works in practice. The cover slide features a close-up of an ear with the Claude logo (orange sunburst) placed inside it, reinforcing the "listening first" metaphor.

## Verbatim Templates & Scripts

**Starting Prompt Template (Step 1):**

> I want to [TASK] so that [SUCCESS]
>
> First, read uploaded files.
> DO NOT start yet. Ask me clarifying questions (use AskUserQuestion) to refine the approach.
>
> Only begin once we've aligned.

**Mid-Conversation Recovery Prompt (Slide 6):**

> We are getting sidetracked. We need to start over without losing context.
>
> First, generate an AskUserQuestion form for me to answer so we decide what went wrong and where we must go instead.
>
> From my answer, generate a second AskUserQuestion form to complete the task.

## Call to Action / Conclusion

The post closes with a simple engagement prompt: "Found this helpful? Repost this to help someone in your network." The account @beyond__intelligence is credited in the caption, and the content is branded under "How to Prompt," suggesting this is part of a series on AI prompting techniques.
