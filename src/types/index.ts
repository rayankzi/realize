import type { LMStudioClient } from "@lmstudio/sdk";

export type MediaType = "Static Post" | "Video";
export type LogStatus = "SUCCESS" | "FAILURE";

export interface EnvConfig {
  notionIntegrationToken: string;
  notionDatabaseId: string;
  userAgent: string;
  xIgAppId: string;
  lmStudioModelKey: string;
}

export interface NotionDatabaseQueryResponse {
  results?: NotionPage[];
  has_more?: boolean;
  next_cursor?: string | null;
}

export interface NotionPage {
  id: string;
  properties?: {
    URL?: {
      url?: string | null;
    };
  };
}

export interface NotionPagesFile {
  links: string[];
  page_ids: string[];
}

export interface Job {
  pageId: string;
  url: string;
}

export interface InstagramGraphqlEnvelope {
  data?: {
    xdt_shortcode_media?: InstagramMediaNode;
  };
}

export interface InstagramMediaNode {
  __typename?: string | null;
  shortcode?: string | null;
  dimensions?: Record<string, unknown> | null;
  display_url?: string | null;
  display_resources?: unknown[] | null;
  has_audio?: boolean | null;
  video_url?: string | null;
  video_view_count?: number | null;
  video_play_count?: number | null;
  is_video?: boolean | null;
  edge_media_to_caption?: {
    edges?: Array<{
      node?: {
        text?: string | null;
      };
    }>;
  } | null;
  is_paid_partnership?: boolean | null;
  location?: Record<string, unknown> | null;
  owner?: Record<string, unknown> | null;
  product_type?: string | null;
  video_duration?: number | null;
  thumbnail_src?: string | null;
  clips_music_attribution_info?: Record<string, unknown> | null;
  edge_sidecar_to_children?: {
    edges?: InstagramSidecarEdge[];
  } | null;
}

export interface InstagramSidecarEdge {
  node?: {
    display_url?: string | null;
  };
}

export interface InstagramMediaData {
  __typename: string | null;
  shortcode: string | null;
  dimensions: Record<string, unknown> | null;
  display_url: string | null;
  display_resources: unknown[] | null;
  has_audio: boolean | null;
  video_url: string | null;
  video_view_count: number | null;
  video_play_count: number | null;
  is_video: boolean | null;
  caption: string | null;
  is_paid_partnership: boolean | null;
  location: Record<string, unknown> | null;
  owner: Record<string, unknown> | null;
  product_type: string | null;
  video_duration: number | null;
  thumbnail_src: string | null;
  clips_music_attribution_info: Record<string, unknown> | null;
  sidecar: InstagramSidecarEdge[];
}

export interface PromptBundle {
  analyzePost: string;
  analyzeTranscription: string;
  analyzeVideo: string;
  analyzeFrames: string;
}

export interface ProcessSuccessResult {
  ok: true;
  pageId: string;
  url: string;
  mediaType: MediaType;
  workspacePath: string;
  outputPath: string;
  title: string | null;
}

export interface ProcessFailureResult {
  ok: false;
  pageId: string;
  url: string;
  mediaType: MediaType | null;
  workspacePath: string | null;
  step: string;
  errorMessage: string;
}

export type ProcessResult = ProcessSuccessResult | ProcessFailureResult;

export interface LogEntry {
  timestamp: string;
  status: LogStatus;
  event: "analysis_success" | "failure" | "run_failure" | "cleanup_failure";
  page_id: string | null;
  instagram_url: string | null;
  media_type: MediaType | null;
  workspace_path: string | null;
  output_path?: string | null;
  step?: string;
  error?: string;
  title?: string | null;
}

export interface AgentRunResult {
  finalText: string;
}

export interface AgentToolContext {
  workspaceDir: string;
  outputDir: string;
  allowWrite: boolean;
  allowRm: boolean;
}

export type LmStudioModel = Awaited<ReturnType<LMStudioClient["llm"]["model"]>>;
