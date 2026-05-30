import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { deriveTitle, type Chat } from "@/lib/chat-utils";

export const dynamic = "force-dynamic";

type Patch = Partial<Pick<Chat, "messages" | "model" | "title">>;

/** PATCH /api/chats/:id — partial update (messages / model / title). */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let patch: Patch;
  try {
    patch = (await request.json()) as Patch;
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const [existing] = await db.select().from(chats).where(eq(chats.id, id));
  if (!existing) return new Response("Not found", { status: 404 });

  const title =
    patch.title ?? deriveTitle(existing.title, patch.messages);

  await db
    .update(chats)
    .set({
      ...(patch.messages !== undefined ? { messages: patch.messages } : {}),
      ...(patch.model !== undefined ? { model: patch.model } : {}),
      title: patch.title?.trim() || title,
      updatedAt: Date.now(),
    })
    .where(eq(chats.id, id));

  return new Response(null, { status: 204 });
}

/** DELETE /api/chats/:id */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await db.delete(chats).where(eq(chats.id, id));
  return new Response(null, { status: 204 });
}
