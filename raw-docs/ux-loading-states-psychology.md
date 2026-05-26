# The Psychology of Loading: When to Use Skeletons, Spinners, and Progress Bars

**Topic/Category:** UX Design / Product Design
**Primary Goal of the Reel:** To educate designers and developers on the different types of loading states and the specific psychological impact each one has on the user experience.

---

## Executive Summary

This video is the third part of a "Build Better UX" series, focusing on the strategic selection of loading indicators. The creator breaks down four primary loading experiences: skeleton screens, progress bars, inline spinners, and optimistic UI. By matching the loading state to the user's action and expected duration, developers can create a more responsive and less frustrating experience, leveraging "Optimistic UI" to make actions feel instantaneous.

## Core Insights & Takeaways

- **Skeleton Screens for Layout:** Use these for high-level page loads or large content sections (e.g., social media feeds). They signal that the structure is ready and content is imminent, reducing perceived wait time.
- **Progress Bars for Known Durations:** Essential for long-running processes like file uploads or installations. They provide a sense of progress and prevent the user from assuming the process is stuck.
- **Inline Spinners for Micro-actions:** Best for small, contained updates (e.g., clicking a button or refreshing a single component). They provide immediate feedback that the system is processing a request.
- **Optimistic UI for Instant Feedback:** Some actions should have no loader at all. By immediately updating the UI (like an Instagram "Like" heart) before server confirmation, the application feels significantly faster and more "instant" by design.
- **Consistency is Key:** Choosing the wrong loader (e.g., a spinner for a long upload) can lead to user confusion or the perception of a broken app.

## Narrative & Step-by-Step Breakdown

1. **Introduction:** The creator introduces the question: "Which loading option do you choose?" and frames it as a psychological decision.
2. **Skeleton Screens:** Explained using Instagram and LinkedIn as examples. Visuals show "content fills" overlays.
3. **Progress Bars:** Explained in the context of file uploads. Visuals show a Windows-style compression progress bar.
4. **Inline Spinners:** Described as "small indicators" for contained actions.
5. **Optimistic UI:** Detailed with the Instagram "Like" example. The creator explains that it "assumes it works" to feel instant, with a rollback mechanism for failures.
6. **Conclusion:** Teases the next video, which will go deeper into the specific types of inline spinners.

## Visual Context & On-Screen Text

- **On-Screen Pop-ups:** The video uses prominent text overlays to highlight key terms like "Part 3 of my series," "content fills," "they might need to wait," and "DESIGN."
- **Visual Aids:** The creator uses specific overlays to demonstrate each concept:
    - A blurred YouTube-style skeleton screen for "Skeleton Screens."
    - A "Compressing..." progress bar dialog for "Progress Bars."
    - A simple spinning wheel icon for "Inline Spinners."
- **Gestures:** The creator uses a microphone and active hand gestures to emphasize the "psychological response" aspect of the topic.

## Hook & Call to Action

- **The Hook:** "Which loading option do you choose? A skeleton screen, a spinner, a progress bar, or no loader at all?" — A direct question that challenges the viewer's technical knowledge and promises a psychological breakdown.
- **Call to Action:** "So, see you in the next one" (Implicit CTA to follow for the next part of the series). The caption also reinforces that the next part will dive deeper into spinners.
