import os
import sys
import uuid
import subprocess

from get_instagram_data import get_instagram_graphql_data, download_video
from transcribe_video import transcribe_and_save
from extract_frames import extract_frames


def analyze_video(url: str) -> None:
    """Fetch Instagram reel data, transcribe, optionally extract frames, and invoke the analyze-video skill."""
    data = get_instagram_graphql_data(url)

    if isinstance(data, str):
        print(f"Error: {data}")
        sys.exit(1)

    is_video = data.get("is_video", False)
    if not is_video:
        print("Error: This script only handles video reels, not image posts/carousels.")
        print("Use analyze_post.py for image content.")
        sys.exit(1)

    video_url = data.get("video_url")
    if not video_url:
        print("Error: No video URL found in the post data.")
        sys.exit(1)

    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_dir = os.path.join(project_root, "data")
    output_dir = os.path.join(data_dir, str(uuid.uuid4()))
    os.makedirs(output_dir, exist_ok=True)
    print(f"Created directory: {output_dir}")

    # Save caption
    caption = data.get("caption")
    if caption:
        caption_path = os.path.join(output_dir, "captions.txt")
        with open(caption_path, "w") as f:
            f.write(caption)
        print(f"Caption saved to {caption_path}")

    # Download video
    video_path = download_video(video_url, output_dir)

    # Transcribe video
    transcription_path = transcribe_and_save(video_path)

    # Read transcription to check if it's empty
    with open(transcription_path, "r") as f:
        transcription_text = f.read().strip()

    needs_frames = False

    if not transcription_text:
        # Empty transcription — frames are needed for any analysis
        print("Transcription is empty. Frame extraction required.")
        needs_frames = True
    else:
        # Use analyze-transcription skill to check for visual dependency
        print("Checking transcription for visual dependency cues...")
        result = subprocess.run(
            [
                "claude",
                "-p",
                f"/analyze-transcription {transcription_path}",
                "--allowedTools", "Read",
            ],
            capture_output=True,
            text=True,
        )
        response = result.stdout
        print(response)

        if "YES" in response:
            print("Visual cues detected. Frame extraction required.")
            needs_frames = True
        else:
            print("No visual dependency detected. Skipping frame extraction.")

    # Extract frames if needed
    if needs_frames:
        frames_dir = os.path.join(output_dir, "frames")
        extract_frames(video_path, frames_dir)

    # Invoke analyze-video skill
    abs_dir = os.path.abspath(output_dir)
    print(f"\nInvoking analyze-video skill on {abs_dir}...")
    subprocess.run(
        ["claude", "-p", f"/analyze-video {abs_dir}", "--allowedTools", "Write,Bash,Read,Glob"],
        check=True,
    )


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 analyze_video.py <instagram_reel_url>")
        sys.exit(1)

    analyze_video(sys.argv[1])
