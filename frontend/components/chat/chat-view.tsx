"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MessageSquareText, RefreshCcw, TriangleAlert } from "lucide-react";
import { chatStore, type Chat } from "@/lib/chat-store";
import type { ReasoningEffort } from "@/lib/config";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Composer } from "./composer";
import { Message } from "./message";

export function ChatView({
  chat,
  model,
  onModelChange,
  reasoningEffort,
  onReasoningEffortChange,
}: {
  chat: Chat;
  model: string | null;
  onModelChange: (m: string) => void;
  reasoningEffort: ReasoningEffort;
  onReasoningEffortChange: (effort: ReasoningEffort) => void;
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
    <div className="relative flex h-full min-h-0 flex-1 flex-col">
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="mx-auto flex min-h-full max-w-3xl flex-col items-center justify-center px-4 pb-36 text-center">
            <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl border bg-muted">
              <MessageSquareText className="size-5 text-primary" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">
              What should we work through?
            </h1>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              {model
                ? `Chatting with ${model} on your machine.`
                : "Pick a model below to start. Make sure LM Studio’s server is running."}
            </p>
          </div>
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 pt-8 pb-48">
            {messages.map((m) => (
              <Message key={m.id} message={m} />
            ))}

            {status === "error" && (
              <Alert variant="destructive">
                <TriangleAlert />
                <AlertTitle>Generation failed</AlertTitle>
                <AlertDescription className="flex flex-col items-start gap-2">
                  {error?.message ?? "Something went wrong while generating."}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => regenerate({ body: { model, reasoningEffort } })}
                  >
                    <RefreshCcw data-icon="inline-start" /> Retry
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {canRegenerate && (
              <div className="flex justify-start">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={() => regenerate({ body: { model, reasoningEffort } })}
                >
                  <RefreshCcw data-icon="inline-start" /> Regenerate
                </Button>
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
        onReasoningEffortChange={onReasoningEffortChange}
      />
    </div>
  );
}
