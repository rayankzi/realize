import type { UIMessage } from "ai";

export type Chat = {
  id: string;
  title: string;
  messages: UIMessage[];
  model: string | null;
  createdAt: number;
  updatedAt: number;
};

const STORAGE_KEY = "realize.chats.v1";

function uid() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/* ── in-memory cache + subscriptions (useSyncExternalStore friendly) ── */

let cache: Chat[] | null = null;
const EMPTY: Chat[] = [];
const listeners = new Set<() => void>();

function read(): Chat[] {
  if (cache) return cache;
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    cache = raw ? (JSON.parse(raw) as Chat[]) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(next: Chat[]) {
  cache = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* quota / private mode — keep in-memory copy */
    }
  }
  listeners.forEach((l) => l());
}

export const chatStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getSnapshot(): Chat[] {
    return read();
  },

  getServerSnapshot(): Chat[] {
    return EMPTY;
  },

  get(id: string): Chat | undefined {
    return read().find((c) => c.id === id);
  },

  create(model: string | null): Chat {
    const now = Date.now();
    const chat: Chat = {
      id: uid(),
      title: "New chat",
      messages: [],
      model,
      createdAt: now,
      updatedAt: now,
    };
    write([chat, ...read()]);
    return chat;
  },

  save(id: string, patch: Partial<Pick<Chat, "messages" | "model" | "title">>) {
    const chats = read();
    const idx = chats.findIndex((c) => c.id === id);
    if (idx === -1) return;

    const current = chats[idx];
    const next: Chat = { ...current, ...patch, updatedAt: Date.now() };

    // auto-title from the first user message while still untitled
    if (
      (next.title === "New chat" || next.title.trim() === "") &&
      patch.messages
    ) {
      const firstUser = patch.messages.find((m) => m.role === "user");
      const text = firstUser ? extractText(firstUser) : "";
      if (text) next.title = text.slice(0, 48).trim();
    }

    const reordered = [next, ...chats.filter((c) => c.id !== id)];
    write(reordered);
  },

  rename(id: string, title: string) {
    const chats = read();
    write(
      chats.map((c) =>
        c.id === id ? { ...c, title: title.trim() || "Untitled", updatedAt: Date.now() } : c,
      ),
    );
  },

  remove(id: string) {
    write(read().filter((c) => c.id !== id));
  },
};

export function extractText(message: UIMessage): string {
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("")
    .trim();
}
