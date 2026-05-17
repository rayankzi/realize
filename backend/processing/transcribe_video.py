from pathlib import Path
import mlx_whisper


def _resolve_video_path(video_path: str) -> Path:
    raw_video = Path(video_path).expanduser()
    if raw_video.parent == Path("."):
        raise ValueError(f"Video path must include its UUID directory: {video_path}")

    video = raw_video.resolve()
    if not video.is_file():
        raise FileNotFoundError(f"Video file does not exist: {video}")

    return video


def transcribe(video_path: str = "video.mp4") -> dict:
    """Transcribe video using mlx-whisper with whisper-large-v3-turbo model."""
    video = _resolve_video_path(video_path)

    print(f"Transcribing {video}...")
    result = mlx_whisper.transcribe(
        str(video),
        path_or_hf_repo="mlx-community/whisper-large-v3-turbo",
    )
    return result


def transcribe_and_save(video_path: str) -> str:
    """Transcribe video and save the text to a file. Returns the output path."""
    video = _resolve_video_path(video_path)

    result = transcribe(str(video))
    transcription_text = result.get("text", "").strip()

    txt_path = video.parent / "transcription.txt"
    with txt_path.open("w") as f:
        f.write(transcription_text)
    print(f"Transcription text saved to {txt_path}")

    return str(txt_path)
