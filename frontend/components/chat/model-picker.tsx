"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Cpu, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export function ModelPicker({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (model: string) => void;
}) {
  const [models, setModels] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/models");
      const data = (await res.json()) as { models: string[]; error?: string };
      setModels(data.models);
      if (data.error) setError(data.error);
      // adopt the first model if none selected yet
      if (!value && data.models.length > 0) onChange(data.models[0]);
    } catch {
      setError("Failed to load models");
    } finally {
      setLoading(false);
    }
  }

  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    void load();
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const label = value ?? (loading ? "Loading…" : "No model");

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex max-w-[14rem] items-center gap-1.5 rounded-[var(--radius-md)] px-2.5 py-1.5 text-xs text-text-muted transition-colors duration-[var(--dur-fast)] hover:bg-surface-3 hover:text-text"
      >
        <Cpu size={13} className="shrink-0 text-accent" />
        <span className="truncate">{label}</span>
        <ChevronDown size={13} className="shrink-0" />
      </button>

      {open && (
        <div className="absolute bottom-full left-0 z-20 mb-2 max-h-72 w-64 overflow-y-auto rounded-[var(--radius-md)] border border-border bg-surface-2 p-1 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between px-2 py-1.5">
            <span className="text-[0.7rem] font-medium uppercase tracking-wide text-text-faint">
              Models
            </span>
            <button
              type="button"
              onClick={load}
              className="text-text-faint transition-colors hover:text-text"
              aria-label="Refresh models"
            >
              <RefreshCw size={12} className={cn(loading && "animate-spin")} />
            </button>
          </div>

          {error && (
            <p className="px-2 py-1.5 text-[0.72rem] leading-snug text-[var(--color-danger)]">
              {error}
            </p>
          )}

          {models.length === 0 && !error && !loading && (
            <p className="px-2 py-1.5 text-[0.72rem] text-text-faint">
              No models loaded in LM Studio.
            </p>
          )}

          {models.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                onChange(m);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1.5 text-left text-xs text-text-muted transition-colors hover:bg-surface-3 hover:text-text"
            >
              <span className="w-3.5 shrink-0">
                {value === m && <Check size={13} className="text-accent" />}
              </span>
              <span className="truncate">{m}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
