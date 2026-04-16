# 5 Claude Prompts to Audit Your Designs Like a Senior Designer

**Topic/Category:** Design, AI Prompts, UI/UX
**Primary Goal of the Post:** Share 5 production-ready Claude AI prompts that give designers brutally honest, actionable feedback on visual hierarchy, typography, spacing, color, and overall perceived quality — replacing vague critique with specific fixes.

---

## Executive Summary

This carousel by Paras Madan (@parasmadan.in) delivers five Claude AI prompts engineered to close the gap between amateur and premium design work. Each prompt targets a distinct design failure mode — hierarchy, typography, whitespace, color strategy, and low perceived value — and forces Claude to act as a domain specialist (surgeon, type director, auditor, design doctor) rather than a generic feedback tool. The prompts are structured with layered diagnostic questions and strict rules requiring specific, named fixes over vague suggestions.

## Key Insights & Main Ideas

- **Specificity over vagueness:** Every prompt explicitly bans generic feedback ("no vague feedback like 'improve the hierarchy'") and demands named elements, exact values, and ranked fixes.
- **Role-based framing:** Each prompt assigns Claude a specialized identity (visual hierarchy surgeon, senior type director, design doctor) to elevate the quality and directness of output.
- **Layered diagnostic structure:** Prompts are organized into labeled sub-categories (e.g., Macro Spacing / Micro Spacing / Breathing Room) to ensure systematic coverage rather than surface-level review.
- **ROI-ranked outputs:** Multiple prompts ask for fixes ordered by impact, so designers know what single change will move the needle most.
- **Prompt 05 is the capstone:** "Why Does This Look Cheap?" is meant to be run last — after the other four have surfaced individual issues, this prompt synthesizes a final ranked action list for maximum ROI.
- **Six prompts total exist:** The CTA slide references 6 repo links, suggesting a sixth prompt not shown in the carousel is available via DM.

## Detailed Breakdown / Step-by-Step

**Slide 1 — Cover:** Establishes the theme: "Claude Prompts for Premium Designs." High-contrast typographic design in black, orange, and off-white signals the design-forward nature of the content.

**Slide 2 — Prompt 01: The Visual Hierarchy Surgeon**
Maps where the eye actually lands vs. where it should land based on the business goal. Diagnoses competing elements and prescribes specific fixes (font size change, contrast adjustment, spacing tweak, or removal), ranked by impact.

**Slide 3 — Prompt 02: The Typography Interrogation**
Runs a structured audit across four checkpoints — Pairing, Scale, Spacing, and Weight/Hierarchy Signal — and requires specific value changes (pixel sizes, line-height values, letter-spacing adjustments) for every problem found.

**Slide 4 — Prompt 03: The Whitespace Pressure Test**
Examines spacing at the macro level (sections, containers) and micro level (components, text, icons), then evaluates breathing room and perceived value. Outputs specific pixel recommendations and spacing token names.

**Slide 5 — Prompt 04: Color And Contrast Stress Test**
Audits the palette across four layers — logic, emotional signal, accessibility (WCAG AA), and sophistication — to determine whether color choices are intentional and strategic or decorative and accidental.

**Slide 6 — Prompt 05: Why Does This Look Cheap?**
Asks for the 3 specific reasons a design looks low-budget, identifies the single highest-leverage fix, prescribes the 3 changes that would make the design look 10x more premium, and names one thing to keep unchanged. Intended as the final prompt after the others.

**Slide 7 — CTA:** Comment "Design" to receive all 6 repo links via DM from @Parasmadan.In.

## Notable Visual Context

- All prompt slides use a **dark terminal/code block aesthetic** (black background, green/orange monospace text) to present the prompts, reinforcing their nature as copy-paste tools rather than conceptual advice.
- Each slide has a **tagline at the bottom** that summarizes the value prop in a single punchy sentence (e.g., "Premium design breathes. Amateur design suffocates." / "Be direct. I want a design doctor, not a design cheerleader.").
- The cover uses bold geometric design with a large circle, star motif, and strong typographic contrast — itself a demonstration of the visual principles the prompts teach.
- Slide numbering (e.g., "02 / 08") visible in the corner of some slides suggests the full carousel may be 8 slides, with additional content not captured here.

## Verbatim Templates & Scripts

**Prompt 01 — The Visual Hierarchy Surgeon**

```
I'm going to share a design with you.

Your job is to act as a visual hierarchy surgeon, not a compliment machine.

Do this in order:
1. Tell me where the eye lands first, second, and third based purely on size, contrast, color weight, and position.
2. Tell me where the eye SHOULD land first, second, and third based on the business or communication goal.
3. Identify every element that's competing for attention it hasn't earned.
4. For each problem, give me one specific fix: exact font size change, contrast adjustment, spacing tweak, or removal.

Rules:
No vague feedback like "improve the hierarchy."
Name the element, name the fix.
If something needs to be removed entirely, say so.
Rank your fixes by impact. What one change would do the most work?

[Attach your design]
```

**Prompt 02 — The Typography Interrogation**

```
Audit the typography in this design like a senior type director. Go through each checkpoint and give me a verdict and fix for each:

PAIRING
Do the fonts create tension or harmony? Is that the right call for this context?
Are the fonts doing distinct jobs (display vs body vs UI) or are they stepping on each other?

SCALE
Is there enough size contrast between heading levels?
(A common mistake: h1 and h2 are too close in size.)
Does the smallest text stay readable at actual viewing distance?

SPACING
Is line-height set for readability or left at default?
Is letter-spacing on headlines tightened?
Are paragraph widths staying within the 60-75 character ideal?

WEIGHT AND HIERARCHY SIGNAL
Is font weight doing contrast work, or just decorative?
Can someone tell primary, secondary, and tertiary text apart at a glance?

For each problem, give the specific value change.
```

**Prompt 03 — The Whitespace Pressure Test**

```
I want you to pressure test the whitespace and spacing in this design. Work through these questions:

MACRO SPACING (sections, containers)
Are the section gaps large enough to signal a new zone, or do sections bleed together?
Is there a consistent spatial rhythm (e.g., an 8pt grid) or does spacing feel ad hoc?

MICRO SPACING (components, text, icons)
Inside cards and components, is padding equal on all sides or does it look squeezed?
Do icons have enough clearance from adjacent text?
Are button labels getting enough horizontal padding?

BREATHING ROOM
Which elements need more isolation to feel important?
Where is whitespace being filled out of fear instead of intention?

PERCEIVED VALUE
Would increasing padding in any area make the design feel more premium? Where?
Are there dense areas that could be split across two sections instead of one?

Give me specific pixel recommendations. If using a component library, name which spacing tokens to use.
```

**Prompt 04 — Color And Contrast Stress Test**

```
Run a full color and contrast audit on this design. Go through each layer:

PALETTE LOGIC
How many colors are actively in use? List them.
Is there a clear dominant, secondary, and accent structure, or are the colors roughly equal weight?
Do any colors feel like they were added "just because"?

EMOTIONAL SIGNAL
What does this palette communicate emotionally? (e.g., clinical, warm, energetic, trustworthy, playful)
Is that the right signal for the product and audience?
Is there any tension between what the colors say and what the product promises?

ACCESSIBILITY
Flag any text and background combinations that fall below WCAG AA (4.5:1 for body, 3:1 for large text).
Are interactive elements distinguishable from non-interactive ones?

SOPHISTICATION
Is the accent color being overused? A color used everywhere is an accent color used nowhere.
Would swapping any color for a muted or desaturated version increase perceived quality?
```

**Prompt 05 — Why Does This Look Cheap?**

```
Forget the positives for now. I need a brutally honest diagnosis. Look at this design and answer:

THE DIAGNOSIS
Name the 3 specific reasons this looks underdeveloped, low budget, or unfinished.
For each reason, tell me: what visual signal is creating that impression?

THE ROOT CAUSE
Is the core problem typography, spacing, color, layout, component quality, or consistency?
If you had to fix only ONE thing that would immediately shift the perceived quality, what is it?

THE 10X TREATMENT
Give me the 3 changes that would make this design look like it cost 10x more to produce.
Order them by impact. For each: what specifically changes, and why does that signal premium quality?

WHAT TO KEEP
Name one thing in this design that is already working well and should not be changed.

Be direct. I want a design doctor, not a design cheerleader.
```

## Call to Action / Conclusion

Comment "Design" under the post to receive all 6 repo links via DM from @Parasmadan.In. The sixth prompt is not shown in the carousel and is only accessible through this engagement mechanic. Follow @Parasmadan.In for daily AI launches, dev tools, and what matters in tech. Hashtags: #claude #design #premium.
