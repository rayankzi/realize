import { defineConfig } from "drizzle-kit";

// `turso` dialect drives the libSQL driver, which works for both a local
// `file:` URL and a hosted Turso database.
export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "turso",
  casing: "snake_case",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "file:./data/realize.db",
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
});
