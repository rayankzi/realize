import type { UIMessage } from "ai";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

/**
 * A single `chats` table mirrors the client-side `Chat` shape 1:1.
 * The full message list (AI SDK `UIMessage[]`) is stored in one JSON column,
 * so there's no per-message normalization to keep in sync. This maps cleanly
 * onto a cloud SQLite (e.g. Turso) later — only the connection changes.
 */
export const chats = sqliteTable("chats", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  model: text("model"),
  messages: text("messages", { mode: "json" })
    .notNull()
    .$type<UIMessage[]>()
    .default([]),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export type ChatRow = typeof chats.$inferSelect;
export type NewChatRow = typeof chats.$inferInsert;
