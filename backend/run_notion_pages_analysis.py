import json
import subprocess
import time
from datetime import datetime
from pathlib import Path


SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent
NOTION_PAGES_PATH = REPO_ROOT / "notion_pages.json"
RUN_ANALYSIS_PATH = SCRIPT_DIR / "run_analysis.py"
LOG_PATH = SCRIPT_DIR / "internal-logs.txt"


def load_links():
    with NOTION_PAGES_PATH.open("r", encoding="utf-8") as file:
        data = json.load(file)

    links = data.get("links")
    if not isinstance(links, list):
        raise ValueError(f"{NOTION_PAGES_PATH} must contain a 'links' list.")

    invalid_links = [link for link in links if not isinstance(link, str) or not link.strip()]
    if invalid_links:
        raise ValueError("All entries in the 'links' list must be non-empty strings.")

    return links


def write_batch_header(log_file, total_links):
    started_at = datetime.now().isoformat(timespec="seconds")
    log_file.write("Batch Notion Pages Analysis\n")
    log_file.write(f"Started At: {started_at}\n")
    log_file.write(f"Total Links: {total_links}\n")
    log_file.write(f"Notion Pages File: {NOTION_PAGES_PATH}\n")
    log_file.write(f"Analysis Script: {RUN_ANALYSIS_PATH}\n")
    log_file.write("=" * 80 + "\n\n")


def write_run_log(log_file, index, total, url, command, started_at, duration, result):
    log_file.write("=" * 80 + "\n")
    log_file.write(f"Run: {index}/{total}\n")
    log_file.write(f"Timestamp: {started_at}\n")
    log_file.write(f"URL: {url}\n")
    log_file.write(f"Command: {' '.join(command)}\n")
    log_file.write(f"Duration Seconds: {duration:.2f}\n")
    log_file.write(f"Exit Code: {result.returncode}\n")
    log_file.write("-" * 80 + "\n")
    log_file.write("STDOUT:\n")
    log_file.write(result.stdout if result.stdout else "(empty)\n")
    if result.stdout and not result.stdout.endswith("\n"):
        log_file.write("\n")
    log_file.write("-" * 80 + "\n")
    log_file.write("STDERR:\n")
    log_file.write(result.stderr if result.stderr else "(empty)\n")
    if result.stderr and not result.stderr.endswith("\n"):
        log_file.write("\n")
    log_file.write("=" * 80 + "\n\n")
    log_file.flush()


def main():
    links = load_links()
    total = len(links)
    failures = 0


    with LOG_PATH.open("w", encoding="utf-8") as log_file:
        write_batch_header(log_file, total)

        for index, url in enumerate(links, start=1):
            command = ["python3", str(RUN_ANALYSIS_PATH), url]
            started_at = datetime.now().isoformat(timespec="seconds")
            print(f"[{index}/{total}] Running analysis for {url}")

            start_time = time.monotonic()
            result = subprocess.run(
                command,
                cwd=REPO_ROOT,
                capture_output=True,
                text=True,
            )
            duration = time.monotonic() - start_time

            if result.returncode != 0:
                failures += 1
                print(f"[{index}/{total}] Failed with exit code {result.returncode}")
            else:
                print(f"[{index}/{total}] Completed successfully")

            write_run_log(
                log_file=log_file,
                index=index,
                total=total,
                url=url,
                command=command,
                started_at=started_at,
                duration=duration,
                result=result,
            )

            if (index == 15):
                break

        finished_at = datetime.now().isoformat(timespec="seconds")
        log_file.write("Batch Complete\n")
        log_file.write(f"Finished At: {finished_at}\n")
        log_file.write(f"Total Links: {total}\n")
        log_file.write(f"Failures: {failures}\n")

    print(f"Batch complete. {total - failures}/{total} succeeded.")
    print(f"Logs written to {LOG_PATH}")

    if failures:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
