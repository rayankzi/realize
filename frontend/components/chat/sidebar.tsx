"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  MessageSquarePlus,
  PanelLeftClose,
  Pencil,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Chat } from "@/lib/chat-store";

export function Sidebar({
  chats,
  activeId,
  open,
  onSelect,
  onNew,
  onRename,
  onDelete,
  onClose,
}: {
  chats: Chat[];
  activeId: string | null;
  open: boolean;
  onSelect: (id: string) => void;
  onNew: () => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const editRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId) editRef.current?.focus();
  }, [editingId]);

  const filtered = chats.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()),
  );

  function startEdit(c: Chat) {
    setEditingId(c.id);
    setDraft(c.title);
  }
  function commitEdit() {
    if (editingId) onRename(editingId, draft);
    setEditingId(null);
  }

  return (
    <>
      {/* mobile backdrop */}
      {open && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex h-full shrink-0 flex-col overflow-hidden border-r border-border-soft bg-surface-1 transition-transform duration-[var(--dur-mid)] ease-[var(--ease-out)]",
          "md:static md:z-auto md:bg-surface-1/60 md:transition-[width]",
          open
            ? "w-72 translate-x-0 md:w-72"
            : "w-72 -translate-x-full md:w-0 md:translate-x-0 md:border-r-0",
        )}
      >
        <div className="flex h-full w-72 flex-col">
        <div className="flex items-center justify-between px-3 pb-2 pt-3">
          <span className="px-1 text-sm font-semibold tracking-tight text-text">
            Realize
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Collapse sidebar"
            className="rounded-[var(--radius-sm)] p-1.5 text-text-faint transition-colors hover:bg-surface-3 hover:text-text"
          >
            <PanelLeftClose size={17} />
          </button>
        </div>

        <div className="px-3">
          <button
            type="button"
            onClick={onNew}
            className="flex w-full items-center gap-2 rounded-[var(--radius-md)] border border-border bg-surface-2 px-3 py-2 text-sm font-medium text-text transition-colors duration-[var(--dur-fast)] hover:border-accent/50 hover:bg-surface-3 active:translate-y-px"
          >
            <MessageSquarePlus size={16} className="text-accent" />
            New chat
          </button>
        </div>

        <div className="px-3 pb-2 pt-3">
          <div className="flex items-center gap-2 rounded-[var(--radius-md)] bg-surface-2 px-2.5 py-1.5">
            <Search size={14} className="shrink-0 text-text-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search chats"
              className="w-full bg-transparent text-xs text-text placeholder:text-text-faint focus:outline-none"
            />
          </div>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
          {filtered.length === 0 && (
            <p className="px-3 py-6 text-center text-xs text-text-faint">
              {chats.length === 0 ? "No chats yet." : "No matches."}
            </p>
          )}

          {filtered.map((c) => {
            const isActive = c.id === activeId;
            const isEditing = c.id === editingId;
            return (
              <div
                key={c.id}
                className={cn(
                  "group relative mb-0.5 flex items-center rounded-[var(--radius-md)] transition-colors duration-[var(--dur-fast)]",
                  isActive ? "bg-surface-3" : "hover:bg-surface-2",
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-accent" />
                )}

                {isEditing ? (
                  <div className="flex w-full items-center gap-1 px-2 py-1">
                    <input
                      ref={editRef}
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitEdit();
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      className="w-full rounded-[var(--radius-sm)] bg-bg px-2 py-1 text-sm text-text focus:outline-none focus-visible:outline-2 focus-visible:outline-accent"
                    />
                    <button
                      type="button"
                      onClick={commitEdit}
                      aria-label="Save name"
                      className="p-1 text-text-faint hover:text-accent"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      aria-label="Cancel"
                      className="p-1 text-text-faint hover:text-text"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => onSelect(c.id)}
                      className="min-w-0 flex-1 truncate py-2 pl-3 pr-1 text-left text-sm text-text-muted group-hover:text-text"
                    >
                      <span className={cn("truncate", isActive && "text-text")}>
                        {c.title}
                      </span>
                    </button>
                    <div className="flex items-center pr-1.5 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => startEdit(c)}
                        aria-label="Rename chat"
                        className="rounded p-1 text-text-faint hover:text-text"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(c.id)}
                        aria-label="Delete chat"
                        className="rounded p-1 text-text-faint hover:text-[var(--color-danger)]"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </nav>
        </div>
      </aside>
    </>
  );
}
