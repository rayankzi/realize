import os
import re
import json
import sys
import requests
from urllib.parse import urlencode
from dotenv import load_dotenv

load_dotenv()
_user_agent = os.getenv("USER_AGENT")
_x_ig_app_id = os.getenv("X_IG_APP_ID")
if not _user_agent or not _x_ig_app_id:
    print("Required headers not found in ENV")
    exit(1)


def get_id(url: str) -> str | None:
    """Get instagram post ID from URL string."""
    match = re.search(
        r"instagram\.com/(?:[A-Za-z0-9_.]+/)?(p|reels|reel|stories)/([A-Za-z0-9\-_]+)",
        url,
    )
    return match.group(2) if match else None


def get_instagram_graphql_data(url: str) -> dict | str:
    """Get instagram data from URL string."""
    ig_id = get_id(url)
    if not ig_id:
        return "Invalid URL"

    graphql_url = "https://www.instagram.com/api/graphql"
    params = {
        "variables": json.dumps({"shortcode": ig_id}),
        "doc_id": "10015901848480474",
        "lsd": "AVqbxe3J_YA",
    }
    headers = {
        "User-Agent": _user_agent,
        "Content-Type": "application/x-www-form-urlencoded",
        "X-IG-App-ID": _x_ig_app_id,
        "X-FB-LSD": "AVqbxe3J_YA",
        "X-ASBD-ID": "129477",
        "Sec-Fetch-Site": "same-origin",
    }

    response = requests.post(graphql_url, data=urlencode(params), headers=headers)
    data = response.json()
    items = data.get("data", {}).get("xdt_shortcode_media", {})

    caption_edges = items.get("edge_media_to_caption", {}).get("edges", [])
    caption = caption_edges[0]["node"]["text"] if caption_edges else None

    return {
        "__typename": items.get("__typename"),
        "shortcode": items.get("shortcode"),
        "dimensions": items.get("dimensions"),
        "display_url": items.get("display_url"),
        "display_resources": items.get("display_resources"),
        "has_audio": items.get("has_audio"),
        "video_url": items.get("video_url"),
        "video_view_count": items.get("video_view_count"),
        "video_play_count": items.get("video_play_count"),
        "is_video": items.get("is_video"),
        "caption": caption,
        "is_paid_partnership": items.get("is_paid_partnership"),
        "location": items.get("location"),
        "owner": items.get("owner"),
        "product_type": items.get("product_type"),
        "video_duration": items.get("video_duration"),
        "thumbnail_src": items.get("thumbnail_src"),
        "clips_music_attribution_info": items.get("clips_music_attribution_info"),
        "sidecar": items.get("edge_sidecar_to_children", {}).get("edges"),
    }


def download_video(video_url: str, filename: str = "video.mp4") -> str:
    """Download video to current directory."""
    print(f"Downloading video to {filename}...")
    response = requests.get(video_url, stream=True)
    response.raise_for_status()
    with open(filename, "wb") as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)
    print(f"Video saved to {filename}")
    return filename


def download_carousel_images(sidecar: list, display_url: str | None = None) -> str:
    """Download all images from a carousel post into an images/ folder."""
    os.makedirs("images", exist_ok=True)

    if not sidecar and display_url:
        print("Downloading single image...")
        response = requests.get(display_url, stream=True)
        response.raise_for_status()
        filepath = os.path.join("images", "image_1.jpg")
        with open(filepath, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"Saved {filepath}")
        return "images"

    for i, edge in enumerate(sidecar, 1):
        node = edge.get("node", {})
        img_url = node.get("display_url")
        if not img_url:
            continue
        print(f"Downloading image {i}/{len(sidecar)}...")
        response = requests.get(img_url, stream=True)
        response.raise_for_status()
        filepath = os.path.join("images", f"image_{i}.jpg")
        with open(filepath, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"Saved {filepath}")

    print(f"All images saved to images/")
    return "images"


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 get_instagram_data.py <instagram_url>")
        sys.exit(1)

    url = sys.argv[1]
    data = get_instagram_graphql_data(url)

    if isinstance(data, str):
        print(f"Error: {data}")
        sys.exit(1)

    with open("output.json", "w") as f:
        json.dump(data, f, indent=2)
    print("Data saved to output.json")

    is_video = data.get("is_video", False)
    typename = data.get("__typename", "")

    if is_video and data.get("video_url"):
        print(f"Detected: Reel/Video ({typename})")
        download_video(data["video_url"])
    else:
        print(f"Detected: Post/Carousel ({typename})")
        sidecar = data.get("sidecar") or []
        download_carousel_images(sidecar, data.get("display_url"))
