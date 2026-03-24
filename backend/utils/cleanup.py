import json
import os
import shutil

import requests
from dotenv import load_dotenv


def mark_pages_done(page_ids: list) -> None:
    """Mark each Notion page as 'Done' via the Notion API."""
    load_dotenv()

    notion_api_key = os.getenv("NOTION_INTEGRATION_TOKEN")
    if not notion_api_key:
        print("Error: NOTION_INTEGRATION_TOKEN not found in environment.")
        return

    headers = {
        "Authorization": f"Bearer {notion_api_key}",
        "Content-Type": "application/json",
        "Notion-Version": "2026-03-11",
    }
    payload = {
        "properties": {
            "Status": {
                "status": {
                    "name": "Done",
                },
            },
        },
    }

    for page_id in page_ids:
        url = f"https://api.notion.com/v1/pages/{page_id}"
        response = requests.patch(url, headers=headers, json=payload)
        response.raise_for_status()
        print(f"Marked page {page_id} as Done.")


def main():
    project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

    notion_pages_path = os.path.join(project_root, "notion_pages.json")
    if os.path.isfile(notion_pages_path):
        with open(notion_pages_path) as f:
            data = json.load(f)
        page_ids = data.get("page_ids", [])
        if page_ids:
            mark_pages_done(page_ids)
        else:
            print("No page_ids found in notion_pages.json.")

    data_dir = os.path.join(project_root, "data")
    if os.path.isdir(data_dir):
        shutil.rmtree(data_dir)
        print(f"Deleted {data_dir}")
    else:
        print("No data directory found.")

    if os.path.isfile(notion_pages_path):
        os.remove(notion_pages_path)
        print(f"Deleted {notion_pages_path}")
    else:
        print("No notion_pages.json found.")


if __name__ == "__main__":
    main()
