"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { RefreshCcw, Sparkles } from "lucide-react";
import { chatStore, type Chat } from "@/lib/chat-store";
import type { ReasoningEffort } from "@/lib/config";
import { Composer } from "./composer";
import { Message } from "./message";

export function ChatView({
  chat,
  model,
  onModelChange,
  reasoningEffort,
  onCycleEffort,
}: {
  chat: Chat;
  model: string | null;
  onModelChange: (m: string) => void;
  reasoningEffort: ReasoningEffort;
  onCycleEffort: () => void;
}) {
  const [input, setInput] = useState("");
  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat" }),
    [],
  );

  const { messages, sendMessage, regenerate, stop, status, error } = useChat({
    id: chat.id,
    messages: chat.messages,
    transport,
  });

  const streaming = status === "streaming" || status === "submitted";
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // persist once a turn settles (avoid per-token localStorage churn)
  useEffect(() => {
    if (streaming) return;
    chatStore.save(chat.id, { messages, model });
  }, [messages, streaming, model, chat.id]);

  // follow the stream
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, streaming]);

  function submit() {
    const text = input.trim();
    if (!text || !model || streaming) return;
    setInput("");
    sendMessage({ text }, { body: { model, reasoningEffort } });
  }

  const isEmpty = messages.length === 0;
  const canRegenerate =
    !streaming &&
    status !== "error" &&
    messages.length > 0 &&
    messages[messages.length - 1].role === "assistant";

  return (
    <div className="relative flex h-full min-w-0 flex-1 flex-col">
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-4 text-center">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] border border-border bg-surface-2">
              <Sparkles size={22} className="text-accent" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-text">
              What should we work through?
            </h1>
            <p className="mt-2 max-w-sm text-sm text-text-muted">
              {model
                ? `Chatting with ${model} on your machine.`
                : "Pick a model below to start. Make sure LM Studio's server is running."}
            </p>
          </div>
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">
            {messages.map((m) => (
              <Message key={m.id} message={m} />
            ))}

            {status === "error" && (
              <div className="rounded-[var(--radius-md)] border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 px-4 py-3 text-sm text-text">
                {error?.message ?? "Something went wrong while generating."}
                <button
                  type="button"
                  onClick={() => regenerate({ body: { model, reasoningEffort } })}
                  className="ml-3 inline-flex items-center gap-1.5 text-accent hover:underline"
                >
                  <RefreshCcw size={13} /> Retry
                </button>
              </div>
            )}

            {canRegenerate && (
              <div className="flex justify-start">
                <button
                  type="button"
                  onClick={() => regenerate({ body: { model, reasoningEffort } })}
                  className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] px-2 py-1 text-xs text-text-faint transition-colors hover:bg-surface-2 hover:text-text-muted"
                >
                  <RefreshCcw size={12} /> Regenerate
                </button>
              </div>
            )}

            <div ref={bottomRef} className="h-px" />
          </div>
        )}
      </div>

      <Composer
        value={input}
        onChange={setInput}
        onSubmit={submit}
        onStop={stop}
        streaming={streaming}
        model={model}
        onModelChange={onModelChange}
        reasoningEffort={reasoningEffort}
        onCycleEffort={onCycleEffort}
      />
    </div>
  );
}
