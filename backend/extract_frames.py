import os
import subprocess
import sys


def extract_frames(video_path: str, output_dir: str, fps: int = 1) -> int:
    """Extract video frames at 1 frame per second using ffmpeg.

    Returns the number of frames extracted.
    """
    os.makedirs(output_dir, exist_ok=True)

    cmd = [
        "ffmpeg",
        "-i", video_path,
        "-vf", f"fps={fps}",
        os.path.join(output_dir, "frame_%04d.jpg"),
        "-y",
    ]

    print(f"Extracting frames from {video_path} at {fps} fps...")
    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode != 0:
        print(f"ffmpeg error: {result.stderr}")
        sys.exit(1)

    frame_count = len([f for f in os.listdir(output_dir) if f.endswith(".jpg")])
    print(f"Extracted {frame_count} frames to {output_dir}/")
    return frame_count
