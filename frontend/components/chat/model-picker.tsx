"use client";

import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, Cpu, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

  const label = value ?? (loading ? "Loading…" : "No model");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          role="combobox"
          aria-expanded={open}
          className="max-w-[14rem] text-muted-foreground"
        >
          <Cpu data-icon="inline-start" className="text-primary" />
          <span className="truncate">{label}</span>
          <ChevronsUpDown data-icon="inline-end" className="opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" side="top" className="w-64 p-0">
        <Command>
          <div className="flex items-center gap-1 border-b pr-1">
            <CommandInput placeholder="Search models…" className="border-0" />
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => load()}
              aria-label="Refresh models"
            >
              <RefreshCw className={cn(loading && "animate-spin")} />
            </Button>
          </div>
          <CommandList>
            {error ? (
              <p className="px-3 py-2 text-xs leading-snug text-destructive">
                {error}
              </p>
            ) : (
              <CommandEmpty>No models loaded in LM Studio.</CommandEmpty>
            )}
            <CommandGroup>
              {models.map((m) => (
                <CommandItem
                  key={m}
                  value={m}
                  onSelect={() => {
                    onChange(m);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "text-primary",
                      value === m ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="truncate">{m}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
