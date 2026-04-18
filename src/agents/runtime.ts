import { Chat, LMStudioClient } from "@lmstudio/sdk";

import type { AgentRunResult, LmStudioModel } from "../types";
import { createAgentTools } from "../tools/agent-tools";

async function prepareImages(
  client: LMStudioClient,
  imagePaths: string[],
): Promise<Awaited<ReturnType<LMStudioClient["files"]["prepareImage"]>>[]> {
  const handles = [];
  for (const imagePath of imagePaths) {
    handles.push(await client.files.prepareImage(imagePath));
  }
  return handles;
}

function getLastAssistantMessageText(chat: Chat): string {
  const messages = chat.getMessagesArray();

  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message?.getRole() === "assistant") {
      const text = message.getText().trim();
      if (text) {
        return text;
      }
    }
  }

  return "";
}

export async function runAgentTask(
  model: LmStudioModel,
  systemPrompt: string,
  userPrompt: string,
  tools: ReturnType<typeof createAgentTools>,
  imagePaths: string[],
  client: LMStudioClient,
): Promise<AgentRunResult> {
  const chat = Chat.empty();
  chat.append("system", systemPrompt);

  const imageHandles = await prepareImages(client, imagePaths);
  chat.append(
    "user",
    userPrompt,
    imageHandles.length > 0 ? { images: imageHandles } : undefined,
  );

  await model.act(chat, [tools.Glob, tools.Read, tools.Write, tools.Bash], {
    onMessage: (message) => {
      chat.append(message);
    },
  });

  return {
    finalText: getLastAssistantMessageText(chat),
  };
}
