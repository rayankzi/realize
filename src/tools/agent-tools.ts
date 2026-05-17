import {
  readFile,
  readdir,
  rename,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";

import { tool } from "@lmstudio/sdk";
import { z } from "zod";

import { ensureDir, listFilesMatching } from "../lib/files";
import { ensureAllowedPath, normalizeAndResolvePath } from "../lib/paths";
import { parseCommand } from "../lib/text";
import type { AgentToolContext } from "../types";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function getAllowedRoots(context: AgentToolContext): string[] {
  return [context.workspaceDir, context.outputDir];
}

function resolveAllowedPath(
  inputPath: string,
  baseDir: string,
  allowedRoots: string[],
): string {
  return ensureAllowedPath(
    normalizeAndResolvePath(inputPath, baseDir),
    allowedRoots,
  );
}

async function formatDirectoryListing(directoryPath: string): Promise<string> {
  const entries = await readdir(directoryPath, { withFileTypes: true });
  const lines = entries
    .sort((left, right) => left.name.localeCompare(right.name))
    .map((entry) => {
      const kind = entry.isDirectory() ? "DIR " : "FILE";
      return `[${kind}] ${entry.name}`;
    });

  if (lines.length === 0) {
    return `Directory listing for ${directoryPath}:\n(empty)`;
  }

  return `Directory listing for ${directoryPath}:\n${lines.join("\n")}`;
}

export async function readAgentPath(
  inputPath: string,
  context: Pick<AgentToolContext, "workspaceDir" | "outputDir">,
): Promise<string> {
  const allowedRoots = getAllowedRoots({
    ...context,
    allowWrite: false,
    allowRm: false,
  });
  const resolvedPath = resolveAllowedPath(
    inputPath,
    context.workspaceDir,
    allowedRoots,
  );
  const pathStats = await stat(resolvedPath);

  if (pathStats.isDirectory()) {
    return formatDirectoryListing(resolvedPath);
  }

  const ext = path.extname(resolvedPath).toLowerCase();
  if (IMAGE_EXTENSIONS.has(ext)) {
    return `Image file available at ${resolvedPath}. Use the images already attached in the chat for visual analysis.`;
  }

  return readFile(resolvedPath, "utf8");
}

export async function writeAgentFile(
  inputPath: string,
  content: string,
  context: Pick<AgentToolContext, "workspaceDir" | "outputDir" | "allowWrite">,
): Promise<string> {
  if (!context.allowWrite) {
    return "Error: Write is not enabled for this task.";
  }

  const allowedRoots = getAllowedRoots({
    ...context,
    allowRm: false,
  });
  const resolvedPath = resolveAllowedPath(
    inputPath,
    context.outputDir,
    allowedRoots,
  );
  await ensureDir(path.dirname(resolvedPath));
  await writeFile(resolvedPath, content, "utf8");
  return `Wrote ${resolvedPath}`;
}

export async function runAgentBashCommand(
  command: string,
  context: AgentToolContext,
): Promise<string> {
  const allowedRoots = getAllowedRoots(context);
  const tokens = parseCommand(command);
  const [bin, ...rest] = tokens;

  if (bin === "mkdir" && rest[0] === "-p" && rest[1]) {
    const dirPath = resolveAllowedPath(
      rest[1],
      context.workspaceDir,
      allowedRoots,
    );
    await ensureDir(dirPath);
    return `Created ${dirPath}`;
  }

  if (bin === "mv" && rest[0] && rest[1]) {
    const fromPath = resolveAllowedPath(
      rest[0],
      context.workspaceDir,
      allowedRoots,
    );
    const toPath = resolveAllowedPath(
      rest[1],
      context.workspaceDir,
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

    const targetPath = resolveAllowedPath(rest[0], context.workspaceDir, [
      context.workspaceDir,
    ]);
    await rm(targetPath, { force: true });
    return `Removed ${targetPath}`;
  }

  return `Error: Unsupported Bash command: ${command}`;
}

export function createAgentTools(context: AgentToolContext) {
  const allowedRoots = getAllowedRoots(context);

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
      return readAgentPath(inputPath, context);
    },
  });

  const Write = tool({
    name: "Write",
    description:
      "Write UTF-8 content to a file under the allowed workspace or output directories. Creates parent directories automatically.",
    parameters: {
      path: z.string(),
      content: z.string(),
    },
    implementation: async ({ path: inputPath, content }) => {
      return writeAgentFile(inputPath, content, context);
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
      return runAgentBashCommand(command, context);
    },
  });

  return { Glob, Read, Write, Bash };
}
