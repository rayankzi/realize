import { writeFile } from "node:fs/promises";

import { NOTION_PAGES_PATH } from "../lib/constants";
import { ensureResponseOk } from "../lib/errors";
import type {
  EnvConfig,
  Job,
  NotionDatabaseQueryResponse,
  NotionPage,
  NotionPagesFile,
} from "../types";

export async function fetchNotStartedPages(
  env: EnvConfig,
): Promise<NotionPage[]> {
  const url = `https://api.notion.com/v1/databases/${env.notionDatabaseId}/query`;
  const headers = {
    Authorization: `Bearer ${env.notionIntegrationToken}`,
    "Content-Type": "application/json",
    "Notion-Version": "2022-06-28",
  };
  const payload: {
    filter: {
      property: "Status";
      status: {
        equals: "Not started";
      };
    };
    start_cursor?: string;
  } = {
    filter: {
      property: "Status",
      status: {
        equals: "Not started",
      },
    },
  };

  const allResults: NotionPage[] = [];
  let hasMore = true;
  let nextCursor: string | null | undefined;

  while (hasMore) {
    if (nextCursor) {
      payload.start_cursor = nextCursor;
    } else {
      delete payload.start_cursor;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    await ensureResponseOk(response, "Notion database query");

    const data = (await response.json()) as NotionDatabaseQueryResponse;
    allResults.push(...(data.results ?? []));
    hasMore = data.has_more ?? false;
    nextCursor = data.next_cursor;
  }

  return allResults;
}

export async function writeNotionPagesJson(pages: NotionPage[]): Promise<Job[]> {
  const links: string[] = [];
  const pageIds: string[] = [];

  for (const page of pages) {
    const link = page.properties?.URL?.url;
    if (link) {
      links.push(link);
      pageIds.push(page.id);
    }
  }

  const payload: NotionPagesFile = { links, page_ids: pageIds };
  await writeFile(
    NOTION_PAGES_PATH,
    `${JSON.stringify(payload, null, 2)}\n`,
    "utf8",
  );

  return links.map((url, index) => ({
    pageId: pageIds[index] ?? "",
    url,
  }));
}

export async function markPageDone(
  pageId: string,
  env: EnvConfig,
): Promise<void> {
  const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${env.notionIntegrationToken}`,
      "Content-Type": "application/json",
      "Notion-Version": "2026-03-11",
    },
    body: JSON.stringify({
      properties: {
        Status: {
          status: {
            name: "Done",
          },
        },
      },
    }),
  });

  await ensureResponseOk(response, `Marking Notion page ${pageId} done`);
}
