---
name: analyze-frames
description: Use when you need to filter extracted video frames, keeping only visually meaningful ones and deleting redundant or empty frames. Invoked with a directory path argument to the UUID video directory containing a frames/ subdirectory.
---

# Analyze and Filter Extracted Video Frames

## Overview

Go through all extracted video frames in a UUID directory's `frames/` subdirectory and determine which frames contain visually meaningful content worth keeping for analysis. Delete frames that are redundant, empty, or contain no useful visual information.

## How to Use

The skill is invoked with one argument: the path to the UUID directory that contains a `frames/` subdirectory.

### Step 1: Load All Frames

1. Use the Glob tool to find all frame images matching `frames/frame_*.jpg` in the provided directory.
2. If no frames are found, inform the user and stop.

### Step 2: Analyze Each Frame

For each frame, use the Read tool to view the image and evaluate it against these criteria:

**KEEP the frame if it contains:**

- Screenshots of code, terminals, IDEs, or GitHub repositories
- Diagrams, flowcharts, architecture diagrams, or mind maps
- Text overlays with meaningful information (tips, steps, instructions, templates)
- Email templates, message templates, or document examples
- Charts, graphs, data visualizations, or tables
- UI/UX designs, wireframes, or mockups
- Before/after comparisons showing meaningful differences
- Product demos showing distinct states or features
- Slides or presentation content with readable text
- Any on-screen text that adds information not available in the transcription

**DELETE the frame if it:**

- Is a talking-head shot with no on-screen text or visual aids
- Is nearly identical to an adjacent frame (redundant)
- Is a transition frame (blur, fade, black screen)
- Shows only the creator's face without any informational overlay
- Is too blurry or dark to extract any useful information
- Contains only generic b-roll with no informational value

### Step 3: Delete Unwanted Frames

For each frame that should be deleted, use Bash to remove it:

```
rm <path-to-frame>
```

### Step 4: Report Results

Print a summary of:

- Total frames analyzed
- Frames kept (list filenames)
- Frames deleted (list filenames)
- Brief reason for each kept frame (e.g., "contains code screenshot", "has step-by-step text overlay")
