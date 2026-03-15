---
name: analyze-video
description: Use when you need to analyze an Instagram reel directory containing a transcription, caption, and optionally extracted frames. Invoked with a directory path argument to the UUID reel directory.
---

# Analyze Instagram Reel / Video

## Overview

Read the transcription, caption, and optionally extracted video frames from an Instagram reel's UUID directory, then synthesize the content into a structured markdown analysis file using the analyze-video prompt format.

## How to Use

The skill is invoked with one argument: the path to the UUID directory containing the reel's data.

### Step 1: Validate the Directory

1. Use the Read tool to read `transcription.txt` from the provided directory.
2. Use the Read tool to read `captions.txt` from the provided directory.
3. Use the Glob tool to check for any extracted frames matching `frames/frame_*.jpg` in the provided directory.
4. If both `transcription.txt` and `captions.txt` are missing, inform the user and stop.

### Step 2: Read All Content

1. Note the transcription text from `transcription.txt` (may be empty).
2. Note the caption text from `captions.txt`.
3. If a `frames/` directory exists with frame images, use the Read tool to read **every** frame image file found (e.g., `frame_0001.jpg`, `frame_0002.jpg`, etc.). The Read tool supports viewing images natively. These frames are sampled at 1 frame per second.

### Step 3: Analyze and Generate Output

Act as an expert video content analyst. Synthesize the audio-visual narrative and the caption into a structured Markdown document. Cross-reference the transcription with the visual frames (if available) to capture the complete picture.

Use the following Markdown format:

```markdown
# [Create a Catchy, Relevant Title Based on the Video Content]

**Topic/Category:** [e.g., Tech Tutorial, Coding, Recipe, Fitness, Comedy, etc.]
**Primary Goal of the Reel:** [Brief 1-2 sentence summary of what the creator is trying to achieve or teach]

---

## Executive Summary

[Provide a short paragraph summarizing the main takeaway. Blend the context from the caption, the spoken transcription, and the overall visual narrative.]

## Core Insights & Takeaways

[Extract the most important points from the video. Use bullet points for readability. Focus on the actual value delivered to the viewer.]

- **Insight 1:** [Detail]
- **Insight 2:** [Detail]
- **Insight 3:** [Detail]

## Narrative & Step-by-Step Breakdown

[Chronologically break down the video. Depending on the content type, use the most appropriate format below:]

- **If it's a Tutorial/Recipe:** Provide a numbered list of instructions, combining what is said in the transcription with what is actually shown in the frames.
- **If it's Informational/Vlog:** Summarize the key topics discussed in order (e.g., **Beginning:** [Hook/Intro], **Middle:** [Core Argument], **End:** [Conclusion]).

## Visual Context & On-Screen Text

[Describe crucial visual elements that the transcription alone misses.

- Did the creator use physical gestures or point to specific things?
- Was there important B-roll footage or screen-recordings?
- **Crucially:** Summarize any important on-screen text (pop-ups, subtitles, code snippets, or ingredients) that appeared in the frames but wasn't spoken out loud.
- If no frames were extracted, note that this analysis is based on the transcription and caption only.]

## Hook & Call to Action

- **The Hook:** [Identify how the creator grabbed attention in the first 3 seconds—was it a bold statement, a visual transition, or a specific question?]
- **Call to Action:** [Summarize any final instructions, such as "Read the caption," "Link in bio," or specific engagement requests.]
```

### Step 4: Save the Output

1. Extract the UUID from the directory path (the last segment of the path).
2. Ensure the `output/` directory exists at the project root (`/Users/rayankazi/Developer/projects/realize/output/`). If not, create it using Bash: `mkdir -p /Users/rayankazi/Developer/projects/realize/output`
3. Write the analysis markdown to `/Users/rayankazi/Developer/projects/realize/output/<uuid>-analysis.md` using the Write tool.

### Step 5: Rename the Output File

1. Read the analysis file you just wrote to determine the topic/theme of the content.
2. Based on the title and topic, generate a short, descriptive, kebab-case filename (e.g., `python-debugging-tips.md`, `morning-routine-hacks.md`). Keep it concise (3-5 words max).
3. Rename the file using Bash: `mv /Users/rayankazi/Developer/projects/realize/output/<uuid>-analysis.md /Users/rayankazi/Developer/projects/realize/output/<new-name>.md`
4. Inform the user that the analysis has been saved and provide the final output path.
