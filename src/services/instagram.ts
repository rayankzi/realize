import { writeFile } from "node:fs/promises";
import path from "node:path";

import { ensureResponseOk } from "../lib/errors";
import type {
  EnvConfig,
  InstagramGraphqlEnvelope,
  InstagramMediaData,
  InstagramSidecarEdge,
  MediaType,
} from "../types";

function getInstagramId(url: string): string | null {
  const match = url.match(
    /instagram\.com\/(?:[A-Za-z0-9_.]+\/)?(p|reels|reel|stories)\/([A-Za-z0-9\-_]+)/u,
  );
  return match?.[2] ?? null;
}

export async function getInstagramGraphqlData(
  url: string,
  env: EnvConfig,
): Promise<InstagramMediaData> {
  const igId = getInstagramId(url);
  if (!igId) {
    throw new Error("Invalid Instagram URL.");
  }

  const params = new URLSearchParams({
    variables: JSON.stringify({ shortcode: igId }),
    doc_id: "10015901848480474",
    lsd: "AVqbxe3J_YA",
  });

  const response = await fetch("https://www.instagram.com/api/graphql", {
    method: "POST",
    headers: {
      "User-Agent": env.userAgent,
      "Content-Type": "application/x-www-form-urlencoded",
      "X-IG-App-ID": env.xIgAppId,
      "X-FB-LSD": "AVqbxe3J_YA",
      "X-ASBD-ID": "129477",
      "Sec-Fetch-Site": "same-origin",
    },
    body: params.toString(),
  });
  await ensureResponseOk(response, "Instagram GraphQL fetch");

  const data = (await response.json()) as InstagramGraphqlEnvelope;
  const items = data.data?.xdt_shortcode_media;
  if (!items) {
    throw new Error("Instagram response did not include xdt_shortcode_media.");
  }

  const captionEdges = items.edge_media_to_caption?.edges ?? [];
  const caption = captionEdges[0]?.node?.text ?? null;

  return {
    __typename: items.__typename ?? null,
    shortcode: items.shortcode ?? null,
    dimensions: items.dimensions ?? null,
    display_url: items.display_url ?? null,
    display_resources: items.display_resources ?? null,
    has_audio: items.has_audio ?? null,
    video_url: items.video_url ?? null,
    video_view_count: items.video_view_count ?? null,
    video_play_count: items.video_play_count ?? null,
    is_video: items.is_video ?? null,
    caption,
    is_paid_partnership: items.is_paid_partnership ?? null,
    location: items.location ?? null,
    owner: items.owner ?? null,
    product_type: items.product_type ?? null,
    video_duration: items.video_duration ?? null,
    thumbnail_src: items.thumbnail_src ?? null,
    clips_music_attribution_info: items.clips_music_attribution_info ?? null,
    sidecar: items.edge_sidecar_to_children?.edges ?? [],
  };
}

async function downloadToFile(
  url: string,
  destinationPath: string,
): Promise<void> {
  const response = await fetch(url);
  await ensureResponseOk(response, `Downloading ${url}`);
  const arrayBuffer = await response.arrayBuffer();
  await writeFile(destinationPath, Buffer.from(arrayBuffer));
}

export async function downloadVideo(
  videoUrl: string,
  outputDir: string,
): Promise<string> {
  const urlWithoutQuery = videoUrl.split("?")[0] ?? videoUrl;
  const fileNameCandidate = urlWithoutQuery.split("/").pop() ?? "video";
  const hasExtension = fileNameCandidate.includes(".");
  const ext = hasExtension
    ? (fileNameCandidate.split(".").pop() ?? "mp4")
    : "mp4";
  const filePath = path.join(outputDir, `video.${ext}`);
  await downloadToFile(videoUrl, filePath);
  return filePath;
}

export async function downloadCarouselImages(
  sidecar: InstagramSidecarEdge[],
  outputDir: string,
  displayUrl: string | null,
): Promise<string[]> {
  const savedPaths: string[] = [];

  if ((!sidecar || sidecar.length === 0) && displayUrl) {
    const destinationPath = path.join(outputDir, "image_1.jpg");
    await downloadToFile(displayUrl, destinationPath);
    savedPaths.push(destinationPath);
    return savedPaths;
  }

  let index = 1;
  for (const edge of sidecar) {
    const imageUrl = edge.node?.display_url;
    if (!imageUrl) {
      continue;
    }

    const destinationPath = path.join(outputDir, `image_${index}.jpg`);
    await downloadToFile(imageUrl, destinationPath);
    savedPaths.push(destinationPath);
    index += 1;
  }

  return savedPaths;
}

export function getMediaType(media: InstagramMediaData): MediaType {
  return media.video_url ? "Video" : "Static Post";
}
