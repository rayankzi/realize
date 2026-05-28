"use client";

import { memo, useState } from "react";
import type { UIMessage } from "ai";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Markdown } from "./markdown";
import { ReasoningBlock } from "./reasoning-block";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  if (!text) return null;
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      }}
      className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] px-2 py-1 text-xs text-text-faint opacity-0 transition-[opacity,color] duration-[var(--dur-fast)] hover:text-text-muted focus-visible:opacity-100 group-hover:opacity-100"
      aria-label="Copy message"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export const Message = memo(function Message({
  message,
}: {
  message: UIMessage;
}) {
  const isUser = message.role === "user";

  const answerText = message.parts
    .filter((p) => p.type === "text")
    .map((p) => (p as { text: string }).text)
    .join("");

  if (isUser) {
    const text = answerText;
    return (
      <div className="hm-rise flex justify-end">
        <div className="max-w-[min(80%,42rem)] whitespace-pre-wrap break-words rounded-[var(--radius-lg)] rounded-br-md bg-surface-2 px-4 py-2.5 text-[0.95rem] leading-relaxed text-text">
          {text}
        </div>
      </div>
    );
  }

  return (
    <div className="hm-rise group flex flex-col gap-1">
      <div className="min-w-0">
        {message.parts.map((part, i) => {
          if (part.type === "reasoning") {
            return (
              <ReasoningBlock
                key={i}
                text={part.text}
                streaming={part.state === "streaming"}
              />
            );
          }
          if (part.type === "text") {
            return <Markdown key={i}>{part.text}</Markdown>;
          }
          return null;
        })}
      </div>
      <div className={cn("h-7", answerText ? "" : "hidden")}>
        <CopyButton text={answerText} />
      </div>
    </div>
  );
});
