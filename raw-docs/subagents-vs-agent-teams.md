# Sub-Agents vs Agent Teams: When to Use Each in Claude

**Topic/Category:** AI Engineering, Multi-Agent Systems
**Primary Goal of the Reel:** Explain the fundamental difference between sub-agents and agent teams in Claude, helping developers choose the right architecture for their use case.

---

## Executive Summary

This reel provides a concise mental model for understanding two multi-agent patterns: sub-agents and agent teams. Sub-agents are framed as independent contractors—ideal for parallelizing isolated tasks without polluting the orchestrator's context window. Agent teams, by contrast, are long-running collaborators that share context, coordinate in real time, and adapt as work evolves. The caption reinforces the explanation and points viewers to a free Maven course on multi-agent architecture.

## Core Insights & Takeaways

- **Insight 1:** Sub-agents operate in their own context window, complete a focused task, and return the result. Their key advantage is parallelism—running multiple independent jobs simultaneously without cluttering the main orchestrator.
- **Insight 2:** Agent teams are persistent, collaborative entities. They typically consist of a lead agent, working agents, and shared task state, allowing real-time coordination and context sharing.
- **Insight 3:** The decision heuristic is simple: if the work is isolated, use sub-agents; if the work requires collaboration, use agent teams.

## Narrative & Step-by-Step Breakdown

- **Beginning (Hook):** The creator opens with a direct conditional—"If you don't know the difference between sub-agents and agent teams in Claude, pay attention"—immediately filtering for the target audience and creating urgency.
- **Middle (Core Explanation):**
  - **Sub-agents** are compared to contractors: given a specific job, they work independently in their own context window, enabling parallelism and keeping the orchestrator's context clean.
  - **Agent teams** are compared to employees: long-running, able to communicate with each other directly, and capable of building shared context over time. A typical setup includes a lead agent, working agents, and shared task state.
- **End (Summary & CTA):** The creator distills the decision into a single rule—isolated work → sub-agents, collaborative work → agent teams—and directs viewers to comment "agent" for a link to learn more about multi-agent system design.

## Visual Context & On-Screen Text

No frames were extracted for this reel. This analysis is based on the transcription and caption only. The caption suggests the video may have included visual aids or text overlays distinguishing the two concepts, but this cannot be confirmed without frames.

## Hook & Call to Action

- **The Hook:** "If you don't know the difference between sub-agents and agent teams in Claude, pay attention." — A direct, knowledge-gap hook that challenges the viewer and promises a clear answer.
- **Call to Action:** Comment "agent" for a link to learn more about designing multi-agent systems. The caption also promotes a free Maven course called "Context Engineering for Agents & Multi-Agent Systems."
