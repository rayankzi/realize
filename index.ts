import { $ } from "bun";
import { Chat, LMStudioClient, tool } from "@lmstudio/sdk";
import {
  appendFile,
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

type MediaType = "Static Post" | "Video";
type LogStatus = "SUCCESS" | "FAILURE";

interface EnvConfig {
  notionIntegrationToken: string;
  notionDatabaseId: string;
  userAgent: string;
  xIgAppId: string;
  lmStudioModelKey: string;
}

interface NotionDatabaseQueryResponse {
  results?: NotionPage[];
  has_more?: boolean;
  next_cursor?: string | null;
}

interface NotionPage {
  id: string;
  properties?: {
    URL?: {
      url?: string | null;
    };
  };
}

interface NotionPagesFile {
  links: string[];
  page_ids: string[];
}

interface Job {
  pageId: string;
  url: string;
}

interface InstagramGraphqlEnvelope {
  data?: {
    xdt_shortcode_media?: InstagramMediaNode;
  };
}

interface InstagramMediaNode {
  __typename?: string | null;
  shortcode?: string | null;
  dimensions?: Record<string, unknown> | null;
  display_url?: string | null;
  display_resources?: unknown[] | null;
  has_audio?: boolean | null;
  video_url?: string | null;
  video_view_count?: number | null;
  video_play_count?: number | null;
  is_video?: boolean | null;
  edge_media_to_caption?: {
    edges?: Array<{
      node?: {
        text?: string | null;
      };
    }>;
  } | null;
  is_paid_partnership?: boolean | null;
  location?: Record<string, unknown> | null;
  owner?: Record<string, unknown> | null;
  product_type?: string | null;
  video_duration?: number | null;
  thumbnail_src?: string | null;
  clips_music_attribution_info?: Record<string, unknown> | null;
  edge_sidecar_to_children?: {
    edges?: InstagramSidecarEdge[];
  } | null;
}

interface InstagramSidecarEdge {
  node?: {
    display_url?: string | null;
  };
}

interface InstagramMediaData {
  __typename: string | null;
  shortcode: string | null;
  dimensions: Record<string, unknown> | null;
  display_url: string | null;
  display_resources: unknown[] | null;
  has_audio: boolean | null;
  video_url: string | null;
  video_view_count: number | null;
  video_play_count: number | null;
  is_video: boolean | null;
  caption: string | null;
  is_paid_partnership: boolean | null;
  location: Record<string, unknown> | null;
  owner: Record<string, unknown> | null;
  product_type: string | null;
  video_duration: number | null;
  thumbnail_src: string | null;
  clips_music_attribution_info: Record<string, unknown> | null;
  sidecar: InstagramSidecarEdge[];
}

interface PromptBundle {
  analyzePost: string;
  analyzeTranscription: string;
  analyzeVideo: string;
  analyzeFrames: string;
}

interface ProcessSuccessResult {
  ok: true;
  pageId: string;
  url: string;
  mediaType: MediaType;
  workspacePath: string;
  outputPath: string;
  title: string | null;
}

interface ProcessFailureResult {
  ok: false;
  pageId: string;
  url: string;
  mediaType: MediaType | null;
  workspacePath: string | null;
  step: string;
  errorMessage: string;
}

type ProcessResult = ProcessSuccessResult | ProcessFailureResult;

interface LogEntry {
  timestamp: string;
  status: LogStatus;
  event: "analysis_success" | "failure" | "run_failure" | "cleanup_failure";
  page_id: string | null;
  instagram_url: string | null;
  media_type: MediaType | null;
  workspace_path: string | null;
  output_path?: string | null;
  step?: string;
  error?: string;
  title?: string | null;
}

interface AgentRunResult {
  finalText: string;
}

interface AgentToolContext {
  workspaceDir: string;
  outputDir: string;
  allowWrite: boolean;
  allowRm: boolean;
}

const PROJECT_ROOT = process.cwd();
const BACKEND_ENV_PATH = path.join(PROJECT_ROOT, "backend", ".env");
const NOTION_PAGES_PATH = path.join(PROJECT_ROOT, "notion_pages.json");
const LOGS_PATH = path.join(PROJECT_ROOT, "logs.txt");
const DATA_DIR = path.join(PROJECT_ROOT, "data");
const OUTPUT_DIR = path.join(PROJECT_ROOT, "output");
const WHISPER_MODEL = "mlx-community/whisper-large-v3-turbo";

const PROMPT_PATHS = {
  analyzePost: path.join(
    PROJECT_ROOT,
    ".claude",
    "skills",
    "analyze-post",
    "SKILL.md",
  ),
  analyzeTranscription: path.join(
    PROJECT_ROOT,
    ".claude",
    "skills",
    "analyze-transcription",
    "SKILL.md",
  ),
  analyzeVideo: path.join(
    PROJECT_ROOT,
    ".claude",
    "skills",
    "analyze-video",
    "SKILL.md",
  ),
  analyzeFrames: path.join(
    PROJECT_ROOT,
    ".claude",
    "skills",
    "analyze-frames",
    "SKILL.md",
  ),
} as const;

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

async function loadEnv(): Promise<EnvConfig> {
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

async function loadPrompts(): Promise<PromptBundle> {
  const [analyzePost, analyzeTranscription, analyzeVideo, analyzeFrames] =
    await Promise.all([
      readFile(PROMPT_PATHS.analyzePost, "utf8"),
      readFile(PROMPT_PATHS.analyzeTranscription, "utf8"),
      readFile(PROMPT_PATHS.analyzeVideo, "utf8"),
      readFile(PROMPT_PATHS.analyzeFrames, "utf8"),
    ]);

  return {
    analyzePost,
    analyzeTranscription,
    analyzeVideo,
    analyzeFrames,
  };
}

async function ensureResponseOk(
  response: Response,
  context: string,
): Promise<void> {
  if (response.ok) {
    return;
  }

  const body = await response.text();
  throw new Error(
    `${context} failed with ${response.status} ${response.statusText}: ${body}`,
  );
}

async function fetchNotStartedPages(env: EnvConfig): Promise<NotionPage[]> {
  const url = `https://api.notion.com/v1/databases/${env.notionDatabaseId}/query`;
  const headers = {
    Authorization: `Bearer ${env.notionIntegrationToken}`,
    "Content-Type": "application/json",
    "Notion-Version": "2022-06-28",
  };
  const payload: {
    filter: {
      property: "Status";
      status: {
        equals: "Not started";
      };
    };
    start_cursor?: string;
  } = {
    filter: {
      property: "Status",
      status: {
        equals: "Not started",
      },
    },
  };

  const allResults: NotionPage[] = [];
  let hasMore = true;
  let nextCursor: string | null | undefined;

  while (hasMore) {
    if (nextCursor) {
      payload.start_cursor = nextCursor;
    } else {
      delete payload.start_cursor;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    await ensureResponseOk(response, "Notion database query");

    const data = (await response.json()) as NotionDatabaseQueryResponse;
    allResults.push(...(data.results ?? []));
    hasMore = data.has_more ?? false;
    nextCursor = data.next_cursor;
  }

  return allResults;
}

async function writeNotionPagesJson(pages: NotionPage[]): Promise<Job[]> {
  const links: string[] = [];
  const pageIds: string[] = [];

  for (const page of pages) {
    const link = page.properties?.URL?.url;
    if (link) {
      links.push(link);
      pageIds.push(page.id);
    }
  }

  const payload: NotionPagesFile = { links, page_ids: pageIds };
  await writeFile(
    NOTION_PAGES_PATH,
    `${JSON.stringify(payload, null, 2)}\n`,
    "utf8",
  );

  return links.map((url, index) => ({
    pageId: pageIds[index] ?? "",
    url,
  }));
}

function getInstagramId(url: string): string | null {
  const match = url.match(
    /instagram\.com\/(?:[A-Za-z0-9_.]+\/)?(p|reels|reel|stories)\/([A-Za-z0-9\-_]+)/u,
  );
  return match?.[2] ?? null;
}

async function getInstagramGraphqlData(
  url: string,
  env: EnvConfig,
): Promise<InstagramMediaData> {
  const igId = getInstagramId(url);
  if (!igId) {
    throw new Error("Invalid Instagram URL.");
  }

  const params = new URLSearchParams({
    variables: JSON.stringify({ shortcode: igId }),
    doc_id: "10015901848480474",
    lsd: "AVqbxe3J_YA",
  });

  const response = await fetch("https://www.instagram.com/api/graphql", {
    method: "POST",
    headers: {
      "User-Agent": env.userAgent,
      "Content-Type": "application/x-www-form-urlencoded",
      "X-IG-App-ID": env.xIgAppId,
      "X-FB-LSD": "AVqbxe3J_YA",
      "X-ASBD-ID": "129477",
      "Sec-Fetch-Site": "same-origin",
    },
    body: params.toString(),
  });
  await ensureResponseOk(response, "Instagram GraphQL fetch");

  const data = (await response.json()) as InstagramGraphqlEnvelope;
  const items = data.data?.xdt_shortcode_media;
  if (!items) {
    throw new Error("Instagram response did not include xdt_shortcode_media.");
  }

  const captionEdges = items.edge_media_to_caption?.edges ?? [];
  const caption = captionEdges[0]?.node?.text ?? null;

  return {
    __typename: items.__typename ?? null,
    shortcode: items.shortcode ?? null,
    dimensions: items.dimensions ?? null,
    display_url: items.display_url ?? null,
    display_resources: items.display_resources ?? null,
    has_audio: items.has_audio ?? null,
    video_url: items.video_url ?? null,
    video_view_count: items.video_view_count ?? null,
    video_play_count: items.video_play_count ?? null,
    is_video: items.is_video ?? null,
    caption,
    is_paid_partnership: items.is_paid_partnership ?? null,
    location: items.location ?? null,
    owner: items.owner ?? null,
    product_type: items.product_type ?? null,
    video_duration: items.video_duration ?? null,
    thumbnail_src: items.thumbnail_src ?? null,
    clips_music_attribution_info: items.clips_music_attribution_info ?? null,
    sidecar: items.edge_sidecar_to_children?.edges ?? [],
  };
}

async function downloadToFile(
  url: string,
  destinationPath: string,
): Promise<void> {
  const response = await fetch(url);
  await ensureResponseOk(response, `Downloading ${url}`);
  const arrayBuffer = await response.arrayBuffer();
  await writeFile(destinationPath, Buffer.from(arrayBuffer));
}

async function downloadVideo(
  videoUrl: string,
  outputDir: string,
): Promise<string> {
  const urlWithoutQuery = videoUrl.split("?")[0] ?? videoUrl;
  const fileNameCandidate = urlWithoutQuery.split("/").pop() ?? "video";
  const hasExtension = fileNameCandidate.includes(".");
  const ext = hasExtension
    ? (fileNameCandidate.split(".").pop() ?? "mp4")
    : "mp4";
  const filePath = path.join(outputDir, `video.${ext}`);
  await downloadToFile(videoUrl, filePath);
  return filePath;
}

async function downloadCarouselImages(
  sidecar: InstagramSidecarEdge[],
  outputDir: string,
  displayUrl: string | null,
): Promise<string[]> {
  const savedPaths: string[] = [];

  if ((!sidecar || sidecar.length === 0) && displayUrl) {
    const destinationPath = path.join(outputDir, "image_1.jpg");
    await downloadToFile(displayUrl, destinationPath);
    savedPaths.push(destinationPath);
    return savedPaths;
  }

  let index = 1;
  for (const edge of sidecar) {
    const imageUrl = edge.node?.display_url;
    if (!imageUrl) {
      continue;
    }
    const destinationPath = path.join(outputDir, `image_${index}.jpg`);
    await downloadToFile(imageUrl, destinationPath);
    savedPaths.push(destinationPath);
    index += 1;
  }

  return savedPaths;
}

function getMediaType(media: InstagramMediaData): MediaType {
  return media.video_url ? "Video" : "Static Post";
}

async function ensureDir(dirPath: string): Promise<void> {
  await mkdir(dirPath, { recursive: true });
}

async function createWorkspace(): Promise<string> {
  await ensureDir(DATA_DIR);
  const workspacePath = path.join(DATA_DIR, crypto.randomUUID());
  await ensureDir(workspacePath);
  return workspacePath;
}

async function writeCaptionFile(
  workspacePath: string,
  caption: string | null,
): Promise<string> {
  const captionPath = path.join(workspacePath, "captions.txt");
  await writeFile(captionPath, (caption ?? "").trim(), "utf8");
  return captionPath;
}

async function appendLog(entry: LogEntry): Promise<void> {
  await appendFile(LOGS_PATH, `${JSON.stringify(entry)}\n`, "utf8");
}

async function markPageDone(pageId: string, env: EnvConfig): Promise<void> {
  const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${env.notionIntegrationToken}`,
      "Content-Type": "application/json",
      "Notion-Version": "2026-03-11",
    },
    body: JSON.stringify({
      properties: {
        Status: {
          status: {
            name: "Done",
          },
        },
      },
    }),
  });

  await ensureResponseOk(response, `Marking Notion page ${pageId} done`);
}

async function cleanupArtifacts(): Promise<void> {
  await rm(DATA_DIR, { recursive: true, force: true });
  await rm(NOTION_PAGES_PATH, { force: true });
}

function formatUnknownError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return JSON.stringify(error);
}

function shellErrorDetails(error: unknown): string {
  if (!error || typeof error !== "object") {
    return formatUnknownError(error);
  }

  const shell = error as {
    message?: string;
    stderr?: string | Uint8Array;
    stdout?: string | Uint8Array;
  };

  const stderr =
    typeof shell.stderr === "string"
      ? shell.stderr
      : shell.stderr
        ? Buffer.from(shell.stderr).toString("utf8")
        : "";
  const stdout =
    typeof shell.stdout === "string"
      ? shell.stdout
      : shell.stdout
        ? Buffer.from(shell.stdout).toString("utf8")
        : "";

  return [formatUnknownError(error), stderr.trim(), stdout.trim()]
    .filter(Boolean)
    .join(" | ");
}

async function transcribeVideoWithMlxWhisper(
  videoPath: string,
  workspacePath: string,
): Promise<string> {
  try {
    await $`mlx_whisper ${videoPath} --model ${WHISPER_MODEL} --output-dir ${workspacePath} --output-format txt --output-name transcription --verbose False`.quiet();
  } catch (error) {
    throw new Error(`MLX Whisper CLI failed: ${shellErrorDetails(error)}`);
  }

  const transcriptionPath = path.join(workspacePath, "transcription.txt");
  const transcriptionText = (await readFile(transcriptionPath, "utf8")).trim();
  await writeFile(transcriptionPath, transcriptionText, "utf8");
  return transcriptionPath;
}

async function extractFrames(
  videoPath: string,
  outputDir: string,
  fps = 1,
): Promise<string[]> {
  await ensureDir(outputDir);
  try {
    await $`ffmpeg -i ${videoPath} -vf fps=${fps} ${path.join(outputDir, "frame_%04d.jpg")} -y`.quiet();
  } catch (error) {
    throw new Error(
      `ffmpeg frame extraction failed: ${shellErrorDetails(error)}`,
    );
  }

  return listFilesMatching(outputDir, "*.jpg");
}

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

function normalizeAndResolvePath(inputPath: string, baseDir: string): string {
  return path.isAbsolute(inputPath)
    ? path.normalize(inputPath)
    : path.resolve(baseDir, inputPath);
}

function isWithinRoot(candidatePath: string, rootPath: string): boolean {
  const relative = path.relative(rootPath, candidatePath);
  return (
    relative === "" ||
    (!relative.startsWith("..") && !path.isAbsolute(relative))
  );
}

function ensureAllowedPath(
  candidatePath: string,
  allowedRoots: string[],
): string {
  for (const root of allowedRoots) {
    if (isWithinRoot(candidatePath, root)) {
      return candidatePath;
    }
  }
  throw new Error(`Path is outside allowed roots: ${candidatePath}`);
}

async function listFilesRecursive(rootDir: string): Promise<string[]> {
  const entries = await readdir(rootDir, { withFileTypes: true });
  const results: string[] = [];

  for (const entry of entries) {
    const absolutePath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await listFilesRecursive(absolutePath)));
    } else if (entry.isFile()) {
      results.push(absolutePath);
    }
  }

  return results;
}

function escapeRegExp(text: string): string {
  return text.replace(/[|\\{}()[\]^$+?.]/gu, "\\$&");
}

function globToRegExp(pattern: string): RegExp {
  const normalized = pattern.split(path.sep).join("/");
  let regex = "^";

  for (let index = 0; index < normalized.length; index += 1) {
    const char = normalized[index] ?? "";
    const nextChar = normalized[index + 1] ?? "";

    if (char === "*" && nextChar === "*") {
      regex += ".*";
      index += 1;
      continue;
    }
    if (char === "*") {
      regex += "[^/]*";
      continue;
    }
    if (char === "?") {
      regex += ".";
      continue;
    }

    regex += escapeRegExp(char);
  }

  regex += "$";
  return new RegExp(regex, "u");
}

async function listFilesMatching(
  directory: string,
  pattern: string,
): Promise<string[]> {
  const files = await listFilesRecursive(directory);
  const regex = globToRegExp(pattern);

  return files
    .filter((filePath) =>
      regex.test(path.relative(directory, filePath).split(path.sep).join("/")),
    )
    .sort((left, right) => left.localeCompare(right));
}

function parseCommand(command: string): string[] {
  const tokens = command.match(/"[^"]*"|'[^']*'|\S+/gu) ?? [];
  return tokens.map((token) => {
    if (
      (token.startsWith('"') && token.endsWith('"')) ||
      (token.startsWith("'") && token.endsWith("'"))
    ) {
      return token.slice(1, -1);
    }
    return token;
  });
}

function createAgentTools(context: AgentToolContext) {
  const allowedRoots = [context.workspaceDir, context.outputDir];

  const Glob = tool({
    name: "Glob",
    description:
      "List files in a directory using a glob pattern. Returns absolute file paths.",
    parameters: {
      directory: z.string(),
      pattern: z.string(),
    },
    implementation: async ({ directory, pattern }) => {
      const resolvedDirectory = ensureAllowedPath(
        normalizeAndResolvePath(directory, context.workspaceDir),
        allowedRoots,
      );
      const matches = await listFilesMatching(resolvedDirectory, pattern);
      return JSON.stringify(matches, null, 2);
    },
  });

  const Read = tool({
    name: "Read",
    description:
      "Read a UTF-8 text file. For image files, returns a notice so you can rely on the attached images in the chat context.",
    parameters: {
      path: z.string(),
    },
    implementation: async ({ path: inputPath }) => {
      const resolvedPath = ensureAllowedPath(
        normalizeAndResolvePath(inputPath, context.workspaceDir),
        allowedRoots,
      );
      const ext = path.extname(resolvedPath).toLowerCase();
      if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
        return `Image file available at ${resolvedPath}. Use the images already attached in the chat for visual analysis.`;
      }
      return readFile(resolvedPath, "utf8");
    },
  });

  const Write = tool({
    name: "Write",
    description: "Write UTF-8 content to a file in the output directory.",
    parameters: {
      path: z.string(),
      content: z.string(),
    },
    implementation: async ({ path: inputPath, content }) => {
      if (!context.allowWrite) {
        return "Error: Write is not enabled for this task.";
      }
      const resolvedPath = ensureAllowedPath(
        normalizeAndResolvePath(inputPath, context.outputDir),
        [context.outputDir],
      );
      await ensureDir(path.dirname(resolvedPath));
      await writeFile(resolvedPath, content, "utf8");
      return `Wrote ${resolvedPath}`;
    },
  });

  const Bash = tool({
    name: "Bash",
    description:
      "Run a tightly scoped filesystem command. Supported commands: mkdir -p <path>, mv <src> <dst>, rm <path>.",
    parameters: {
      command: z.string(),
    },
    implementation: async ({ command }) => {
      const tokens = parseCommand(command);
      const [bin, ...rest] = tokens;

      if (bin === "mkdir" && rest[0] === "-p" && rest[1]) {
        const dirPath = ensureAllowedPath(
          normalizeAndResolvePath(rest[1], context.workspaceDir),
          allowedRoots,
        );
        await ensureDir(dirPath);
        return `Created ${dirPath}`;
      }

      if (bin === "mv" && rest[0] && rest[1]) {
        const fromPath = ensureAllowedPath(
          normalizeAndResolvePath(rest[0], context.workspaceDir),
          allowedRoots,
        );
        const toPath = ensureAllowedPath(
          normalizeAndResolvePath(rest[1], context.workspaceDir),
          allowedRoots,
        );
        await ensureDir(path.dirname(toPath));
        await rename(fromPath, toPath);
        return `Moved ${fromPath} -> ${toPath}`;
      }

      if (bin === "rm" && rest[0]) {
        if (!context.allowRm) {
          return "Error: rm is not enabled for this task.";
        }
        const targetPath = ensureAllowedPath(
          normalizeAndResolvePath(rest[0], context.workspaceDir),
          [context.workspaceDir],
        );
        await rm(targetPath, { force: true });
        return `Removed ${targetPath}`;
      }

      return `Error: Unsupported Bash command: ${command}`;
    },
  });

  return { Glob, Read, Write, Bash };
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

async function runAgentTask(
  model: Awaited<ReturnType<LMStudioClient["llm"]["model"]>>,
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

async function listMarkdownFiles(directory: string): Promise<string[]> {
  try {
    const files = await listFilesMatching(directory, "*.md");
    return files.sort((left, right) => left.localeCompare(right));
  } catch {
    return [];
  }
}

async function pickNewestFile(filePaths: string[]): Promise<string | null> {
  if (filePaths.length === 0) {
    return null;
  }

  let newest = filePaths[0] ?? null;
  let newestMtime = newest ? (await stat(newest)).mtimeMs : -1;

  for (const filePath of filePaths.slice(1)) {
    const fileStats = await stat(filePath);
    if (fileStats.mtimeMs > newestMtime) {
      newest = filePath;
      newestMtime = fileStats.mtimeMs;
    }
  }

  return newest;
}

function slugifyTitle(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/gu, "-")
      .replace(/^-+|-+$/gu, "")
      .replace(/-{2,}/gu, "-")
      .split("-")
      .filter(Boolean)
      .slice(0, 5)
      .join("-") || "analysis"
  );
}

function extractTitle(markdown: string): string | null {
  const match = markdown.match(/^#\s+(.+)$/mu);
  return match?.[1]?.trim() ?? null;
}

async function getUniqueOutputPath(basePath: string): Promise<string> {
  const extension = path.extname(basePath);
  const stem = path.basename(basePath, extension);
  let candidate = basePath;
  let counter = 1;

  while (true) {
    try {
      await stat(candidate);
      candidate = path.join(
        path.dirname(basePath),
        `${stem}-${counter}${extension}`,
      );
      counter += 1;
    } catch {
      return candidate;
    }
  }
}

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

async function analyzeStaticPost(
  media: InstagramMediaData,
  workspacePath: string,
  model: Awaited<ReturnType<LMStudioClient["llm"]["model"]>>,
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
    `Analyze the Instagram post workspace at ${workspacePath}. Use the available tools for file access and writing the final markdown analysis. The relevant images from the workspace are attached to this message.`,
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

async function analyzeTranscriptionForFrames(
  workspacePath: string,
  model: Awaited<ReturnType<LMStudioClient["llm"]["model"]>>,
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
    `Analyze ${path.join(workspacePath, "transcription.txt")} and ${path.join(workspacePath, "captions.txt")}. Use the available tools to read the files and return a YES or NO verdict exactly as instructed.`,
    tools,
    [],
    client,
  );
  return parseYesNoVerdict(finalText);
}

async function analyzeFramesAndFilter(
  workspacePath: string,
  model: Awaited<ReturnType<LMStudioClient["llm"]["model"]>>,
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
    `Analyze the extracted frames in ${workspacePath}. Use the provided tools to inspect the frame list and remove any redundant or unhelpful frames. The current frame images are attached to this message.`,
    tools,
    initialFrames,
    client,
  );

  return listFilesMatching(path.join(workspacePath, "frames"), "*.jpg");
}

async function analyzeVideo(
  media: InstagramMediaData,
  workspacePath: string,
  model: Awaited<ReturnType<LMStudioClient["llm"]["model"]>>,
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
    `Analyze the Instagram reel workspace at ${workspacePath}. Use the available tools to read the transcription and caption files, inspect remaining frame files, and write the final markdown analysis. Any selected frames are attached to this message.`,
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

async function processSingleJob(
  job: Job,
  env: EnvConfig,
  prompts: PromptBundle,
  client: LMStudioClient,
  model: Awaited<ReturnType<LMStudioClient["llm"]["model"]>>,
): Promise<ProcessResult> {
  let currentStep = "fetch_instagram_data";
  let workspacePath: string | null = null;
  let mediaType: MediaType | null = null;

  try {
    const media = await getInstagramGraphqlData(job.url, env);
    mediaType = getMediaType(media);

    currentStep = "create_workspace";
    workspacePath = await createWorkspace();

    currentStep = "write_caption";
    await writeCaptionFile(workspacePath, media.caption);

    let analysisResult: { outputPath: string; title: string | null };

    if (mediaType === "Static Post") {
      currentStep = "analyze_static_post";
      analysisResult = await analyzeStaticPost(
        media,
        workspacePath,
        model,
        prompts,
        client,
      );
    } else {
      currentStep = "analyze_video";
      analysisResult = await analyzeVideo(
        media,
        workspacePath,
        model,
        prompts,
        client,
      );
    }

    return {
      ok: true,
      pageId: job.pageId,
      url: job.url,
      mediaType,
      workspacePath,
      outputPath: analysisResult.outputPath,
      title: analysisResult.title,
    };
  } catch (error) {
    return {
      ok: false,
      pageId: job.pageId,
      url: job.url,
      mediaType,
      workspacePath,
      step: currentStep,
      errorMessage: formatUnknownError(error),
    };
  }
}

async function main(): Promise<void> {
  await ensureDir(OUTPUT_DIR);

  const env = await loadEnv();
  const prompts = await loadPrompts();
  const client = new LMStudioClient();
  const model = await client.llm.model(env.lmStudioModelKey);

  console.log(`Using LM Studio model: ${env.lmStudioModelKey}`);
  if (!model.trainedForToolUse) {
    console.warn(
      `Warning: ${env.lmStudioModelKey} does not report tool-use training in LM Studio.`,
    );
  }
  if (!model.vision) {
    console.warn(
      `Warning: ${env.lmStudioModelKey} does not report vision support in LM Studio.`,
    );
  }

  console.log("Fetching Notion pages with status 'Not started'...");
  const pages = await fetchNotStartedPages(env);
  const jobs = await writeNotionPagesJson(pages);
  console.log(`Saved ${jobs.length} links to ${NOTION_PAGES_PATH}`);

  const completedPageIds: string[] = [];
  const failedPageIds: string[] = [];

  for (const [index, job] of jobs.entries()) {
    console.log(`Processing ${index + 1}/${jobs.length}: ${job.url}`);
    const result = await processSingleJob(job, env, prompts, client, model);

    if (!result.ok) {
      failedPageIds.push(job.pageId);
      await appendLog({
        timestamp: new Date().toISOString(),
        status: "FAILURE",
        event: "failure",
        page_id: result.pageId,
        instagram_url: result.url,
        media_type: result.mediaType,
        workspace_path: result.workspacePath,
        step: result.step,
        error: result.errorMessage,
      });
      console.error(`Failed at ${result.step}: ${result.errorMessage}`);
      continue;
    }

    await appendLog({
      timestamp: new Date().toISOString(),
      status: "SUCCESS",
      event: "analysis_success",
      page_id: result.pageId,
      instagram_url: result.url,
      media_type: result.mediaType,
      workspace_path: result.workspacePath,
      output_path: result.outputPath,
      title: result.title,
    });

    try {
      await markPageDone(result.pageId, env);
      completedPageIds.push(result.pageId);
      console.log(`Completed ${result.url} -> ${result.outputPath}`);
    } catch (error) {
      failedPageIds.push(result.pageId);
      await appendLog({
        timestamp: new Date().toISOString(),
        status: "FAILURE",
        event: "failure",
        page_id: result.pageId,
        instagram_url: result.url,
        media_type: result.mediaType,
        workspace_path: result.workspacePath,
        output_path: result.outputPath,
        step: "mark_notion_done",
        error: formatUnknownError(error),
        title: result.title,
      });
      console.error(
        `Notion update failed for ${result.pageId}: ${formatUnknownError(error)}`,
      );
    }
  }

  try {
    await cleanupArtifacts();
  } catch (error) {
    await appendLog({
      timestamp: new Date().toISOString(),
      status: "FAILURE",
      event: "cleanup_failure",
      page_id: null,
      instagram_url: null,
      media_type: null,
      workspace_path: null,
      step: "cleanup",
      error: formatUnknownError(error),
    });
    throw error;
  }

  console.log(
    `Run finished. Marked done: ${completedPageIds.length}. Failures/unmarked: ${failedPageIds.length}.`,
  );
}

main().catch(async (error) => {
  const message = formatUnknownError(error);
  console.error(message);
  try {
    await appendLog({
      timestamp: new Date().toISOString(),
      status: "FAILURE",
      event: "run_failure",
      page_id: null,
      instagram_url: null,
      media_type: null,
      workspace_path: null,
      step: "main",
      error: message,
    });
  } catch {
    // Ignore logging failures during fatal shutdown.
  }
  process.exitCode = 1;
});
