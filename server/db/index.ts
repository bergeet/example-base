import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
// for migrations
// for query purposes
const queryClient = postgres(process.env.NEON_DB_CONNECTION_STRING!);
export const db = drizzle(queryClient);
