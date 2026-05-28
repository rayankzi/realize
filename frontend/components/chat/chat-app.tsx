"use client";

import { useEffect, useState } from "react";
import { PanelLeftOpen } from "lucide-react";
import { chatStore } from "@/lib/chat-store";
import { useChats } from "@/hooks/use-chats";
import {
  DEFAULT_REASONING_EFFORT,
  REASONING_EFFORTS,
  type ReasoningEffort,
} from "@/lib/config";
import { Sidebar } from "./sidebar";
import { ChatView } from "./chat-view";

export function ChatApp() {
  const chats = useChats();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isMobile = () =>
    typeof window !== "undefined" &&
    !window.matchMedia("(min-width: 768px)").matches;

  function selectChat(id: string) {
    setActiveId(id);
    if (isMobile()) setSidebarOpen(false);
  }
  const [model, setModel] = useState<string | null>(null);
  const [reasoningEffort, setReasoningEffort] = useState<ReasoningEffort>(
    DEFAULT_REASONING_EFFORT,
  );
  const [ready, setReady] = useState(false);

  // pick or create an active chat on mount (client-only, post-hydration).
  // This is a deliberate external-store -> state sync, not derivable at render
  // because localStorage is unavailable during SSR.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const existing = chatStore.getSnapshot();
    if (existing.length > 0) {
      setActiveId(existing[0].id);
      if (existing[0].model) setModel(existing[0].model);
    } else {
      setActiveId(chatStore.create(null).id);
    }
    setSidebarOpen(window.matchMedia("(min-width: 768px)").matches);
    setReady(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  function handleNew() {
    setActiveId(chatStore.create(model).id);
    if (isMobile()) setSidebarOpen(false);
  }

  function handleDelete(id: string) {
    chatStore.remove(id);
    if (id === activeId) {
      const rest = chatStore.getSnapshot();
      setActiveId(rest.length > 0 ? rest[0].id : chatStore.create(model).id);
    }
  }

  function cycleEffort() {
    setReasoningEffort((cur) => {
      const i = REASONING_EFFORTS.indexOf(cur);
      return REASONING_EFFORTS[(i + 1) % REASONING_EFFORTS.length];
    });
  }

  const activeChat = chats.find((c) => c.id === activeId) ?? null;

  return (
    <div className="flex h-dvh w-full overflow-hidden">
      <Sidebar
        chats={chats}
        activeId={activeId}
        open={sidebarOpen}
        onSelect={selectChat}
        onNew={handleNew}
        onRename={chatStore.rename}
        onDelete={handleDelete}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        {!sidebarOpen && (
          <div className="absolute left-3 top-3 z-20">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              className="rounded-[var(--radius-md)] border border-border bg-surface-1/80 p-2 text-text-muted backdrop-blur transition-colors hover:bg-surface-3 hover:text-text"
            >
              <PanelLeftOpen size={17} />
            </button>
          </div>
        )}

        {ready && activeChat ? (
          <ChatView
            key={activeChat.id}
            chat={activeChat}
            model={model}
            onModelChange={setModel}
            reasoningEffort={reasoningEffort}
            onCycleEffort={cycleEffort}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-text-faint">
            Loading…
          </div>
        )}
      </main>
    </div>
  );
}
