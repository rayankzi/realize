import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import { LMStudioClient } from "@lmstudio/sdk";

import { OUTPUT_DIR } from "../lib/constants";
import {
  ensureDir,
  getUniqueOutputPath,
  listFilesMatching,
  listMarkdownFiles,
  pickNewestFile,
} from "../lib/files";
import { extractTitle, slugifyTitle } from "../lib/text";
import type { InstagramMediaData, LmStudioModel, PromptBundle } from "../types";
import { downloadCarouselImages, downloadVideo } from "../services/instagram";
import {
  extractFrames,
  transcribeVideoWithMlxWhisper,
} from "../services/media";
import { createAgentTools } from "../tools/agent-tools";
import { runAgentTask } from "./runtime";

async function ensureOutputFromAgent(
  beforeMarkdownFiles: string[],
  uuid: string,
  fallbackMarkdown: string,
): Promise<{ outputPath: string; title: string | null }> {
  await ensureDir(OUTPUT_DIR);
  const afterMarkdownFiles = await listMarkdownFiles(OUTPUT_DIR);
  const beforeSet = new Set(beforeMarkdownFiles);
  const newFiles = afterMarkdownFiles.filter(
    (filePath) => !beforeSet.has(filePath),
  );

  let chosenPath = await pickNewestFile(newFiles);

  if (!chosenPath) {
    const tempPath = path.join(OUTPUT_DIR, `${uuid}-analysis.md`);
    await writeFile(tempPath, fallbackMarkdown.trim(), "utf8");
    chosenPath = tempPath;
  }

  const markdown = await readFile(chosenPath, "utf8");
  const title = extractTitle(markdown);

  if (path.basename(chosenPath) === `${uuid}-analysis.md`) {
    const targetName = `${slugifyTitle(title ?? uuid)}.md`;
    const targetPath = await getUniqueOutputPath(
      path.join(OUTPUT_DIR, targetName),
    );
    await rename(chosenPath, targetPath);
    return { outputPath: targetPath, title };
  }

  return { outputPath: chosenPath, title };
}

function parseYesNoVerdict(text: string): boolean {
  const yesIndex = text.lastIndexOf("YES");
  const noIndex = text.lastIndexOf("NO");

  if (yesIndex === -1 && noIndex === -1) {
    throw new Error(
      `Could not parse YES/NO verdict from agent response: ${text}`,
    );
  }

  return yesIndex > noIndex;
}

export async function analyzeStaticPost(
  media: InstagramMediaData,
  workspacePath: string,
  model: LmStudioModel,
  prompts: PromptBundle,
  client: LMStudioClient,
): Promise<{ outputPath: string; title: string | null }> {
  const imagePaths = await downloadCarouselImages(
    media.sidecar,
    workspacePath,
    media.display_url,
  );
  const tools = createAgentTools({
    workspaceDir: workspacePath,
    outputDir: OUTPUT_DIR,
    allowWrite: true,
    allowRm: false,
  });
  const beforeFiles = await listMarkdownFiles(OUTPUT_DIR);
  const { finalText } = await runAgentTask(
    model,
    prompts.analyzePost,
    `Analyze the Instagram post workspace at ${workspacePath}. Start by reading ${path.join(workspacePath, "captions.txt")} and inspecting the attached workspace images. If you need to inspect directories first, use Glob or read the directory path to list its contents. Then write the final markdown analysis into the output directory.`,
    tools,
    imagePaths,
    client,
  );

  return ensureOutputFromAgent(
    beforeFiles,
    path.basename(workspacePath),
    finalText,
  );
}

export async function analyzeTranscriptionForFrames(
  workspacePath: string,
  model: LmStudioModel,
  prompts: PromptBundle,
  client: LMStudioClient,
): Promise<boolean> {
  const tools = createAgentTools({
    workspaceDir: workspacePath,
    outputDir: OUTPUT_DIR,
    allowWrite: false,
    allowRm: false,
  });
  const { finalText } = await runAgentTask(
    model,
    prompts.analyzeTranscription,
    `Read ${path.join(workspacePath, "transcription.txt")} and ${path.join(workspacePath, "captions.txt")}, then decide whether frame extraction is required. If you need to inspect the workspace first, use Glob or read the directory path to list its contents. Return brief reasoning and a final YES or NO verdict exactly as instructed.`,
    tools,
    [],
    client,
  );
  return parseYesNoVerdict(finalText);
}

export async function analyzeFramesAndFilter(
  workspacePath: string,
  model: LmStudioModel,
  prompts: PromptBundle,
  client: LMStudioClient,
): Promise<string[]> {
  const initialFrames = await listFilesMatching(
    path.join(workspacePath, "frames"),
    "*.jpg",
  );
  if (initialFrames.length === 0) {
    return [];
  }

  const tools = createAgentTools({
    workspaceDir: workspacePath,
    outputDir: OUTPUT_DIR,
    allowWrite: false,
    allowRm: true,
  });

  await runAgentTask(
    model,
    prompts.analyzeFrames,
    `Review the extracted frames in ${path.join(workspacePath, "frames")}. Use the available tools to inspect the frame list and remove redundant or unhelpful frames. You can read the frames directory to list its contents, and the current frame images are attached to this message.`,
    tools,
    initialFrames,
    client,
  );

  return listFilesMatching(path.join(workspacePath, "frames"), "*.jpg");
}

export async function analyzeVideo(
  media: InstagramMediaData,
  workspacePath: string,
  model: LmStudioModel,
  prompts: PromptBundle,
  client: LMStudioClient,
): Promise<{ outputPath: string; title: string | null }> {
  const videoUrl = media.video_url;
  if (!videoUrl) {
    throw new Error("No video_url found for video analysis.");
  }

  const videoPath = await downloadVideo(videoUrl, workspacePath);
  const transcriptionPath = await transcribeVideoWithMlxWhisper(
    videoPath,
    workspacePath,
  );
  const transcriptionText = (await readFile(transcriptionPath, "utf8")).trim();

  let needsFrames = transcriptionText.length === 0;
  if (!needsFrames) {
    needsFrames = await analyzeTranscriptionForFrames(
      workspacePath,
      model,
      prompts,
      client,
    );
  }

  let selectedFrames: string[] = [];
  if (needsFrames) {
    await extractFrames(videoPath, path.join(workspacePath, "frames"), 1);
    selectedFrames = await analyzeFramesAndFilter(
      workspacePath,
      model,
      prompts,
      client,
    );
  }

  const tools = createAgentTools({
    workspaceDir: workspacePath,
    outputDir: OUTPUT_DIR,
    allowWrite: true,
    allowRm: false,
  });
  const beforeFiles = await listMarkdownFiles(OUTPUT_DIR);
  const { finalText } = await runAgentTask(
    model,
    prompts.analyzeVideo,
    `Analyze the Instagram reel workspace at ${workspacePath}. Start by reading ${transcriptionPath} and ${path.join(workspacePath, "captions.txt")}. If frames exist, inspect ${path.join(workspacePath, "frames")} and use the attached frame images. If you need to inspect directories first, use Glob or read the directory path to list its contents. Then write the final markdown analysis into the output directory.`,
    tools,
    selectedFrames,
    client,
  );

  return ensureOutputFromAgent(
    beforeFiles,
    path.basename(workspacePath),
    finalText,
  );
}
