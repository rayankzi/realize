import os
import sys
import uuid
import subprocess

from get_instagram_data import download_carousel_images


def analyze_post(data: dict) -> None:
    """Download Instagram post images and invoke the analyze-post skill."""
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_dir = os.path.join(project_root, "data")
    output_dir = os.path.join(data_dir, str(uuid.uuid4()))
    os.makedirs(output_dir, exist_ok=True)
    print(f"Created directory: {output_dir}")

    caption = data.get("caption")
    if caption:
        caption_path = os.path.join(output_dir, "captions.txt")
        with open(caption_path, "w") as f:
            f.write(caption)
        print(f"Caption saved to {caption_path}")

    typename = data.get("__typename", "")
    print(f"Detected: Post/Carousel ({typename})")
    sidecar = data.get("sidecar") or []
    download_carousel_images(sidecar, output_dir, data.get("display_url"))

    abs_dir = os.path.abspath(output_dir)
    print(f"\nInvoking analyze-post skill on {abs_dir}...")
    subprocess.run(
        ["claude", "-p", f"/analyze-post {abs_dir}", "--allowedTools", "Write,Bash,Read,Glob"],
        check=True,
    )


if __name__ == "__main__":
    print("Use run_analysis.py to analyze Instagram content.")
    sys.exit(1)
