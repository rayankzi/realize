import { appendFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { DATA_DIR, LOGS_PATH, NOTION_PAGES_PATH } from "../lib/constants";
import { ensureDir } from "../lib/files";
import type { LogEntry } from "../types";

export async function createWorkspace(): Promise<string> {
  await ensureDir(DATA_DIR);
  const workspacePath = path.join(DATA_DIR, crypto.randomUUID());
  await ensureDir(workspacePath);
  return workspacePath;
}

export async function writeCaptionFile(
  workspacePath: string,
  caption: string | null,
): Promise<string> {
  const captionPath = path.join(workspacePath, "captions.txt");
  await writeFile(captionPath, (caption ?? "").trim(), "utf8");
  return captionPath;
}

export async function appendLog(entry: LogEntry): Promise<void> {
  await appendFile(LOGS_PATH, `${JSON.stringify(entry)}\n`, "utf8");
}

export async function cleanupArtifacts(): Promise<void> {
  await rm(DATA_DIR, { recursive: true, force: true });
  await rm(NOTION_PAGES_PATH, { force: true });
}
