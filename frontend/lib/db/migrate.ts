import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";

/**
 * Applies the generated SQL migrations in ./drizzle to the local database.
 * Run with `bun run db:migrate` after `bun run db:generate`.
 */
async function main() {
  const url = process.env.DATABASE_URL ?? "file:./data/realize.db";
  const authToken = process.env.DATABASE_AUTH_TOKEN;

  const client = createClient({ url, authToken });
  const db = drizzle(client);

  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("✓ migrations applied");
  client.close();
}

main().catch((err) => {
  console.error("migration failed:", err);
  process.exit(1);
});
