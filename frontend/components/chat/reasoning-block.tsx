"use client";

import { useEffect, useRef, useState } from "react";
import { Brain, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function ReasoningBlock({
  text,
  streaming,
}: {
  text: string;
  streaming: boolean;
}) {
  const [open, setOpen] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number | null>(null);
  const doneRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // tick the duration while streaming; freeze + auto-collapse once done
  useEffect(() => {
    if (streaming) {
      if (startRef.current === null) startRef.current = Date.now();
      doneRef.current = false;
      const id = setInterval(() => {
        if (startRef.current !== null) {
          setElapsed((Date.now() - startRef.current) / 1000);
        }
      }, 100);
      return () => clearInterval(id);
    }
    if (!doneRef.current && startRef.current !== null) {
      doneRef.current = true;
      setElapsed((Date.now() - startRef.current) / 1000);
      setOpen(false);
    }
  }, [streaming]);

  // keep the latest reasoning in view while streaming + expanded
  useEffect(() => {
    if (streaming && open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [text, streaming, open]);

  const seconds = elapsed < 1 ? elapsed.toFixed(1) : Math.round(elapsed).toString();

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="mb-3 overflow-hidden rounded-lg border border-reasoning-border/60 bg-reasoning-bg"
    >
      <CollapsibleTrigger className="flex w-full items-center gap-2 px-3 py-2 text-left text-[0.8rem] font-medium text-reasoning-fg transition-colors hover:bg-foreground/[0.03]">
        <Brain className="size-3.5 shrink-0 text-reasoning-accent" />
        {streaming ? (
          <span className="hm-thinking">Thinking…</span>
        ) : (
          <span>Thought for {seconds}s</span>
        )}
        <ChevronDown
          className={cn(
            "ml-auto size-4 shrink-0 text-reasoning-accent transition-transform",
            open && "rotate-180",
          )}
        />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div
          ref={scrollRef}
          className="max-h-72 overflow-y-auto border-t border-reasoning-border/40 px-3 py-2.5"
        >
          <pre className="font-mono text-[0.78rem] leading-relaxed whitespace-pre-wrap break-words text-reasoning-fg/90">
            {text}
            {streaming && <span className="hm-caret" />}
          </pre>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
