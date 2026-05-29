import os
import json

import requests
from dotenv import load_dotenv


def fetch_not_started_pages() -> list:
    """Query a Notion database for all pages with status 'Not started'."""
    load_dotenv()

    notion_api_key = os.getenv("NOTION_INTEGRATION_TOKEN")
    database_id = os.getenv("NOTION_DATABASE_ID")

    if not notion_api_key:
        print("Error: NOTION_INTEGRATION_TOKEN not found in environment.")
        exit(1)
    if not database_id:
        print("Error: NOTION_DATABASE_ID not found in environment.")
        exit(1)

    print("Fetching pages with status 'Not started'...")

    url = f"https://api.notion.com/v1/databases/{database_id}/query"
    headers = {
        "Authorization": f"Bearer {notion_api_key}",
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
    }
    payload = {
        "filter": {
            "property": "Status",
            "status": {
                "equals": "Not started",
            },
        },
    }

    all_results = []
    has_more = True
    next_cursor = None

    while has_more:
        if next_cursor:
            payload["start_cursor"] = next_cursor

        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()

        all_results.extend(data.get("results", []))
        has_more = data.get("has_more", False)
        next_cursor = data.get("next_cursor")

    print(f"Found {len(all_results)} pages with status 'Not started'.")
    return all_results


def main():
    pages = fetch_not_started_pages()

    links = []
    page_ids = []
    for page in pages:
        url = page.get("properties", {}).get("URL", {}).get("url")
        if url:
            links.append(url)
            page_ids.append(page["id"])

    output_path = os.path.join(os.getcwd(), "notion_pages.json")
    with open(output_path, "w") as f:
        json.dump({"links": links, "page_ids": page_ids}, f, indent=2)

    print(f"Saved {len(links)} links to {output_path}")


if __name__ == "__main__":
    main()
