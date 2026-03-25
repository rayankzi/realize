---
name: organize-output
description: Use when you need to organize the markdown video summary files in output/ by topic into organized-output/. Copies output/ to organized-output/, categorizes all .md files by content, and moves them into topic subdirectories using parallel subagents for maximum efficiency.
---

# Organize Output Files by Topic

## Overview

Organize markdown video summary files from `output/` into topic-based subdirectories within `organized-output/`. Uses parallel subagents at every phase for maximum efficiency. After organization is complete and verified, empties the `output/` directory (keeping the directory itself).

## How to Use

This skill takes no arguments. It operates on the project root directories `output/` and `organized-output/`.

### Step 1: Copy output/ to organized-output/

1. Use Bash to copy the entire `output/` directory to `organized-output/` at the project root (`/Users/rayankazi/Developer/projects/realize/`):
   ```
   rm -rf /Users/rayankazi/Developer/projects/realize/organized-output
   cp -r /Users/rayankazi/Developer/projects/realize/output /Users/rayankazi/Developer/projects/realize/organized-output
   ```
2. **From this point forward, do NOT touch the `output/` directory until Step 6. All organization operations happen within `organized-output/` only.**

### Step 2: Phase 1 — Scan & Categorize (parallelize heavily)

1. Use Glob to list all `.md` files in `organized-output/`.
2. Divide the file list into batches (aim for 5-10 files per batch, adjust based on total count).
3. **Spawn parallel subagents** using the Agent tool — one subagent per batch. Each subagent should:
   - Read every `.md` file in its assigned batch using the Read tool.
   - For each file, determine the primary topic based on its content (title, executive summary, core insights, topic/category field).
   - Return a JSON-formatted list of objects: `[{"file": "filename.md", "topic": "suggested-topic-in-kebab-case", "reason": "brief reason"}]`
4. **Maximize parallelism** — launch all batch subagents in a single message so they run concurrently.

### Step 3: Phase 2 — Define Taxonomy

1. Collect all topic suggestions from the subagent results.
2. Cluster similar topics together and define the final set of topic directories using kebab-case names.
3. Likely topic areas include (but are not limited to — discover actual categories from file contents):
   - **AI/LLM tooling** — e.g., `claude-code-optimization`, `cursor-tips`, `ai-coding-workflows`, `prompt-engineering`, `llm-api-usage`
   - **Content creation & growth** — e.g., `youtube-growth`, `instagram-content`, `short-form-video`, `thumbnails-and-titles`, `content-repurposing`
   - **Software engineering** — e.g., `web-development`, `frontend-frameworks`, `backend-architecture`, `devops-and-deployment`, `database-design`
   - **AI concepts & research** — e.g., `ai-agents`, `rag-and-embeddings`, `fine-tuning`, `ai-news-and-trends`
   - **Productivity & tools** — e.g., `developer-productivity`, `note-taking-and-pkm`, `automation-workflows`
   - **Business & monetization** — e.g., `saas-building`, `freelancing-and-consulting`, `indie-hacking`
4. **Categorization guidelines:**
   - Topics should be specific enough to be meaningful — avoid overly broad buckets like "tech" or "ai" or "programming".
   - Topics should be broad enough that most directories have 3+ files — don't create a directory for just 1-2 files unless the topic is genuinely distinct.
   - If a file could fit multiple categories, pick the best fit.
   - After initial categorization, review any directories with ≤2 files and consider merging them into a related category — but keep them separate if the topic is legitimately niche and distinct.
5. Produce a final mapping: `{"filename.md": "topic-directory-name", ...}` for every file.

### Step 4: Phase 3 — Organize (parallelize heavily)

1. Create all topic subdirectories within `organized-output/` using Bash:
   ```
   mkdir -p /Users/rayankazi/Developer/projects/realize/organized-output/{topic-1,topic-2,...}
   ```
2. Group files by their assigned topic directory.
3. **Spawn parallel subagents** — one per topic directory (or group of small directories). Each subagent should:
   - Move its assigned files from `organized-output/` root into the correct subdirectory using Bash `mv` commands.
   - Preserve original filenames.
   - Return confirmation of files moved.
4. **Launch all move subagents in a single message** for maximum concurrency.

### Step 5: Phase 4 — Summary

1. After all moves complete, verify the organization by listing the contents of each subdirectory.
2. Output a final summary table showing:
   - Each category directory name
   - Number of files in it
   - 2-3 example filenames per category

Format the summary as a markdown table:

```markdown
| Category | Files | Examples |
|----------|-------|----------|
| topic-name | N | `file1.md`, `file2.md`, `file3.md` |
```

### Step 6: Clean up output/

1. **Only after all organization is complete and verified**, delete the contents of the `output/` directory while keeping the directory itself:
   ```
   rm -rf /Users/rayankazi/Developer/projects/realize/output/*
   ```
2. Confirm to the user that `output/` has been emptied.

## Constraints

- Do **NOT** modify or delete files in `output/` until Step 6 — after all organization in `organized-output/` is fully complete and verified.
- All organization happens exclusively within `organized-output/`.
- Preserve original filenames when moving files.
- The `output/` directory itself must always remain — only its contents are deleted at the end.
- Maximize parallelism — use subagents for every phase where work can be done concurrently. Do not process files one by one when they can be batched across subagents.
