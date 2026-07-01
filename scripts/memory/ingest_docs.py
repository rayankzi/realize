"""Ingest every raw-docs markdown file into a local Supermemory instance.

For each document this script:
  1. Calls `claude -p --model haiku` to read the document and produce metadata
     (a clean title, a main topic, and a subtopic) as strict JSON.
  2. Adds the document to Supermemory (local, http://localhost:6767) under the
     container tag "project_realize" with that metadata attached.
  3. Appends a line to logs.txt recording the title, topic, and subtopic.
  4. Records the (main_topic, subtopic) pair in topics.json so future documents
     can reuse the existing taxonomy instead of inventing near-duplicates.

Documents in the same topic/subtopic may hold conflicting viewpoints; that is
fine -- everything is stored. Re-runs skip documents already recorded in logs.txt.
"""

import json
import os
import re
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
TOPICS_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "topics.json"
)

# Each log line is prefixed with [<filename>] so re-runs can detect prior work
# without disturbing the required human-readable sentence that follows.
LOG_PREFIX_FMT = "[{filename}] "

# Tagging prompt (formerly scripts/memory/prompt.md). The {known_topics},
# {filename}, and {content} placeholders are filled by _build_prompt via
# str.replace -- NOT str.format, because the prompt also contains literal JSON
# braces that str.format would try (and fail) to interpret.
PROMPT_TEMPLATE = """You are a document-tagging assistant. You read ONE document and produce metadata
for a memory system. Later, another AI searches this memory using meaning-based
(semantic) search to find documents and cite them. So tags must be clear, natural
category names a person might actually search for. Reusing the same tag for the
same idea keeps related documents grouped together.

Produce three fields:

1. title
   Clean, human-readable name. Title-case. No file extension.
   Example: "Setting Up a Local RAG Pipeline"

2. main_topic
   A BROAD, REUSABLE category, like a folder name MANY documents could share.
   1-3 words. Plain, natural words.
   Good: "Machine Learning" | "Personal Finance" | "Web Development"
   Too narrow (avoid): "ChromaDB vector store setup"

3. subtopic
   A more SPECIFIC area INSIDE the main_topic. 1-4 words. Still reusable.
   Machine Learning -> "Retrieval-Augmented Generation"
   Personal Finance -> "Tax Filing"

REUSE EXISTING TOPICS WHEN POSSIBLE.
Here are topics already in the memory system:
{known_topics}
(If this list is empty, just create new topics.)

Follow these steps:

1. Decide what the document is MAINLY about.
2. If a main_topic in the list fits, reuse it with the EXACT same wording.
   Then reuse a listed subtopic if one fits, or add a new short subtopic under it.
3. If no listed main_topic fits, create a NEW main_topic (broad and reusable) plus
   a subtopic, at the SAME level of generality as the examples in the list.

Rules:

- main_topic must be MORE GENERAL than subtopic.
- Keep both short (a few words). No full sentences.
- Tag the MAIN subject, not small side details.
- Prefer natural words people would search for, not codes or abbreviations.

OUTPUT FORMAT (very important):
Output STRICT JSON ONLY, on a single line. No explanation, no extra text, and NO
markdown code fences (do NOT write ```). Exactly these keys:
{"title": "...", "main_topic": "...", "subtopic": "..."}

Worked example (shows how to reuse the list):
Known topics:

- Web Development - Authentication - React
  Document: explains how to add Google login to a React app.
  Output:
  {"title": "Adding Google Login to a React App", "main_topic": "Web Development", "subtopic": "Authentication"}

More examples:
{"title": "Comparing Hash Map Implementations in Java", "main_topic": "Data Structures", "subtopic": "Hash Maps"}
{"title": "Notes on the Krebs Cycle", "main_topic": "Biology", "subtopic": "Cellular Respiration"}

Document filename: {filename}
Document content:

---

## {content}

Now output the JSON and nothing else."""


# --- Topic taxonomy (topics.json) -------------------------------------------


def load_topics() -> dict:
    """Return the {main_topic: [subtopics]} map from topics.json (or {})."""
    if not os.path.exists(TOPICS_PATH):
        return {}
    try:
        with open(TOPICS_PATH, "r") as f:
            data = json.load(f)
        return data if isinstance(data, dict) else {}
    except (json.JSONDecodeError, OSError):
        return {}


def save_topics(topics: dict) -> None:
    with open(TOPICS_PATH, "w") as f:
        json.dump(topics, f, indent=2, sort_keys=True)
        f.write("\n")


def format_known_topics(topics: dict) -> str:
    """Render the topics map into the '- Topic - Subtopic' bullet lines the
    prompt's worked example expects. Empty string when there are no topics."""
    lines = []
    for main_topic in sorted(topics):
        for subtopic in topics[main_topic]:
            lines.append(f"- {main_topic} - {subtopic}")
    return "\n".join(lines)


def update_topics(topics: dict, main_topic: str, subtopic: str) -> bool:
    """Record (main_topic, subtopic). Returns True if topics changed.

    Matching is case-insensitive so we don't create near-duplicate buckets that
    differ only in capitalization; the first-seen wording is kept.
    """
    main_topic = main_topic.strip()
    subtopic = subtopic.strip()
    if not main_topic or not subtopic:
        return False
    key = next(
        (k for k in topics if k.lower() == main_topic.lower()), main_topic
    )
    subs = topics.setdefault(key, [])
    if any(s.lower() == subtopic.lower() for s in subs):
        return False
    subs.append(subtopic)
    return True


# --- Metadata via claude -p -------------------------------------------------


def _build_prompt(filename: str, content: str, known_topics: str = "") -> str:
    return (
        PROMPT_TEMPLATE.replace("{known_topics}", known_topics)
        .replace("{filename}", filename)
        .replace("{content}", content)
    )


def _extract_json(text: str) -> dict:
    """Pull the JSON object out of the model's text response, tolerating fences."""
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


def _call_claude(prompt: str) -> str:
    """Call `claude -p --model haiku` and return the model's text."""
    result = subprocess.run(
        ["claude", "-p", prompt, "--model", "haiku", "--output-format", "json"],
        capture_output=True,
        text=True,
        check=True,
    )
    # --output-format json wraps Claude's reply in an object whose `result`
    # field holds the model's text. That text is the JSON we asked for.
    wrapper = json.loads(result.stdout)
    return wrapper.get("result", result.stdout)


def get_metadata(filename: str, content: str, known_topics: str = "") -> dict:
    """Call `claude -p --model haiku` and return {title, main_topic, subtopic}."""
    prompt = _build_prompt(filename, content, known_topics)
    meta = _extract_json(_call_claude(prompt))
    return {
        "title": str(meta["title"]).strip(),
        "main_topic": str(meta["main_topic"]).strip(),
        "subtopic": str(meta["subtopic"]).strip(),
    }


# --- Supermemory ------------------------------------------------------------


def to_custom_id(filename: str) -> str:
    """Turn a filename into a Supermemory-safe custom_id.

    Supermemory only allows alphanumerics, hyphens, underscores, and colons in
    customId, so the ".md" extension (and any other illegal character) is
    rejected with a 400. Drop the extension and replace anything illegal with an
    underscore; the original filename is still kept in metadata via source_file.
    """
    stem = os.path.splitext(filename)[0]
    return re.sub(r"[^A-Za-z0-9_:-]", "_", stem)


def add_to_supermemory(client, content, title, main_topic, subtopic, filename):
    return client.add(
        content=content,
        container_tag=CONTAINER_TAG,
        custom_id=to_custom_id(filename),  # dedup / update key
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
    topics = load_topics()
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

            meta = get_metadata(filename, content, format_known_topics(topics))
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

            # Persist the taxonomy incrementally so a mid-run crash keeps progress.
            if update_topics(topics, meta["main_topic"], meta["subtopic"]):
                save_topics(topics)
        except Exception as exc:  # keep going if one document fails
            print(f"    ERROR on {filename}: {exc}")

        # Be gentle on the local Supermemory server between documents.
        time.sleep(1)

    print("Done.")


if __name__ == "__main__":
    main()
