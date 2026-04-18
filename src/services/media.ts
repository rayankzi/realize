import { $ } from "bun";

import { WHISPER_MODEL } from "../lib/constants";
import { shellErrorDetails } from "../lib/errors";
import { ensureDir, listFilesMatching } from "../lib/files";

export async function transcribeVideoWithMlxWhisper(
  videoPath: string,
  workspacePath: string,
): Promise<string> {
  try {
    await $`mlx_whisper ${videoPath} --model ${WHISPER_MODEL} --output-dir ${workspacePath} --output-format txt --output-name transcription --verbose False`.quiet();
  } catch (error) {
    throw new Error(`MLX Whisper CLI failed: ${shellErrorDetails(error)}`);
  }

  const transcriptionPath = `${workspacePath}/transcription.txt`;
  const file = Bun.file(transcriptionPath);
  const transcriptionText = (await file.text()).trim();
  await Bun.write(transcriptionPath, transcriptionText);
  return transcriptionPath;
}

export async function extractFrames(
  videoPath: string,
  outputDir: string,
  fps = 1,
): Promise<string[]> {
  await ensureDir(outputDir);

  try {
    await $`ffmpeg -i ${videoPath} -vf fps=${fps} ${outputDir}/frame_%04d.jpg -y`.quiet();
  } catch (error) {
    throw new Error(
      `ffmpeg frame extraction failed: ${shellErrorDetails(error)}`,
    );
  }

  return listFilesMatching(outputDir, "*.jpg");
}
