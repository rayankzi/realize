"""Single-document test for the Supermemory ingest pipeline.

Runs the full path (claude metadata -> Supermemory add -> log line) on ONE
document so you can validate end to end without looping the whole directory.

Usage:
    python scripts/memory/test_ingest.py [optional-filename.md]

Defaults to raw-docs/cs-origins-and-philosophy.md.
"""

import os
import sys

from supermemory import Supermemory

from ingest_docs import (
    CONTAINER_TAG,
    RAW_DOCS_DIR,
    SUPERMEMORY_API_KEY,
    SUPERMEMORY_BASE_URL,
    add_to_supermemory,
    get_metadata,
    log_line,
)

DEFAULT_DOC = "cs-origins-and-philosophy.md"


def main():
    filename = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_DOC
    path = os.path.join(RAW_DOCS_DIR, filename)
    if not os.path.exists(path):
        print(f"Document not found: {path}")
        sys.exit(1)

    with open(path, "r") as f:
        content = f.read()

    print(f"Getting metadata for {filename} via claude -p (haiku)...")
    meta = get_metadata(filename, content)
    print(f"  title:      {meta['title']}")
    print(f"  main_topic: {meta['main_topic']}")
    print(f"  subtopic:   {meta['subtopic']}")

    print(f"\nAdding to Supermemory (container tag: {CONTAINER_TAG})...")
    client = Supermemory(
        api_key=SUPERMEMORY_API_KEY, base_url=SUPERMEMORY_BASE_URL
    )
    resp = add_to_supermemory(
        client,
        content,
        meta["title"],
        meta["main_topic"],
        meta["subtopic"],
        filename,
    )
    print(f"  Supermemory response: {resp}")

    line = log_line(filename, meta["title"], meta["main_topic"], meta["subtopic"])
    print("\nLog line that would be written:")
    print(f"  {line}")


if __name__ == "__main__":
    main()
