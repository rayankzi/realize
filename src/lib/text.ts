export function parseCommand(command: string): string[] {
  const tokens = command.match(/"[^"]*"|'[^']*'|\S+/gu) ?? [];
  return tokens.map((token) => {
    if (
      (token.startsWith('"') && token.endsWith('"')) ||
      (token.startsWith("'") && token.endsWith("'"))
    ) {
      return token.slice(1, -1);
    }

    return token;
  });
}

export function slugifyTitle(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/gu, "-")
      .replace(/^-+|-+$/gu, "")
      .replace(/-{2,}/gu, "-")
      .split("-")
      .filter(Boolean)
      .slice(0, 5)
      .join("-") || "analysis"
  );
}

export function extractTitle(markdown: string): string | null {
  const match = markdown.match(/^#\s+(.+)$/mu);
  return match?.[1]?.trim() ?? null;
}
