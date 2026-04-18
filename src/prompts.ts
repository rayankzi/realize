import type { PromptBundle } from "./types";

export const prompts: PromptBundle = {
  analyzePost: `
You are analyzing an Instagram static post or carousel using the files and tools provided in the current workspace.

Goal:
- Read the caption and all relevant post images.
- Synthesize the content into a useful, well-structured markdown analysis.
- Write the final markdown file to the output location available through the provided tools.

General instructions:
- Use the available file tools to inspect the workspace before writing.
- If the workspace contains multiple images, treat them as a sequence and preserve the progression of ideas.
- Use attached images and any readable file content together; do not invent details that are not supported by the source material.
- If required source material is missing, say so clearly instead of guessing.

Output requirements:
- Write one markdown document.
- Start with a level-1 title that is short, descriptive, and specific to the content.
- Include:
  - Topic/Category
  - Primary Goal of the Post
  - Executive Summary
  - Key Insights & Main Ideas
  - Detailed Breakdown or slide-by-slide / step-by-step progression
  - Notable Visual Context
- Include a "Verbatim Templates & Scripts" section only when the post contains copyable wording such as templates, scripts, outreach text, formulas, or other text that should be preserved exactly. Reproduce those items verbatim and clearly distinguish them from your analysis.
- End with any notable call to action or conclusion if one is present.

Style requirements:
- Be concise but information-dense.
- Prefer faithful synthesis over hype.
- Keep structural headings consistent and readable.
`.trim(),
  analyzeTranscription: `
You are deciding whether video frame extraction is necessary to understand an Instagram reel or short-form video.

Goal:
- Read the transcription and caption available in the workspace.
- Decide whether the visuals are required to fully understand the content.

Use frame extraction when the spoken content depends on visuals such as:
- direct references to what is on screen
- demonstrations, walkthroughs, or physical actions
- comparisons, before/after visuals, or side-by-side content
- important text overlays, screenshots, charts, code, UI, or other visual information
- reactions to visual material that is not fully described aloud

Do not require frame extraction when:
- the transcription is self-contained and understandable on its own
- the content is primarily commentary, storytelling, or narration without meaningful visual dependence
- the caption contains nearly all of the useful information and the video itself appears visually generic

Output requirements:
- Return brief reasoning grounded in the transcription/caption.
- End with exactly one clear verdict:
  - YES if frame extraction is required
  - NO if frame extraction is not required
- Do not include both verdict words in uppercase anywhere in the response.
`.trim(),
  analyzeVideo: `
You are analyzing an Instagram reel or short-form video using the transcription, caption, optional extracted frames, and any attached images provided in the current workspace.

Goal:
- Combine the spoken content, caption, and useful visual evidence into one structured markdown analysis.
- Write the final markdown file to the output location available through the provided tools.

General instructions:
- Read the transcription and caption first.
- If frames are available, use them to capture important visual details, on-screen text, demonstrations, comparisons, UI, code, charts, or other information not fully present in the transcription.
- If frames are not available, state that the analysis is based on transcription and caption only.
- Do not invent visuals or claims that are not supported by the provided material.

Output requirements:
- Write one markdown document.
- Start with a level-1 title that is short, descriptive, and specific to the video.
- Include:
  - Topic/Category
  - Primary Goal of the Reel
  - Executive Summary
  - Core Insights & Takeaways
  - Narrative or Step-by-Step Breakdown
  - Visual Context & On-Screen Text
  - Hook & Call to Action
- Include a "Verbatim Templates & Scripts" section only when the video contains reusable wording or text that should be preserved exactly from the transcription, caption, or on-screen text.

Style requirements:
- Be concise, accurate, and grounded in the source material.
- Prefer chronological clarity when summarizing the video flow.
- Distinguish clearly between spoken information and visual-only context when helpful.
`.trim(),
  analyzeFrames: `
You are filtering extracted video frames to keep only the frames that add meaningful information for later analysis.

Goal:
- Review the available frames.
- Keep frames that contain unique informational value.
- Remove frames that are redundant, empty, or not useful.

Keep frames when they contain information such as:
- code, terminals, IDEs, repositories, UI, dashboards, or mockups
- diagrams, flowcharts, tables, charts, or data visualizations
- important text overlays, captions, lists, templates, or instructions
- demonstrations showing distinct steps or materially different states
- before/after comparisons or other visually meaningful changes

Remove frames when they are:
- nearly identical to adjacent frames
- generic talking-head shots with no meaningful overlay or visual aid
- transition frames, black frames, blurred frames, or otherwise unreadable frames
- generic b-roll that adds no informational value

Output requirements:
- Use the available tools to remove unwanted frames when appropriate.
- Finish with a concise summary of what was kept, what was removed, and why.
`.trim(),
};
