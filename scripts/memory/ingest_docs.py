"""Ingest every raw-docs markdown file into a local Supermemory instance.

For each document this script:
  1. Calls `claude -p --model haiku` to read the document and produce metadata
     (a clean title, a main topic, and a subtopic) as strict JSON.
  2. Adds the document to Supermemory (local, http://localhost:6767) under the
     container tag "project_realize" with that metadata attached.
  3. Appends a line to logs.txt recording the title, topic, and subtopic.

Documents in the same topic/subtopic may hold conflicting viewpoints; that is
fine -- everything is stored. Re-runs skip documents already recorded in logs.txt.
"""

import json
import os
import subprocess
import sys
import time

from supermemory import Supermemory

# --- Config -----------------------------------------------------------------

SUPERMEMORY_API_KEY = (
    "sm_HRWiyAnW1onp6dfMm8qAyk_Bxh4vYUxAKsJC8qPbYvjKiC9NQbRzpyS4ABLKDR72R8UDIgAhXMKMzU5eoskYY3l"
)
SUPERMEMORY_BASE_URL = "http://localhost:6767"
CONTAINER_TAG = "project_realize"

# memory/ -> scripts/ -> project root
PROJECT_ROOT = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)
RAW_DOCS_DIR = os.path.join(PROJECT_ROOT, "raw-docs")
LOG_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "logs.txt")

# Each log line is prefixed with [<filename>] so re-runs can detect prior work
# without disturbing the required human-readable sentence that follows.
LOG_PREFIX_FMT = "[{filename}] "


# --- Metadata via claude -p -------------------------------------------------


def _build_prompt(filename: str, content: str) -> str:
    return f"""You are tagging a document for a larger memory system.

This metadata powers retrieval: later, an AI will look up stored documents by
their topic and subtopic to answer questions and make citations. So the
"main_topic" should be a GENERAL, reusable category (something many documents
could share), and the "subtopic" should be a more SPECIFIC area within that
topic. Keep both concise (a few words each). The "title" should be a clean,
human-readable title for the document.

Read the document below (filename: {filename}) and respond with STRICT JSON ONLY
-- no prose, no markdown fences -- in exactly this shape:
{{"title": "...", "main_topic": "...", "subtopic": "..."}}

Document:
---
{content}
---"""


def _extract_json(text: str) -> dict:
    """Pull the JSON object out of Claude's text response, tolerating fences."""
    text = text.strip()
    if text.startswith("```"):
        # Strip a leading ```json / ``` fence and trailing ```
        text = text.split("\n", 1)[1] if "\n" in text else text
        if text.endswith("```"):
            text = text[: -len("```")]
        text = text.strip()
    # Fall back to slicing between the first { and last } if there is extra text.
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1 and end > start:
            return json.loads(text[start : end + 1])
        raise


def get_metadata(filename: str, content: str) -> dict:
    """Call `claude -p --model haiku` and return {title, main_topic, subtopic}."""
    prompt = _build_prompt(filename, content)
    result = subprocess.run(
        ["claude", "-p", prompt, "--model", "haiku", "--output-format", "json"],
        capture_output=True,
        text=True,
        check=True,
    )
    # --output-format json wraps Claude's reply in an object whose `result`
    # field holds the model's text. That text is the JSON we asked for.
    wrapper = json.loads(result.stdout)
    inner_text = wrapper.get("result", result.stdout)
    meta = _extract_json(inner_text)
    return {
        "title": str(meta["title"]).strip(),
        "main_topic": str(meta["main_topic"]).strip(),
        "subtopic": str(meta["subtopic"]).strip(),
    }


# --- Supermemory ------------------------------------------------------------


def add_to_supermemory(client, content, title, main_topic, subtopic, filename):
    return client.add(
        content=content,
        container_tag=CONTAINER_TAG,
        custom_id=filename,  # dedup / update key
        metadata={
            "title": title,
            "main_topic": main_topic,
            "subtopic": subtopic,
            "source_file": filename,
        },
    )


# --- Logging / resume -------------------------------------------------------


def log_line(filename, title, main_topic, subtopic) -> str:
    return (
        LOG_PREFIX_FMT.format(filename=filename)
        + f'"{title}" was added into the supermemory context '
        + f"with topic {main_topic} and subtopic {subtopic}"
    )


def already_logged() -> set:
    """Return the set of filenames already recorded in logs.txt (for resume)."""
    processed = set()
    if not os.path.exists(LOG_PATH):
        return processed
    with open(LOG_PATH, "r") as f:
        for line in f:
            line = line.strip()
            if line.startswith("[") and "]" in line:
                processed.add(line[1 : line.index("]")])
    return processed


# --- Main -------------------------------------------------------------------


def main():
    if not os.path.isdir(RAW_DOCS_DIR):
        print(f"raw-docs directory not found: {RAW_DOCS_DIR}")
        sys.exit(1)

    client = Supermemory(
        api_key=SUPERMEMORY_API_KEY, base_url=SUPERMEMORY_BASE_URL
    )

    files = sorted(f for f in os.listdir(RAW_DOCS_DIR) if f.endswith(".md"))
    processed = already_logged()
    total = len(files)
    print(f"Found {total} markdown files; {len(processed)} already logged.")

    for i, filename in enumerate(files, 1):
        if filename in processed:
            print(f"[{i}/{total}] skip (already logged): {filename}")
            continue

        print(f"[{i}/{total}] processing: {filename}")
        path = os.path.join(RAW_DOCS_DIR, filename)
        try:
            with open(path, "r") as f:
                content = f.read()

            meta = get_metadata(filename, content)
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
            print(f"    {line}")
        except Exception as exc:  # keep going if one document fails
            print(f"    ERROR on {filename}: {exc}")

        # Be gentle on the local Supermemory server between documents.
        time.sleep(1)

    print("Done.")


if __name__ == "__main__":
    main()
