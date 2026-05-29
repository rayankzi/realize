from pathlib import Path
import subprocess
import sys


def _resolve_video_path(video_path: str) -> Path:
    raw_video = Path(video_path).expanduser()
    if raw_video.parent == Path("."):
        raise ValueError(f"Video path must include its UUID directory: {video_path}")

    video = raw_video.resolve()
    if not video.is_file():
        raise FileNotFoundError(f"Video file does not exist: {video}")

    return video


def extract_frames(video_path: str, output_dir: str, fps: int = 1) -> int:
    """Extract video frames at 1 frame per second using ffmpeg.

    Returns the number of frames extracted.
    """
    video = _resolve_video_path(video_path)
    reel_dir = video.parent
    expected_output_dir = reel_dir / "frames"
    frames_dir = Path(output_dir).expanduser().resolve()

    if frames_dir != expected_output_dir:
        raise ValueError(
            "Frame output directory must be the video file's sibling frames directory: "
            f"{expected_output_dir}. Received: {frames_dir}"
        )

    frames_dir.mkdir(exist_ok=True)

    cmd = [
        "ffmpeg",
        "-i",
        str(video),
        "-vf",
        f"fps={fps}",
        str(frames_dir / "frame_%04d.jpg"),
        "-y",
    ]

    print(f"Extracting frames from {video} at {fps} fps...")
    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode != 0:
        print(f"ffmpeg error: {result.stderr}")
        sys.exit(1)

    frame_count = len(list(frames_dir.glob("frame_*.jpg")))
    print(f"Extracted {frame_count} frames to {frames_dir}/")
    return frame_count
