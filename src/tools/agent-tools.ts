import { readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { tool } from "@lmstudio/sdk";
import { z } from "zod";

import { ensureDir, listFilesMatching } from "../lib/files";
import { ensureAllowedPath, normalizeAndResolvePath } from "../lib/paths";
import { parseCommand } from "../lib/text";
import type { AgentToolContext } from "../types";

export function createAgentTools(context: AgentToolContext) {
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
