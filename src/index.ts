import { LMStudioClient } from "@lmstudio/sdk";

import { analyzeStaticPost, analyzeVideo } from "./agents/workflows";
import { OUTPUT_DIR } from "./lib/constants";
import { formatUnknownError } from "./lib/errors";
import { ensureDir } from "./lib/files";
import { prompts } from "./prompts";
import { loadEnv } from "./services/config";
import { getInstagramGraphqlData, getMediaType } from "./services/instagram";
import {
  fetchNotStartedPages,
  markPageDone,
  writeNotionPagesJson,
} from "./services/notion";
import {
  appendLog,
  cleanupArtifacts,
  createWorkspace,
  writeCaptionFile,
} from "./services/workspace";
import type { Job, ProcessResult } from "./types";

async function processSingleJob(
  job: Job,
  env: Awaited<ReturnType<typeof loadEnv>>,
  client: LMStudioClient,
  model: Awaited<ReturnType<LMStudioClient["llm"]["model"]>>,
): Promise<ProcessResult> {
  let currentStep = "fetch_instagram_data";
  let workspacePath: string | null = null;
  let mediaType: ReturnType<typeof getMediaType> | null = null;

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
  console.log(`Saved ${jobs.length} links to notion_pages.json`);

  const completedPageIds: string[] = [];
  const failedPageIds: string[] = [];

  for (const [index, job] of jobs.entries()) {
    console.log(`Processing ${index + 1}/${jobs.length}: ${job.url}`);
    const result = await processSingleJob(job, env, client, model);

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
