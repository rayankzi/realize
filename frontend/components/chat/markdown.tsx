"use client";

import { memo } from "react";
import { Streamdown } from "streamdown";
import { cn } from "@/lib/utils";

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
      shikiTheme={["github-dark-default", "github-dark-default"]}
    >
      {children}
    </Streamdown>
  );
});
