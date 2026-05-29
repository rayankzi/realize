import { createClient, type Client } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "./schema";

/**
 * libSQL works against a local file today and a hosted Turso database later by
 * changing only `DATABASE_URL` (and adding `DATABASE_AUTH_TOKEN` for Turso) —
 * no application code changes required.
 */
const url = process.env.DATABASE_URL ?? "file:./data/realize.db";
const authToken = process.env.DATABASE_AUTH_TOKEN;

// Reuse the client across Next.js dev hot-reloads to avoid leaking connections.
const globalForDb = globalThis as unknown as {
  __libsqlClient?: Client;
  __db?: LibSQLDatabase<typeof schema>;
};

const client = globalForDb.__libsqlClient ?? createClient({ url, authToken });
if (process.env.NODE_ENV !== "production") globalForDb.__libsqlClient = client;

export const db =
  globalForDb.__db ?? drizzle(client, { schema, casing: "snake_case" });
if (process.env.NODE_ENV !== "production") globalForDb.__db = db;

export { schema };
