# Stop Pasting Docs Into Claude Code — Use NotebookLM as Your RAG Layer Instead

**Topic/Category:** AI Tools / Developer Workflow Optimization
**Primary Goal of the Reel:** Teach developers the correct architecture for using Claude Code with large documents by pairing it with NotebookLM as a free retrieval layer, rather than stuffing documents directly into the context window.

---

## Executive Summary

The creator argues that the common practice of pasting PDFs, specs, and other documents directly into Claude Code is fundamentally wrong — it turns an expensive language model into a glorified document reader, bloating the context window and degrading performance. The proposed solution is a two-layer architecture: use Google's free NotebookLM as the retrieval/knowledge layer and Claude Code strictly as the execution layer. An unofficial Python library called `notebooklm-py` (available on PyPI) ships with a Claude Code skill that enables this integration out of the box, effectively giving developers a zero-build RAG pipeline.

## Core Insights & Takeaways

- **Insight 1:** Pasting full documents into Claude Code is the most expensive and wasteful use of its context window — it turns a code execution tool into a document reader.
- **Insight 2:** The correct architecture separates retrieval (NotebookLM) from execution (Claude Code). NotebookLM handles all source material; Claude Code only receives the relevant chunks it needs.
- **Insight 3:** An unofficial Python library `notebooklm-py` on PyPI ships with a built-in Claude Code skill, enabling Claude to query your entire NotebookLM knowledge base mid-session without a browser — essentially a free, pre-built RAG pipeline.
- **Insight 4:** This approach keeps the context window clean, sessions fast, and costs down — solving three pain points at once.

## Narrative & Step-by-Step Breakdown

**Beginning (Hook):** The creator opens with a provocative challenge — "Everyone keeps talking about NotebookLM and Claude Code, but are they actually using it correctly?" This immediately creates tension and curiosity.

**Middle (Core Argument):**
1. **The Problem:** Every time you paste a PDF or spec into Claude Code, you're misusing the tool. The context window fills up, sessions slow down, costs increase, and output quality drops.
2. **The Solution Architecture:** NotebookLM serves as Google's free retrieval layer. You load all your sources there — competitor docs, research papers, spec docs, support transcripts — everything in one place.
3. **How It Works:** Claude Code never sees the full document. It queries NotebookLM, gets back only the relevant chunk, and uses that as grounded context while building.
4. **The Tool:** There's an unofficial Python library called `notebooklm-py` available on PyPI. It ships with a Claude Code skill built in. One install, and Claude Code can query your entire knowledge base mid-session without touching the internet.

**End (Conclusion):** The creator frames this as "This is RAG — you don't have to build it," positioning NotebookLM + Claude Code as a zero-effort retrieval-augmented generation setup. Ends with a CTA to comment "notebook" for the exact setup.

## Visual Context & On-Screen Text

No frames were extracted for this reel. This analysis is based on the transcription and caption only. The visual presentation likely included screen recordings or diagrams showing the NotebookLM ↔ Claude Code architecture, but this cannot be confirmed without frame data.

## Hook & Call to Action

- **The Hook:** Opens with a direct challenge to the audience — "Everyone keeps talking about NotebookLM and Claude Code, but are they actually using it correctly?" — implying most people are doing it wrong, which creates immediate engagement.
- **Call to Action:** Comment "notebook" to receive the exact setup instructions. Repeated at both the beginning and end of the caption for maximum visibility.
