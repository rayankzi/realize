import os
import sys
import mlx_whisper


def transcribe(video_path: str = "video.mp4") -> dict:
    """Transcribe video using mlx-whisper with whisper-large-v3-turbo model."""
    print(f"Transcribing {video_path}...")
    result = mlx_whisper.transcribe(
        video_path,
        path_or_hf_repo="mlx-community/whisper-large-v3-turbo",
    )
    return result


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 transcribe_video.py <video_path>")
        sys.exit(1)

    video_path = sys.argv[1]
    result = transcribe(video_path)

    transcription_text = result.get("text", "").strip()

    output_dir = os.path.dirname(video_path)
    txt_path = os.path.join(output_dir, "transcription.txt") if output_dir else "transcription.txt"
    with open(txt_path, "w") as f:
        f.write(transcription_text)
    print(f"Transcription text saved to {txt_path}")

    if transcription_text:
        print(f"\nTranscription:\n{transcription_text}")
    else:
        print("\nNo transcription text found (empty or silent video).")
