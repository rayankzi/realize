---
name: analyze-transcription
description: Use when you need to determine whether an Instagram reel video requires frame-by-frame extraction based on its transcription text. Invoked with a filepath argument to the transcription.txt file.
---

# Analyze Transcription for Frame Extraction

## Overview

Read a video transcription and determine whether frame-by-frame visual extraction is needed to fully understand the video's content. Some videos are purely verbal (opinions, stories, narration) and the transcription alone is sufficient. Others reference visual elements that cannot be understood from audio alone.

## How to Use

1. Read the transcription file at the path provided as the argument.
2. Read the `captions.txt` file in the same directory as the transcription file.
3. Analyze the transcription and caption against the visual dependency triggers and caption-heavy content rules below.
4. Output your verdict with reasoning.

## Visual Dependency Triggers

Frame-by-frame extraction is likely required when the speaker:

**Direct screen references:**

- "look at this", "watch this", "check this out", "as you can see"
- "right here", "over here", "this right here", "this part"
- "on screen", "on the screen", "what's showing"

**Demonstrating or showing something:**

- "let me show you", "I'll show you", "showing you", "here's what it looks like"
- "watch how", "watch me", "see how", "notice how"
- "this is what", "this is how", "here's the result"

**Referencing text overlays or captions:**

- "it says", "as it says", "read that", "the text says"
- "the caption", "the title", "the label"
- references to numbers, stats, or data shown visually

**Before/after or comparisons:**

- "before and after", "the difference", "compared to", "versus"
- "on the left", "on the right", "side by side", "top vs bottom"

**Tutorials, demos, or physical actions:**

- step-by-step instructions implying visual demonstration (cooking, makeup, DIY, coding walkthrough)
- "first you", "then you", "next step" combined with action verbs (apply, put, place, drag, click, tap, swipe)
- "follow along", "do this", "like this"

**Reactions to visual content:**

- "look at that", "oh my god look", "did you see that"
- reacting to something without describing it verbally
- laughter or exclamations with no verbal context for what triggered them

**Product or place showcases:**

- "this product", "this place", "this spot", "this fit", "this outfit"
- unboxing, hauls, try-ons, room tours
- "here's what I got", "let me try this on"

**Referencing other media:**

- "this video", "this clip", "this photo", "this meme"
- duets, stitches, or reaction-style content where context depends on the original visual

## Caption-Heavy Reels

Some reels exist primarily to direct the viewer to the caption, where the real information lives. In these cases the video itself is visually unimportant (e.g., a talking head saying "check the caption", a generic clip with text overlay pointing to the caption, or background footage with no meaningful visual content).

If the caption contains the vast majority (~90%+) of the detailed, insightful information — and the transcription mainly serves to redirect the viewer to read the caption — then frame-by-frame extraction is **not** needed. The caption already captures the value of the reel.

Signs of a caption-heavy reel:
- The speaker says things like "read the caption", "check the caption", "all the info is in the caption", "link in caption"
- The transcription is short or vague while the caption is long and detailed
- The caption contains lists, steps, resources, or in-depth explanations that the speaker does not cover verbally
- The video is a generic talking-head or stock clip with no unique visual information

## When Frame Extraction is NOT Required

- Pure storytelling, opinions, rants, or commentary with no visual references
- Talking-head content where the speaker fully describes everything verbally
- Music or audio-only content
- Voiceover narration that is self-contained and descriptive enough on its own
- Caption-heavy reels where the caption contains the bulk of the valuable information and the video has no meaningful visual content

## Output Format

After analyzing, output your reasoning followed by a clear verdict:

- If frame extraction IS required: include the word **YES** (all caps) in your response. Do not include the word "NO" in all caps.
- If frame extraction is NOT required: include the word **NO** (all caps) in your response. Do not include the word "YES" in all caps.

Example output:

```
The transcription contains several references to on-screen content:
- "look at this right here" (suggesting visual demonstration)
- "as you can see the difference" (before/after comparison)
- Multiple step-by-step instructions without verbal descriptions of what's being shown

Verdict: Frame-by-frame extraction is required. YES
```
