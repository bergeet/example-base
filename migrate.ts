import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
// for migrations
const migrationClient = postgres(process.env.NEON_DB_CONNECTION_STRING!, {
  max: 1,
});
await migrate(drizzle(migrationClient), { migrationsFolder: "./drizzle" });
console.log("migration complete");
