---
name: analyze-transcription
description: Use when you need to determine whether an Instagram reel video requires frame-by-frame extraction based on its transcription text. Invoked with a filepath argument to the transcription.txt file.
---

# Analyze Transcription for Frame Extraction

## Overview

Read a video transcription and determine whether frame-by-frame visual extraction is needed to fully understand the video's content. Some videos are purely verbal (opinions, stories, narration) and the transcription alone is sufficient. Others reference visual elements that cannot be understood from audio alone.

## How to Use

1. Read the transcription file at the path provided as the argument.
2. Analyze the transcription against the visual dependency triggers below.
3. Output your verdict with reasoning.

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

## When Frame Extraction is NOT Required

- Pure storytelling, opinions, rants, or commentary with no visual references
- Talking-head content where the speaker fully describes everything verbally
- Music or audio-only content
- Voiceover narration that is self-contained and descriptive enough on its own

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
