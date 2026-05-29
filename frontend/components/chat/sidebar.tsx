"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  MessageSquarePlus,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
  X,
} from "lucide-react";
import type { Chat } from "@/lib/chat-store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/ui/mode-toggle";

export function ChatSidebar({
  chats,
  activeId,
  onSelect,
  onNew,
  onRename,
  onDelete,
}: {
  chats: Chat[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}) {
  const { isMobile, setOpenMobile } = useSidebar();
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

  function closeOnMobile() {
    if (isMobile) setOpenMobile(false);
  }

  function startEdit(c: Chat) {
    setEditingId(c.id);
    setDraft(c.title);
  }
  function commitEdit() {
    if (editingId) onRename(editingId, draft);
    setEditingId(null);
  }

  return (
    <Sidebar>
      <SidebarHeader className="gap-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-sm font-semibold tracking-tight">Realize</span>
          <ModeToggle />
        </div>

        <Button
          onClick={() => {
            onNew();
            closeOnMobile();
          }}
          className="w-full justify-start"
          variant="secondary"
        >
          <MessageSquarePlus data-icon="inline-start" />
          New chat
        </Button>

        <InputGroup>
          <InputGroupInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chats"
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            {filtered.length === 0 ? (
              <p className="px-2 py-6 text-center text-xs text-muted-foreground">
                {chats.length === 0 ? "No chats yet." : "No matches."}
              </p>
            ) : (
              <SidebarMenu>
                {filtered.map((c) => {
                  const isEditing = c.id === editingId;
                  return (
                    <SidebarMenuItem key={c.id}>
                      {isEditing ? (
                        <div className="flex items-center gap-1 p-1">
                          <Input
                            ref={editRef}
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") commitEdit();
                              if (e.key === "Escape") setEditingId(null);
                            }}
                            className="h-7"
                          />
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={commitEdit}
                            aria-label="Save name"
                          >
                            <Check />
                          </Button>
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => setEditingId(null)}
                            aria-label="Cancel"
                          >
                            <X />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <SidebarMenuButton
                            isActive={c.id === activeId}
                            onClick={() => {
                              onSelect(c.id);
                              closeOnMobile();
                            }}
                          >
                            <span className="truncate">{c.title}</span>
                          </SidebarMenuButton>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <SidebarMenuAction showOnHover aria-label="Chat options">
                                <MoreHorizontal />
                              </SidebarMenuAction>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="right" align="start">
                              <DropdownMenuGroup>
                                <DropdownMenuItem onSelect={() => startEdit(c)}>
                                  <Pencil />
                                  Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  variant="destructive"
                                  onSelect={() => onDelete(c.id)}
                                >
                                  <Trash2 />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
