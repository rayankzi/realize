# Connect Claude AI to Instagram DMs via ManyChat: A Foolproof Guide

**Topic/Category:** AI Automation / Social Media Marketing / Lead Generation
**Primary Goal of the Post:** Teach creators and business owners how to safely integrate Claude AI into their Instagram DMs using ManyChat as middleware, enabling automated, intelligent lead conversations at scale.

---

## Executive Summary

This carousel is a step-by-step tutorial on building an AI-powered Instagram DM automation system. Rather than directly connecting Claude to Instagram (which risks account bans), the creator presents ManyChat as the safe, compliant bridge. The workflow captures lead responses, passes them to Claude for analysis, and uses the output to dynamically continue the conversation — effectively creating a full AI sales/qualification agent running inside Instagram DMs.

## Key Insights & Main Ideas

- **Never connect Claude directly to Instagram** — accounts have been shut down for this. Use ManyChat as the compliant middleware layer.
- **You don't need a paid Claude account** to use the API — only an Anthropic API key is required.
- **Define your conversation goal first** — the whole system is built around one core objective: qualify leads, book calls, segment audience, or upsell.
- **ManyChat's "Data Collection" field is the core mechanism** — it captures user responses and passes them into Claude via custom fields.
- **Claude's system prompt is where business context lives** — this is how you inject tone of voice, product knowledge, and the AI's goal into each conversation.
- **The loop repeats** — Claude's output becomes the next message, building a contextual, evolving conversation with each lead.
- **Bonus: qualified leads can be auto-assigned to a team member** using ManyChat's condition/action flow.

## Detailed Breakdown / Step-by-Step

1. **Step 1 — Create a Claude API Key:** Log into the Anthropic console. Go to Manage > API Keys > click "+ Create Key." No paid Claude subscription required — only the API.

2. **Step 2 — Connect Claude to ManyChat:** In ManyChat, navigate to Settings > Integrations > Claude > paste in your API key to link the accounts.

3. **Step 3 — Define the Goal of the Conversation:** Before building anything, decide what the AI is trying to accomplish. Options include: qualify leads, book a sales call, segment your audience, or upsell into a low-ticket offer. This goal informs the system prompt in the next step.

4. **Step 4 — Use a Data Collection Field in ManyChat:** In your ManyChat flow, add a message asking the lead a question (e.g., "Where are you at in your baking journey?"). Set a "User Input" step with Reply Type: Text and save their response to a custom field (e.g., `GOAL INPUT`).

5. **Step 5 — Prompt Claude to Analyze the Response:** Add a "Claude Actions: Request" step. Select model (e.g., Claude Opus 4.6). Write a system prompt that gives Claude context about your business and tone of voice, instructs it to analyze the `GOAL INPUT` field, and categorize/bucket the lead's answer. Save the output to another custom field (e.g., `GOAL OUTPUT`).

6. **Step 6 — Use the Claude Output and Repeat:** Send the `GOAL OUTPUT` as the next DM message. Then add another data collection step to gather the lead's next reply. Feed that back into Claude. The conversation builds iteratively, with Claude retaining context about the lead from prior exchanges.

7. **Bonus — Auto-Assign Qualified Leads to a Team Member:** After the lead qualifies (e.g., `1ON1 INPUT` has a value), add a Smart Delay (2 min), run a Condition check, and if met, use an Action to "Assign conversation" to a specific team member (e.g., a sales rep).

## Notable Visual Context

- **Slide 3** shows a screenshot of the Anthropic console UI with "API Keys" and a "+ Create Key" button highlighted in blue, making the step immediately actionable.
- **Slide 4** shows the ManyChat integrations panel with Claude already connected — displaying "Claude Account Name: claude" and a Disconnect option, confirming this is a native integration.
- **Slide 6** shows the ManyChat flow builder with the data collection block — a chat bubble asking the lead a personalized question, the "Waiting for Text from contact..." indicator, and the custom field `GOAL INPUT` being saved.
- **Slide 7** shows the "Claude Actions: Request" block in ManyChat's flow builder, with model selector (Claude Opus 4.6) and a system prompt field visible — demonstrating exactly where the AI logic is configured.
- **Slide 8** shows a ManyChat flow sending `GOAL OUTPUT` as a message followed by another question — visualizing the iterative loop structure.
- **Slide 9** shows a ManyChat condition/action pipeline: Smart Delay (2 min) → Condition (`1ON1 INPUT` has any value) → Action (assign to Gannon Meyer).
- **Slide 11** is a collage of social proof screenshots — testimonials calling the method "ninja s***," "PURE GOLD," "a game changer," and one user claiming they made $1,300 from one launch email after implementing the workflow.

## Call to Action / Conclusion

The caption and slide 10 promote a paid Claude + ManyChat workshop held on April 2nd at 2 PM EST. The trigger to register is commenting "42" on the post, which activates a ManyChat automation. The creator emphasizes it is NOT a free workshop — explicitly targeting serious, action-ready learners only. Slide 11 backs up the pitch with heavy social proof to overcome objection before the CTA.
