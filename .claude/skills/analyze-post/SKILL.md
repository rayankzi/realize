---
name: analyze-post
description: Use when you need to analyze an Instagram post or carousel directory containing images and a caption. Invoked with a directory path argument to the UUID post directory.
---

# Analyze Instagram Post / Carousel

## Overview

Read all images and the caption from an Instagram post's UUID directory, then synthesize the content into a structured markdown analysis file. The analysis extracts core value, key ideas, and insights from the post.

## How to Use

The skill is invoked with one argument: the path to the UUID directory containing the post's images and `captions.txt`.

### Step 1: Validate the Directory

1. Use the Glob tool to find all image files matching `image_*.jpg` in the provided directory.
2. Use the Read tool to read `captions.txt` from the provided directory.
3. If no images are found or `captions.txt` is missing, inform the user and stop.

### Step 2: Read All Content

1. Use the Read tool to read **every** image file found (e.g., `image_1.jpg`, `image_2.jpg`, etc.). The Read tool supports viewing images natively.
2. Note the caption text you already read from `captions.txt`.

### Step 3: Analyze and Generate Output

Act as an expert content analyst and archivist. Analyze the visual content of all the images alongside the caption, and synthesize the information into the following structured Markdown format:

```markdown
# [Create a Catchy, Relevant Title Based on the Content]

**Topic/Category:** [e.g., Tech, Recipe, Productivity, Finance, etc.]
**Primary Goal of the Post:** [Brief 1-2 sentence summary of what the post is trying to teach or convey]

---

## Executive Summary

[Provide a short paragraph summarizing the main takeaway, blending the context from the caption with the visual narrative of the images.]

## Key Insights & Main Ideas

[Extract the most important points. Use bullet points for readability. If the post is informational, list the top facts. If it's a recipe or tutorial, list the core techniques or ingredients/tools required.]

- **Insight 1:** [Detail]
- **Insight 2:** [Detail]
- **Insight 3:** [Detail]

## Detailed Breakdown / Step-by-Step

[Use this section to break down the carousel progression. Depending on the content type, use the most appropriate format below:]

- **If it's a Step-by-Step/Recipe:** Provide a numbered list of instructions combining text from the images and caption.
- **If it's an Informational Carousel:** Provide a slide-by-slide summary (e.g., **Slide 1:** [Focus], **Slide 2:** [Focus]).

## Notable Visual Context

[Describe any important visual cues that add value to the information. Are there charts, diagrams, specific UI elements shown, or before/after visual proof? Summarize what the visuals communicate that the text alone doesn't.]

## Call to Action / Conclusion

[Summarize any final thoughts, tips, or calls to action mentioned in the caption (e.g., "Save this for later," "Check the link in bio," or specific hashtags used that indicate the broader theme).]
```

### Step 4: Save the Output

1. Extract the UUID from the directory path (the last segment of the path).
2. Ensure the `output/` directory exists at the project root (`/Users/rayankazi/Developer/projects/realize/output/`). If not, create it using Bash: `mkdir -p /Users/rayankazi/Developer/projects/realize/output`
3. Write the analysis markdown to `/Users/rayankazi/Developer/projects/realize/output/<uuid>-analysis.md` using the Write tool.

### Step 5: Rename the Output File

1. Read the analysis file you just wrote to determine the topic/theme of the content.
2. Based on the title and topic, generate a short, descriptive, kebab-case filename (e.g., `data-science-roadmap.md`, `quick-pasta-recipe.md`, `productivity-tips.md`). Keep it concise (3-5 words max).
3. Rename the file using Bash: `mv /Users/rayankazi/Developer/projects/realize/output/<uuid>-analysis.md /Users/rayankazi/Developer/projects/realize/output/<new-name>.md`
4. Inform the user that the analysis has been saved and provide the final output path.
