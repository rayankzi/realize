import type { UIMessage } from "ai";

export type Chat = {
  id: string;
  title: string;
  messages: UIMessage[];
  model: string | null;
  createdAt: number;
  updatedAt: number;
};

/** Concatenate the text parts of a message into a plain string. */
export function extractText(message: UIMessage): string {
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("")
    .trim();
}

/**
 * Derive a chat title from the first user message while the chat is still
 * untitled. Returns the existing title unchanged if no derivation applies.
 * Shared by the API (PATCH) and the client store so titling stays consistent.
 */
export function deriveTitle(
  currentTitle: string,
  messages: UIMessage[] | undefined,
): string {
  if (!messages) return currentTitle;
  if (currentTitle !== "New chat" && currentTitle.trim() !== "") {
    return currentTitle;
  }
  const firstUser = messages.find((m) => m.role === "user");
  const text = firstUser ? extractText(firstUser) : "";
  return text ? text.slice(0, 48).trim() : currentTitle;
}
