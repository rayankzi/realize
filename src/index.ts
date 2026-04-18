import { OUTPUT_DIR } from "./lib/constants";
import { formatUnknownError } from "./lib/errors";
import { ensureDir } from "./lib/files";
import { fetchNotStartedPages, writeNotionPagesJson } from "./services/notion";
import { appendLog, cleanupArtifacts } from "./services/workspace";
import {
  createWorkflowRuntimeContext,
  logFailedJobResult,
  logRunFailure,
  logSuccessfulJobResult,
  markSuccessfulJobDone,
  processSingleJob,
  requireNotionEnv,
} from "./workflow";

async function main(): Promise<void> {
  await ensureDir(OUTPUT_DIR);

  const runtime = await createWorkflowRuntimeContext({ requireNotion: true });

  console.log(`Using LM Studio model: ${runtime.env.lmStudioModelKey}`);
  if (!runtime.model.trainedForToolUse) {
    console.warn(
      `Warning: ${runtime.env.lmStudioModelKey} does not report tool-use training in LM Studio.`,
    );
  }
  if (!runtime.model.vision) {
    console.warn(
      `Warning: ${runtime.env.lmStudioModelKey} does not report vision support in LM Studio.`,
    );
  }

  console.log("Fetching Notion pages with status 'Not started'...");
  const pages = await fetchNotStartedPages(requireNotionEnv(runtime.env));
  const jobs = await writeNotionPagesJson(pages);
  console.log(`Saved ${jobs.length} links to notion_pages.json`);

  const completedPageIds: string[] = [];
  const failedPageIds: string[] = [];

  for (const [index, job] of jobs.entries()) {
    console.log(`Processing ${index + 1}/${jobs.length}: ${job.url}`);
    const result = await processSingleJob(job, runtime);

    if (!result.ok) {
      failedPageIds.push(job.pageId);
      await logFailedJobResult(result);
      console.error(`Failed at ${result.step}: ${result.errorMessage}`);
      continue;
    }

    await logSuccessfulJobResult(result);

    try {
      await markSuccessfulJobDone(result, runtime);
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
    await logRunFailure(error);
  } catch {
    // Ignore logging failures during fatal shutdown.
  }
  process.exitCode = 1;
});
