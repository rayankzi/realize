import os
import subprocess
import sys


def extract_frames(video_path: str = "video.mp4", output_dir: str = "frames", fps: int = 1):
    """Extract video frames at 1 frame per second using ffmpeg."""
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


if __name__ == "__main__":
    video_path = sys.argv[1] if len(sys.argv) > 1 else "video.mp4"
    extract_frames(video_path)
