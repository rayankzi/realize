# realize

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src/index.ts
```

To test the full workflow for one explicit Instagram URL and Notion page id:

```bash
WORKFLOW_TEST_URL="https://www.instagram.com/p/..." \
WORKFLOW_TEST_PAGE_ID="your-page-id" \
bun run test:single-workflow
```

To test just the summarizing workflow from one Instagram URL without using Notion at all:

```bash
WORKFLOW_TEST_URL="https://www.instagram.com/p/..." \
bun run test:summarize-only
```

This summarize-only test only needs the Instagram and LM Studio env vars. It uses a local placeholder page id and never marks anything done in Notion.

By default, the test does not mark the Notion page as done. To include that final mutation too:

```bash
WORKFLOW_TEST_URL="https://www.instagram.com/p/..." \
WORKFLOW_TEST_PAGE_ID="your-page-id" \
WORKFLOW_TEST_MARK_DONE=true \
bun run test:single-workflow
```

By default, temporary `data/` and `notion_pages.json` artifacts are cleaned up after the test. To inspect them afterward:

```bash
WORKFLOW_TEST_URL="https://www.instagram.com/p/..." \
WORKFLOW_TEST_PAGE_ID="your-page-id" \
WORKFLOW_TEST_SKIP_CLEANUP=true \
bun run test:single-workflow
```

This project was created using `bun init` in bun v1.2.22. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
