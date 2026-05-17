import { expect, test } from "bun:test";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import {
  readAgentPath,
  runAgentBashCommand,
  writeAgentFile,
} from "../src/tools/agent-tools";

async function withTempAgentContext(
  run: (context: {
    workspaceDir: string;
    outputDir: string;
    allowWrite: boolean;
    allowRm: boolean;
  }) => Promise<void>,
): Promise<void> {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "agent-tools-"));
  const context = {
    workspaceDir: path.join(rootDir, "workspace"),
    outputDir: path.join(rootDir, "output"),
    allowWrite: true,
    allowRm: true,
  };

  await rm(rootDir, { recursive: true, force: true });
  await runAgentBashCommand(`mkdir -p ${context.workspaceDir}`, context);
  await runAgentBashCommand(`mkdir -p ${context.outputDir}`, context);

  try {
    await run(context);
  } finally {
    await rm(rootDir, { recursive: true, force: true });
  }
}

test("readAgentPath lists directory contents instead of throwing on directories", async () => {
  await withTempAgentContext(async (context) => {
    await writeAgentFile(
      path.join(context.workspaceDir, "captions.txt"),
      "caption",
      context,
    );
    await runAgentBashCommand(
      `mkdir -p ${path.join(context.workspaceDir, "frames")}`,
      context,
    );

    const listing = await readAgentPath(context.workspaceDir, context);

    expect(listing).toContain(`Directory listing for ${context.workspaceDir}`);
    expect(listing).toContain("[FILE] captions.txt");
    expect(listing).toContain("[DIR ] frames");
  });
});

test("writeAgentFile can create nested directories under the workspace", async () => {
  await withTempAgentContext(async (context) => {
    const targetPath = path.join(
      context.workspaceDir,
      "notes",
      "nested",
      "analysis.md",
    );

    const result = await writeAgentFile(targetPath, "# Summary", context);
    const fileContents = await readFile(targetPath, "utf8");

    expect(result).toBe(`Wrote ${targetPath}`);
    expect(fileContents).toBe("# Summary");
  });
});
