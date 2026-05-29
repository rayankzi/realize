"use client";

import { memo, useState } from "react";
import type { UIMessage } from "ai";
import { Check, Copy, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Markdown } from "./markdown";
import { ReasoningBlock } from "./reasoning-block";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  if (!text) return null;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => {
            navigator.clipboard?.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
          }}
          className="text-muted-foreground"
          aria-label="Copy response"
        >
          {copied ? <Check /> : <Copy />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{copied ? "Copied" : "Copy"}</TooltipContent>
    </Tooltip>
  );
}

export const Message = memo(function Message({
  message,
  canRegenerate = false,
  onRegenerate,
}: {
  message: UIMessage;
  canRegenerate?: boolean;
  onRegenerate?: () => void;
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
        <div className="max-w-[min(80%,42rem)] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-muted px-4 py-2.5 text-[0.95rem] leading-relaxed text-foreground">
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
      <div
        className={cn(
          "flex h-7 items-center gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100",
          answerText ? "" : "hidden",
        )}
      >
        <CopyButton text={answerText} />
        {canRegenerate && onRegenerate ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                className="text-muted-foreground"
                onClick={onRegenerate}
                aria-label="Regenerate response"
              >
                <RefreshCcw />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Regenerate</TooltipContent>
          </Tooltip>
        ) : null}
      </div>
    </div>
  );
});
