import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import {
  DEFAULT_REASONING_EFFORT,
  LMSTUDIO_BASE_URL,
  PROVIDER_NAME,
  REASONING_EFFORTS,
  type ReasoningEffort,
} from "@/lib/config";

export const maxDuration = 600;

const lmstudio = createOpenAICompatible({
  name: PROVIDER_NAME,
  baseURL: LMSTUDIO_BASE_URL,
  // LM Studio ignores the key, but the SDK requires the header to be well-formed.
  apiKey: "lm-studio",
});

type ChatRequest = {
  messages: UIMessage[];
  model?: string;
  reasoningEffort?: ReasoningEffort;
};

export async function POST(request: Request) {
  let body: ChatRequest;
  try {
    body = (await request.json()) as ChatRequest;
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const { messages, model } = body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("`messages` is required", { status: 400 });
  }
  if (!model) {
    return new Response("`model` is required", { status: 400 });
  }

  const reasoningEffort: ReasoningEffort = REASONING_EFFORTS.includes(
    body.reasoningEffort as ReasoningEffort,
  )
    ? (body.reasoningEffort as ReasoningEffort)
    : DEFAULT_REASONING_EFFORT;

  const result = streamText({
    model: lmstudio(model),
    messages: await convertToModelMessages(messages),
    abortSignal: request.signal,
    providerOptions: {
      [PROVIDER_NAME]: { reasoningEffort },
    },
  });

  return result.toUIMessageStreamResponse({
    sendReasoning: true,
    onError: (error) => {
      console.error("[/api/chat] stream error:", error);
      return error instanceof Error ? error.message : "Stream failed.";
    },
  });
}
