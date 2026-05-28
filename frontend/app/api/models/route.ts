import { LMSTUDIO_BASE_URL } from "@/lib/config";

export const dynamic = "force-dynamic";

type LMStudioModel = { id: string };

export async function GET() {
  try {
    const res = await fetch(`${LMSTUDIO_BASE_URL}/models`, {
      headers: { Authorization: "Bearer lm-studio" },
      cache: "no-store",
    });

    if (!res.ok) {
      return Response.json(
        { models: [], error: `LM Studio responded ${res.status}` },
        { status: 502 },
      );
    }

    const data = (await res.json()) as { data?: LMStudioModel[] };
    const models = (data.data ?? [])
      .map((m) => m.id)
      .filter((id): id is string => typeof id === "string" && id.length > 0);

    return Response.json({ models });
  } catch {
    return Response.json(
      {
        models: [],
        error: "Could not reach LM Studio at " + LMSTUDIO_BASE_URL,
      },
      { status: 502 },
    );
  }
}
