import path from "node:path";

export function normalizeAndResolvePath(
  inputPath: string,
  baseDir: string,
): string {
  return path.isAbsolute(inputPath)
    ? path.normalize(inputPath)
    : path.resolve(baseDir, inputPath);
}

export function isWithinRoot(candidatePath: string, rootPath: string): boolean {
  const relative = path.relative(rootPath, candidatePath);
  return (
    relative === "" ||
    (!relative.startsWith("..") && !path.isAbsolute(relative))
  );
}

export function ensureAllowedPath(
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
