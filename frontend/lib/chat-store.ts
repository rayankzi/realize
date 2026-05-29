import { deriveTitle, extractText, type Chat } from "@/lib/chat-utils";

export type { Chat };
export { extractText };

// Legacy localStorage key — read once for a one-time import into the DB.
const LEGACY_STORAGE_KEY = "realize.chats.v1";

function uid() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/* ── in-memory cache + subscriptions (useSyncExternalStore friendly) ──
 *
 * Reads are synchronous from this cache so component contracts are unchanged.
 * The cache is hydrated once from the SQLite-backed API (`hydrate()`), and
 * every mutation updates the cache optimistically + notifies listeners, then
 * persists to the server in the background (fire-and-forget). */

let cache: Chat[] = [];
const EMPTY: Chat[] = [];
const listeners = new Set<() => void>();
let hydrated = false;
let hydrating: Promise<void> | null = null;

function read(): Chat[] {
  return cache;
}

function write(next: Chat[]) {
  cache = next;
  listeners.forEach((l) => l());
}

function logError(action: string) {
  return (err: unknown) => console.error(`[chat-store] ${action} failed`, err);
}

async function importLegacyChats(): Promise<Chat[]> {
  if (typeof window === "undefined") return [];
  let legacy: Chat[];
  try {
    const raw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return [];
    legacy = JSON.parse(raw) as Chat[];
  } catch {
    return [];
  }
  if (!Array.isArray(legacy) || legacy.length === 0) {
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    return [];
  }

  // Push each chat to the server, then drop the legacy key so we only run once.
  await Promise.all(
    legacy.map((chat) =>
      fetch("/api/chats", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(chat),
      }),
    ),
  );
  try {
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    /* ignore */
  }
  return legacy;
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

  /** Load all chats from the DB into the cache. Runs once; safe to await repeatedly. */
  async hydrate(): Promise<void> {
    if (hydrated) return;
    if (hydrating) return hydrating;
    hydrating = (async () => {
      const res = await fetch("/api/chats");
      let chats = res.ok ? ((await res.json()) as Chat[]) : [];

      // First run with an empty DB: pull any chats left in localStorage.
      if (chats.length === 0) {
        const imported = await importLegacyChats();
        if (imported.length > 0) {
          const fresh = await fetch("/api/chats");
          if (fresh.ok) chats = (await fresh.json()) as Chat[];
        }
      }

      write(chats);
      hydrated = true;
    })().catch(logError("hydrate"));
    return hydrating;
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
    fetch("/api/chats", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(chat),
    }).catch(logError("create"));
    return chat;
  },

  save(id: string, patch: Partial<Pick<Chat, "messages" | "model" | "title">>) {
    const chats = read();
    const idx = chats.findIndex((c) => c.id === id);
    if (idx === -1) return;

    const current = chats[idx];
    const next: Chat = { ...current, ...patch, updatedAt: Date.now() };
    next.title = deriveTitle(next.title, patch.messages);

    write([next, ...chats.filter((c) => c.id !== id)]);

    fetch(`/api/chats/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(patch),
    }).catch(logError("save"));
  },

  rename(id: string, title: string) {
    const clean = title.trim() || "Untitled";
    write(
      read().map((c) =>
        c.id === id ? { ...c, title: clean, updatedAt: Date.now() } : c,
      ),
    );
    fetch(`/api/chats/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: clean }),
    }).catch(logError("rename"));
  },

  remove(id: string) {
    write(read().filter((c) => c.id !== id));
    fetch(`/api/chats/${id}`, { method: "DELETE" }).catch(logError("remove"));
  },
};
