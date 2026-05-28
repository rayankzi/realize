"use client";

import { useSyncExternalStore } from "react";
import { chatStore, type Chat } from "@/lib/chat-store";

export function useChats(): Chat[] {
  return useSyncExternalStore(
    chatStore.subscribe,
    chatStore.getSnapshot,
    chatStore.getServerSnapshot,
  );
}
