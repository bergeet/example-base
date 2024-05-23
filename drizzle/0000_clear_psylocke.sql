CREATE TABLE IF NOT EXISTS "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" varchar(256) NOT NULL,
	"difficulty" integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_index" ON "projects" ("user_id");