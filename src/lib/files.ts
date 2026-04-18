import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";

export async function ensureDir(dirPath: string): Promise<void> {
  await mkdir(dirPath, { recursive: true });
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

export async function listFilesMatching(
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

export async function listMarkdownFiles(directory: string): Promise<string[]> {
  try {
    const files = await listFilesMatching(directory, "*.md");
    return files.sort((left, right) => left.localeCompare(right));
  } catch {
    return [];
  }
}

export async function pickNewestFile(
  filePaths: string[],
): Promise<string | null> {
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

export async function getUniqueOutputPath(basePath: string): Promise<string> {
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
