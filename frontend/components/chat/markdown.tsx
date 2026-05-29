"use client";

import { memo, useRef, useState, type TableHTMLAttributes } from "react";
import { Streamdown } from "streamdown";
import { createCodePlugin } from "@streamdown/code";
import { math } from "@streamdown/math";
import "katex/dist/katex.min.css";
import { Check, Copy, Download, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const code = createCodePlugin({
  themes: ["github-dark-default", "github-dark-default"],
});

type MarkdownTableProps = TableHTMLAttributes<HTMLTableElement> & {
  node?: unknown;
};

function getTableRows(table: HTMLTableElement) {
  return Array.from(table.rows).map((row) =>
    Array.from(row.cells).map((cell) => cell.textContent?.trim() ?? ""),
  );
}

function escapeMarkdownCell(cell: string) {
  return cell
    .replaceAll("\\", "\\\\")
    .replaceAll("|", "\\|")
    .replaceAll("\n", " ");
}

function tableToMarkdown(table: HTMLTableElement) {
  const rows = getTableRows(table);
  if (!rows.length) return "";

  const columnCount = Math.max(...rows.map((row) => row.length));
  const normalized = rows.map((row) =>
    Array.from({ length: columnCount }, (_, i) =>
      escapeMarkdownCell(row[i] ?? ""),
    ),
  );
  const [header, ...body] = normalized;
  const divider = Array.from({ length: columnCount }, () => "---");

  return [header, divider, ...body]
    .map((row) => `| ${row.join(" | ")} |`)
    .join("\n");
}

function tableToCsv(table: HTMLTableElement) {
  return getTableRows(table)
    .map((row) =>
      row
        .map((cell) => {
          const escaped = cell.replaceAll('"', '""');
          return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
        })
        .join(","),
    )
    .join("\n");
}

function MarkdownTable({
  children,
  className,
  node,
  ...props
}: MarkdownTableProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const tableRef = useRef<HTMLTableElement>(null);
  void node;

  function copyTable() {
    if (!tableRef.current) return;
    navigator.clipboard?.writeText(tableToMarkdown(tableRef.current));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  function downloadTable() {
    if (!tableRef.current) return;
    const blob = new Blob([tableToCsv(tableRef.current)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "table.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="hm-table-shell">
      <div className="hm-table-actions">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="text-muted-foreground"
              onClick={copyTable}
              aria-label="Copy table"
            >
              {copied ? <Check /> : <Copy />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy table</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="text-muted-foreground"
              onClick={downloadTable}
              aria-label="Download table"
            >
              <Download />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Download CSV</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="text-muted-foreground"
              onClick={() => setOpen(true)}
              aria-label="Expand table"
            >
              <Maximize2 />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Expand table</TooltipContent>
        </Tooltip>
      </div>
      <div className="hm-table-scroll">
        <table ref={tableRef} className={className} {...props}>
          {children}
        </table>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="hm-table-dialog" showCloseButton>
          <DialogTitle className="sr-only">Expanded table</DialogTitle>
          <div className="hm-table-dialog-scroll">
            <table className={className} {...props}>
              {children}
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const Markdown = memo(function Markdown({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <Streamdown
      className={cn("hm-prose", className)}
      components={{ table: MarkdownTable }}
      plugins={{ code, math }}
      controls={{
        code: { copy: true, download: false },
        table: { copy: false, download: false, fullscreen: false },
        mermaid: {
          copy: true,
          download: true,
          fullscreen: true,
          panZoom: true,
        },
      }}
      lineNumbers={true}
    >
      {children}
    </Streamdown>
  );
});
