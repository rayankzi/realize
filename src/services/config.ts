import { readFile } from "node:fs/promises";

import { BACKEND_ENV_PATH } from "../lib/constants";
import type { EnvConfig } from "../types";

function parseEnvFile(contents: string): Record<string, string> {
  const env: Record<string, string> = {};

  for (const line of contents.split(/\r?\n/u)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

export async function loadEnv(): Promise<EnvConfig> {
  const fileEnv = parseEnvFile(await readFile(BACKEND_ENV_PATH, "utf8"));
  const merged = { ...fileEnv, ...process.env };

  const notionIntegrationToken = merged.NOTION_INTEGRATION_TOKEN;
  const notionDatabaseId = merged.NOTION_DATABASE_ID;
  const userAgent = merged.USER_AGENT;
  const xIgAppId = merged.X_IG_APP_ID;
  const lmStudioModelKey = merged.LMSTUDIO_MODEL_KEY ?? "qwen/qwen3.5-9b";

  if (!notionIntegrationToken) {
    throw new Error(
      "NOTION_INTEGRATION_TOKEN not found in backend/.env or process.env.",
    );
  }
  if (!notionDatabaseId) {
    throw new Error(
      "NOTION_DATABASE_ID not found in backend/.env or process.env.",
    );
  }
  if (!userAgent) {
    throw new Error("USER_AGENT not found in backend/.env or process.env.");
  }
  if (!xIgAppId) {
    throw new Error("X_IG_APP_ID not found in backend/.env or process.env.");
  }

  return {
    notionIntegrationToken,
    notionDatabaseId,
    userAgent,
    xIgAppId,
    lmStudioModelKey,
  };
}
