import json
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
    video_path = sys.argv[1] if len(sys.argv) > 1 else "video.mp4"
    result = transcribe(video_path)

    transcription_text = result.get("text", "").strip()

    with open("transcription.json", "w") as f:
        json.dump(result, f, indent=2)
    print("Full transcription saved to transcription.json")

    with open("transcription.txt", "w") as f:
        f.write(transcription_text)
    print("Transcription text saved to transcription.txt")

    if transcription_text:
        print(f"\nTranscription:\n{transcription_text}")
    else:
        print("\nNo transcription text found (empty or silent video).")
