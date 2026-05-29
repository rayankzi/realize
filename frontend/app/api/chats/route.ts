import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import type { Chat } from "@/lib/chat-utils";

// Chats are user-specific runtime data; never cache this route.
export const dynamic = "force-dynamic";

function toChat(row: typeof chats.$inferSelect): Chat {
  return {
    id: row.id,
    title: row.title,
    messages: row.messages ?? [],
    model: row.model ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

/** GET /api/chats — all chats, newest first. */
export async function GET() {
  const rows = await db.select().from(chats).orderBy(desc(chats.updatedAt));
  return Response.json(rows.map(toChat));
}

/** POST /api/chats — create or replace a full chat (used by create + import). */
export async function POST(request: Request) {
  let body: Partial<Chat>;
  try {
    body = (await request.json()) as Partial<Chat>;
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  if (!body.id || typeof body.id !== "string") {
    return new Response("`id` is required", { status: 400 });
  }

  const now = Date.now();
  const row = {
    id: body.id,
    title: body.title ?? "New chat",
    model: body.model ?? null,
    messages: body.messages ?? [],
    createdAt: body.createdAt ?? now,
    updatedAt: body.updatedAt ?? now,
  };

  await db
    .insert(chats)
    .values(row)
    .onConflictDoUpdate({
      target: chats.id,
      set: {
        title: row.title,
        model: row.model,
        messages: row.messages,
        updatedAt: row.updatedAt,
      },
    });

  return Response.json(toChat(row), { status: 201 });
}
