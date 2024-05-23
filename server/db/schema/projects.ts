import {
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable(
  "projects",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 256 }).notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    description: varchar("description", { length: 256 }).notNull(),
    difficulty: integer("difficulty").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (projects) => {
    return {
      userIdIndex: index("user_id_index").on(projects.userId),
    };
  }
);

export const insertProjectSchema = createInsertSchema(projects, {
  id: z.number(),
  name: z
    .string()
    .min(1, { message: "Must be at least 1 character" })
    .max(40, { message: "Must be at most 40 characters" }),
  description: z
    .string()
    .min(1, { message: "Must be at least 1 character" })
    .max(256, { message: "Must be at most 256 characters" }),
  difficulty: z
    .number()
    .min(1, { message: "Minimum value is 1" })
    .max(5, { message: "Maximum value is 5" }),
});

export const selectExpensesSchema = createSelectSchema(projects);
