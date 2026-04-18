import { afterAll, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";

import { cleanupArtifacts } from "../src/services/workspace";
import {
  createWorkflowRuntimeContext,
  logFailedJobResult,
  logSuccessfulJobResult,
  processSingleJob,
} from "../src/workflow";

const workflowUrl = process.env.WORKFLOW_TEST_URL;
const shouldCleanup = process.env.WORKFLOW_TEST_SKIP_CLEANUP !== "true";

let runtimeCreated = false;

afterAll(async () => {
  if (runtimeCreated && shouldCleanup) {
    await cleanupArtifacts();
  }
});

const runnable = Boolean(workflowUrl);
const summarizeOnlyTest = runnable ? test : test.skip;

summarizeOnlyTest(
  "runs summarization for one Instagram URL without touching Notion",
  async () => {
    const configuredUrl = workflowUrl!;
    const runtime = await createWorkflowRuntimeContext({
      requireNotion: false,
    });
    runtimeCreated = true;

    console.log(`Using LM Studio model: ${runtime.env.lmStudioModelKey}`);
    console.log(`Testing summarize-only workflow for URL: ${configuredUrl}`);

    const result = await processSingleJob(
      {
        url: configuredUrl,
        pageId: "local-test-page-id",
      },
      runtime,
    );

    if (!result.ok) {
      await logFailedJobResult(result);
      throw new Error(
        `Workflow failed at ${result.step}: ${result.errorMessage}`,
      );
    }

    await logSuccessfulJobResult(result);

    const output = await readFile(result.outputPath, "utf8");

    expect(result.url).toBe(configuredUrl);
    expect(result.pageId).toBe("local-test-page-id");
    expect(result.workspacePath.length).toBeGreaterThan(0);
    expect(result.outputPath.endsWith(".md")).toBe(true);
    expect(output.trim().length).toBeGreaterThan(0);
    expect(output.trim().startsWith("# ")).toBe(true);
  },
);
