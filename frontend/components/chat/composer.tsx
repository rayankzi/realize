"use client";

import { ArrowUp, Brain, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { type ReasoningEffort } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ModelPicker } from "./model-picker";

const effortStyles: Record<ReasoningEffort, string> = {
  low: "text-muted-foreground",
  medium: "text-primary",
  high: "text-reasoning-accent",
};

export function Composer({
  value,
  onChange,
  onSubmit,
  onStop,
  streaming,
  model,
  onModelChange,
  reasoningEffort,
  onCycleEffort,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onStop: () => void;
  streaming: boolean;
  model: string | null;
  onModelChange: (m: string) => void;
  reasoningEffort: ReasoningEffort;
  onCycleEffort: () => void;
}) {
  const canSend = value.trim().length > 0 && !!model && !streaming;

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) onSubmit();
    }
  }

  return (
    <div className="pointer-events-none sticky bottom-0 z-10 px-4 pb-4">
      <div className="pointer-events-auto mx-auto w-full max-w-3xl">
        <div className="rounded-2xl border bg-card/85 p-2 shadow-lg backdrop-blur-xl transition-colors focus-within:border-ring">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Message your local model…"
            className="max-h-[200px] min-h-[2.5rem] resize-none border-0 bg-transparent px-2.5 py-2 text-[0.95rem] leading-relaxed shadow-none focus-visible:ring-0 dark:bg-transparent"
          />

          <div className="mt-1 flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={onCycleEffort}
              title={`Reasoning effort: ${reasoningEffort} — click to change`}
              className="text-muted-foreground"
            >
              <Brain data-icon="inline-start" />
              <span>reasoning</span>
              <span className={cn("font-medium capitalize", effortStyles[reasoningEffort])}>
                {reasoningEffort}
              </span>
            </Button>

            <Separator orientation="vertical" className="!h-4" />

            <ModelPicker value={model} onChange={onModelChange} />

            <div className="ml-auto">
              {streaming ? (
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={onStop}
                  aria-label="Stop generating"
                >
                  <Square className="fill-current" />
                </Button>
              ) : (
                <Button
                  size="icon"
                  onClick={onSubmit}
                  disabled={!canSend}
                  aria-label="Send message"
                >
                  <ArrowUp />
                </Button>
              )}
            </div>
          </div>
        </div>
        <p className="mt-2 text-center text-[0.68rem] text-muted-foreground">
          Local inference via LM Studio · Enter to send · Shift+Enter for newline
        </p>
      </div>
    </div>
  );
}
