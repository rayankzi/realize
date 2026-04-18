import { LMStudioClient } from "@lmstudio/sdk";

import { analyzeStaticPost, analyzeVideo } from "./agents/workflows";
import { formatUnknownError } from "./lib/errors";
import { prompts } from "./prompts";
import { loadEnv, loadWorkflowEnv } from "./services/config";
import { getInstagramGraphqlData, getMediaType } from "./services/instagram";
import { markPageDone } from "./services/notion";
import {
  appendLog,
  createWorkspace,
  writeCaptionFile,
} from "./services/workspace";
import type {
  EnvConfig,
  Job,
  ProcessFailureResult,
  ProcessResult,
  ProcessSuccessResult,
  WorkflowRuntimeContext,
} from "./types";

export function requireNotionEnv(
  env: WorkflowRuntimeContext["env"],
): EnvConfig {
  if (!env.notionIntegrationToken || !env.notionDatabaseId) {
    throw new Error("Notion credentials are not loaded in this runtime.");
  }

  return env as EnvConfig;
}

export async function createWorkflowRuntimeContext(options?: {
  requireNotion?: boolean;
}): Promise<WorkflowRuntimeContext> {
  const env = options?.requireNotion
    ? await loadEnv()
    : await loadWorkflowEnv({ requireNotion: false });
  const client = new LMStudioClient();
  const model = await client.llm.model(env.lmStudioModelKey);

  return {
    env,
    client,
    model,
    prompts,
  };
}

export async function processSingleJob(
  job: Job,
  runtime: WorkflowRuntimeContext,
): Promise<ProcessResult> {
  let currentStep = "fetch_instagram_data";
  let workspacePath: string | null = null;
  let mediaType: ReturnType<typeof getMediaType> | null = null;

  try {
    const media = await getInstagramGraphqlData(job.url, runtime.env);
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
        runtime.model,
        runtime.prompts,
        runtime.client,
      );
    } else {
      currentStep = "analyze_video";
      analysisResult = await analyzeVideo(
        media,
        workspacePath,
        runtime.model,
        runtime.prompts,
        runtime.client,
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

export async function logFailedJobResult(
  result: ProcessFailureResult,
): Promise<void> {
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
}

export async function logSuccessfulJobResult(
  result: ProcessSuccessResult,
): Promise<void> {
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
}

export async function markSuccessfulJobDone(
  result: ProcessSuccessResult,
  runtime: WorkflowRuntimeContext,
): Promise<void> {
  await markPageDone(result.pageId, requireNotionEnv(runtime.env));
}

export async function logRunFailure(error: unknown): Promise<void> {
  await appendLog({
    timestamp: new Date().toISOString(),
    status: "FAILURE",
    event: "run_failure",
    page_id: null,
    instagram_url: null,
    media_type: null,
    workspace_path: null,
    step: "main",
    error: formatUnknownError(error),
  });
}
