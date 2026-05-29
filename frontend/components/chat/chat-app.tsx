"use client";

import { useEffect, useState } from "react";
import { chatStore } from "@/lib/chat-store";
import { useChats } from "@/hooks/use-chats";
import { DEFAULT_REASONING_EFFORT, type ReasoningEffort } from "@/lib/config";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ChatSidebar } from "./sidebar";
import { ChatView } from "./chat-view";

export function ChatApp() {
  const chats = useChats();
  const [activeId, setActiveId] = useState<string | null>(null);
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
    setReady(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  function handleNew() {
    setActiveId(chatStore.create(model).id);
  }

  function handleDelete(id: string) {
    chatStore.remove(id);
    if (id === activeId) {
      const rest = chatStore.getSnapshot();
      setActiveId(rest.length > 0 ? rest[0].id : chatStore.create(model).id);
    }
  }

  const activeChat = chats.find((c) => c.id === activeId) ?? null;

  return (
    <SidebarProvider className="h-dvh min-h-0 overflow-hidden">
      <ChatSidebar
        chats={chats}
        activeId={activeId}
        onSelect={setActiveId}
        onNew={handleNew}
        onRename={chatStore.rename}
        onDelete={handleDelete}
      />

      <SidebarInset className="h-dvh min-h-0 min-w-0 overflow-hidden">
        <header className="flex h-12 shrink-0 items-center gap-2 px-3">
          <SidebarTrigger />
          <span className="text-sm font-medium text-muted-foreground">
            {activeChat?.title ?? "Realize"}
          </span>
        </header>

        {ready && activeChat ? (
          <ChatView
            key={activeChat.id}
            chat={activeChat}
            model={model}
            onModelChange={setModel}
            reasoningEffort={reasoningEffort}
            onReasoningEffortChange={setReasoningEffort}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
            Loading…
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
