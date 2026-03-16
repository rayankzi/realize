import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fetchers.get_instagram_data import get_instagram_graphql_data
from analysis.analyze_video import analyze_video
from analysis.analyze_post import analyze_post


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 run_analysis.py <instagram_url>")
        sys.exit(1)

    url = sys.argv[1]
    data = get_instagram_graphql_data(url)

    if isinstance(data, str):
        print(f"Error: {data}")
        sys.exit(1)

    if data.get("video_url"):
        print("Detected video reel.")
        analyze_video(data)
    else:
        print("Detected image post/carousel.")
        analyze_post(data)


if __name__ == "__main__":
    main()
