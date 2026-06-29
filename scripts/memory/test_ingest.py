"""Single-document test for the Supermemory ingest pipeline.

Runs the full path (local-LLM metadata -> Supermemory add -> log line ->
topics.json) on ONE document so you can validate end to end without looping the
whole directory. Metadata comes from gpt-oss-20b via LMStudio, falling back to
`claude -p haiku` if LMStudio is unavailable.

Usage:
    python scripts/memory/test_ingest.py [optional-filename.md]

Defaults to raw-docs/cs-origins-and-philosophy.md.
"""

import os
import sys

from supermemory import Supermemory

from ingest_docs import (
    CONTAINER_TAG,
    LMSTUDIO_MODEL,
    RAW_DOCS_DIR,
    SUPERMEMORY_API_KEY,
    SUPERMEMORY_BASE_URL,
    add_to_supermemory,
    format_known_topics,
    get_metadata,
    load_topics,
    log_line,
    save_topics,
    update_topics,
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

    topics = load_topics()
    print(f"Getting metadata for {filename} via LMStudio {LMSTUDIO_MODEL} "
          "(claude -p haiku fallback)...")
    meta = get_metadata(filename, content, format_known_topics(topics))
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

    # Record the tag into topics.json (mirrors the full ingest run).
    if update_topics(topics, meta["main_topic"], meta["subtopic"]):
        save_topics(topics)
        print(f"\ntopics.json updated: {meta['main_topic']} -> {meta['subtopic']}")
    else:
        print("\ntopics.json unchanged (tag already present).")


if __name__ == "__main__":
    main()
