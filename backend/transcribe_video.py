import os
import mlx_whisper


def transcribe(video_path: str = "video.mp4") -> dict:
    """Transcribe video using mlx-whisper with whisper-large-v3-turbo model."""
    print(f"Transcribing {video_path}...")
    result = mlx_whisper.transcribe(
        video_path,
        path_or_hf_repo="mlx-community/whisper-large-v3-turbo",
    )
    return result


def transcribe_and_save(video_path: str) -> str:
    """Transcribe video and save the text to a file. Returns the output path."""
    result = transcribe(video_path)
    transcription_text = result.get("text", "").strip()

    output_dir = os.path.dirname(video_path)
    txt_path = os.path.join(output_dir, "transcription.txt") if output_dir else "transcription.txt"
    with open(txt_path, "w") as f:
        f.write(transcription_text)
    print(f"Transcription text saved to {txt_path}")

    return txt_path
