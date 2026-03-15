import os
import sys
import uuid
import subprocess

from get_instagram_data import (
    get_instagram_graphql_data,
    download_carousel_images,
)


def analyze_post(url: str) -> None:
    """Fetch Instagram post images and invoke the analyze-post skill."""
    data = get_instagram_graphql_data(url)

    if isinstance(data, str):
        print(f"Error: {data}")
        sys.exit(1)

    is_video = data.get("is_video", False)
    typename = data.get("__typename", "")

    if is_video:
        print(f"Error: This script only handles image posts/carousels, not videos ({typename}).")
        print("Use a separate reel analysis workflow for video content.")
        sys.exit(1)

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
    if len(sys.argv) < 2:
        print("Usage: python3 analyze_post.py <instagram_post_url>")
        sys.exit(1)

    analyze_post(sys.argv[1])
