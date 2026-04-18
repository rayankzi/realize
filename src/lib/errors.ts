export async function ensureResponseOk(
  response: Response,
  context: string,
): Promise<void> {
  if (response.ok) {
    return;
  }

  const body = await response.text();
  throw new Error(
    `${context} failed with ${response.status} ${response.statusText}: ${body}`,
  );
}

export function formatUnknownError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return JSON.stringify(error);
}

export function shellErrorDetails(error: unknown): string {
  if (!error || typeof error !== "object") {
    return formatUnknownError(error);
  }

  const shell = error as {
    message?: string;
    stderr?: string | Uint8Array;
    stdout?: string | Uint8Array;
  };

  const stderr =
    typeof shell.stderr === "string"
      ? shell.stderr
      : shell.stderr
        ? Buffer.from(shell.stderr).toString("utf8")
        : "";
  const stdout =
    typeof shell.stdout === "string"
      ? shell.stdout
      : shell.stdout
        ? Buffer.from(shell.stdout).toString("utf8")
        : "";

  return [formatUnknownError(error), stderr.trim(), stdout.trim()]
    .filter(Boolean)
    .join(" | ");
}
