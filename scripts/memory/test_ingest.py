"""Small-batch test for the Supermemory ingest pipeline.

Runs the full ingest path (local-LLM metadata -> Supermemory add -> logs.txt ->
topics.json) on FIVE randomly chosen documents so you can validate end to end
without looping the whole directory. Metadata comes from gpt-oss-20b via
LMStudio, falling back to `claude -p haiku` if LMStudio is unavailable.

Already-logged documents (recorded in logs.txt) are excluded from the random
pick so re-runs exercise fresh files. Pass an integer to change the count.

Usage:
    python scripts/memory/test_ingest.py [count]   # default 5
"""

import os
import random
import sys
import time

from supermemory import Supermemory

from ingest_docs import (
    CONTAINER_TAG,
    LMSTUDIO_MODEL,
    LOG_PATH,
    RAW_DOCS_DIR,
    SUPERMEMORY_API_KEY,
    SUPERMEMORY_BASE_URL,
    add_to_supermemory,
    already_logged,
    format_known_topics,
    get_metadata,
    load_topics,
    log_line,
    save_topics,
    update_topics,
)

DEFAULT_COUNT = 5


def main():
    count = int(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_COUNT

    if not os.path.isdir(RAW_DOCS_DIR):
        print(f"raw-docs directory not found: {RAW_DOCS_DIR}")
        sys.exit(1)

    processed = already_logged()
    candidates = [
        f
        for f in os.listdir(RAW_DOCS_DIR)
        if f.endswith(".md") and f not in processed
    ]
    if not candidates:
        print("No unprocessed markdown files left to ingest.")
        sys.exit(0)

    sample = random.sample(candidates, min(count, len(candidates)))
    topics = load_topics()
    client = Supermemory(
        api_key=SUPERMEMORY_API_KEY, base_url=SUPERMEMORY_BASE_URL
    )

    total = len(sample)
    print(f"Picked {total} random docs from {len(candidates)} unprocessed files.")
    print(f"Metadata via LMStudio {LMSTUDIO_MODEL} (claude -p haiku fallback).")
    print(f"Container tag: {CONTAINER_TAG}\n")

    for i, filename in enumerate(sample, 1):
        print(f"[{i}/{total}] processing: {filename}")
        path = os.path.join(RAW_DOCS_DIR, filename)
        try:
            with open(path, "r") as f:
                content = f.read()

            meta = get_metadata(filename, content, format_known_topics(topics))
            print(f"    title:      {meta['title']}")
            print(f"    main_topic: {meta['main_topic']}")
            print(f"    subtopic:   {meta['subtopic']}")

            add_to_supermemory(
                client,
                content,
                meta["title"],
                meta["main_topic"],
                meta["subtopic"],
                filename,
            )

            line = log_line(
                filename, meta["title"], meta["main_topic"], meta["subtopic"]
            )
            with open(LOG_PATH, "a") as logf:
                logf.write(line + "\n")
            print(f"    logged: {line}")

            # Persist the taxonomy incrementally (mirrors the full ingest run).
            if update_topics(topics, meta["main_topic"], meta["subtopic"]):
                save_topics(topics)
                print(
                    f"    topics.json updated: "
                    f"{meta['main_topic']} -> {meta['subtopic']}"
                )
        except Exception as exc:  # keep going if one document fails
            print(f"    ERROR on {filename}: {exc}")

        # Be gentle on the local Supermemory server between documents.
        time.sleep(1)

    print("\nDone.")


if __name__ == "__main__":
    main()
