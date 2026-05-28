"use client";

import { useEffect, useRef } from "react";
import { ArrowUp, Plus, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { type ReasoningEffort } from "@/lib/config";
import { ModelPicker } from "./model-picker";

const MAX_HEIGHT = 200;

const effortStyles: Record<ReasoningEffort, string> = {
  low: "text-text-muted",
  medium: "text-accent",
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
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, MAX_HEIGHT) + "px";
    el.style.overflowY = el.scrollHeight > MAX_HEIGHT ? "auto" : "hidden";
  }, [value]);

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
        <div className="rounded-[var(--radius-xl)] border border-border bg-surface-1/85 p-2 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-colors duration-[var(--dur-mid)] focus-within:border-accent/60">
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Message your local model…"
            className="block max-h-[200px] w-full resize-none bg-transparent px-2.5 py-2 text-[0.95rem] leading-relaxed text-text placeholder:text-text-faint focus:outline-none"
          />

          <div className="mt-1 flex items-center gap-1.5">
            <button
              type="button"
              onClick={onCycleEffort}
              title={`Reasoning effort: ${reasoningEffort} — click to change`}
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] py-1.5 pl-1.5 pr-2.5 text-xs text-text-muted transition-colors duration-[var(--dur-fast)] hover:bg-surface-3 hover:text-text"
            >
              <Plus size={15} className="shrink-0" />
              <span className="text-text-faint">reasoning</span>
              <span className={cn("font-medium capitalize", effortStyles[reasoningEffort])}>
                {reasoningEffort}
              </span>
            </button>

            <span className="mx-0.5 h-4 w-px bg-border-soft" />

            <ModelPicker value={model} onChange={onModelChange} />

            <div className="ml-auto">
              {streaming ? (
                <button
                  type="button"
                  onClick={onStop}
                  aria-label="Stop generating"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface-3 text-text transition-colors duration-[var(--dur-fast)] hover:bg-border active:translate-y-px"
                >
                  <Square size={15} className="fill-current" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onSubmit}
                  disabled={!canSend}
                  aria-label="Send message"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-contrast shadow-[0_2px_14px_-2px_oklch(0.74_0.12_240_/_0.55)] transition-[background-color,opacity,transform] duration-[var(--dur-fast)] hover:bg-accent-strong active:translate-y-px disabled:bg-surface-3 disabled:text-text-faint disabled:shadow-none"
                >
                  <ArrowUp size={17} strokeWidth={2.4} />
                </button>
              )}
            </div>
          </div>
        </div>
        <p className="mt-2 text-center text-[0.68rem] text-text-faint">
          Local inference via LM Studio · Enter to send · Shift+Enter for newline
        </p>
      </div>
    </div>
  );
}
