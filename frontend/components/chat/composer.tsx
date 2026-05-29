"use client";

import { useEffect, useRef } from "react";
import { ArrowUp, Plus, Square } from "lucide-react";
import { type ReasoningEffort } from "@/lib/config";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ModelPicker } from "./model-picker";

const COMPOSER_MAX_HEIGHT_RATIO = 0.4;
const COMPOSER_FALLBACK_MAX_HEIGHT = 320;

export function Composer({
  value,
  onChange,
  onSubmit,
  onStop,
  streaming,
  model,
  onModelChange,
  reasoningEffort,
  onReasoningEffortChange,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onStop: () => void;
  streaming: boolean;
  model: string | null;
  onModelChange: (m: string) => void;
  reasoningEffort: ReasoningEffort;
  onReasoningEffortChange: (effort: ReasoningEffort) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canSend = value.trim().length > 0 && !!model && !streaming;

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const viewportMaxHeight =
      typeof window === "undefined"
        ? COMPOSER_FALLBACK_MAX_HEIGHT
        : Math.floor(window.innerHeight * COMPOSER_MAX_HEIGHT_RATIO);

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, viewportMaxHeight)}px`;
    textarea.style.overflowY =
      textarea.scrollHeight > viewportMaxHeight ? "auto" : "hidden";
  }, [value]);

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
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Message your local model…"
            className="max-h-[40dvh] min-h-[2.5rem] resize-none border-0 bg-transparent px-2.5 py-2 text-[0.95rem] leading-relaxed shadow-none [field-sizing:fixed] focus-visible:ring-0 dark:bg-transparent"
          />

          <div className="mt-1 flex items-center gap-1.5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Open composer options"
                  title="Open composer options"
                  className="text-muted-foreground"
                >
                  <Plus />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="top" className="w-48">
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>reasoning</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      value={reasoningEffort}
                      onValueChange={(effort) =>
                        onReasoningEffortChange(effort as ReasoningEffort)
                      }
                    >
                      <DropdownMenuRadioItem value="low">low</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="medium">medium</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="high">high</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>

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
