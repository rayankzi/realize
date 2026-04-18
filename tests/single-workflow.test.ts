import { afterAll, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";

import { cleanupArtifacts } from "../src/services/workspace";
import {
  createWorkflowRuntimeContext,
  logFailedJobResult,
  logSuccessfulJobResult,
  markSuccessfulJobDone,
  processSingleJob,
} from "../src/workflow";

const workflowUrl = process.env.WORKFLOW_TEST_URL;
const workflowPageId = process.env.WORKFLOW_TEST_PAGE_ID;
const shouldMarkDone = process.env.WORKFLOW_TEST_MARK_DONE === "true";
const shouldCleanup = process.env.WORKFLOW_TEST_SKIP_CLEANUP !== "true";

let runtimeCreated = false;

afterAll(async () => {
  if (runtimeCreated && shouldCleanup) {
    await cleanupArtifacts();
  }
});

const runnable = Boolean(workflowUrl && workflowPageId);
const singleWorkflowTest = runnable ? test : test.skip;

singleWorkflowTest(
  "runs the full workflow for one explicit Instagram URL and page id",
  async () => {
    const configuredUrl = workflowUrl!;
    const configuredPageId = workflowPageId!;
    const runtime = await createWorkflowRuntimeContext({
      requireNotion: shouldMarkDone,
    });
    runtimeCreated = true;

    console.log(`Using LM Studio model: ${runtime.env.lmStudioModelKey}`);
    console.log(`Testing single workflow for URL: ${configuredUrl}`);
    console.log(`Using page id: ${configuredPageId}`);

    const result = await processSingleJob(
      {
        url: configuredUrl,
        pageId: configuredPageId,
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

    expect(result.pageId).toBe(configuredPageId);
    expect(result.url).toBe(configuredUrl);
    expect(result.workspacePath.length).toBeGreaterThan(0);
    expect(result.outputPath.endsWith(".md")).toBe(true);
    expect(output.trim().length).toBeGreaterThan(0);
    expect(output.trim().startsWith("# ")).toBe(true);

    if (shouldMarkDone) {
      await markSuccessfulJobDone(result, runtime);
    }
  },
);
