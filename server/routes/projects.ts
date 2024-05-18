import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { getUser } from "../kinde";

import { db } from "../db";
import {
  projects as projectsTable,
  insertProjectSchema,
} from "../db/schema/projects";
import { desc, eq, sum } from "drizzle-orm";
import { createProjectSchema } from "../sharedTypes";

// This is a route that will be used in app.ts

export const projectsRoute = new Hono()
  .get("/", getUser, async (c) => {
    const projects = await db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.userId, c.var.user.id))
      .orderBy(desc(projectsTable.createdAt))
      .limit(10);

    return c.json({ projects: projects });
  })
  .post("/", getUser, zValidator("json", createProjectSchema), async (c) => {
    const data = c.req.valid("json");

    const validatedProject = insertProjectSchema.parse({
      userId: c.var.user.id,
      ...data,
    });

    const insertedProjet = await db
      .insert(projectsTable)
      .values(validatedProject);
    return c.json({ insertedProjet });
  })
  .get("/total-projects-made", getUser, async (c) => {
    const totalProjects = await db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.userId, c.var.user.id));
    return c.json({ totalProjects: totalProjects.length });
  })
  .get("/:id{[0-9]+}", getUser, async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const project = await db
      .select()
      .from(projectsTable)
      .where(
        eq(projectsTable.id, id) && eq(projectsTable.userId, c.var.user.id)
      );
    if (!project) {
      return c.notFound();
    }
    return c.json({ project });
  })
  .delete("/:id{[0-9]+}", getUser, async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const project = await db
      .delete(projectsTable)
      .where(
        eq(projectsTable.id, id) && eq(projectsTable.userId, c.var.user.id)
      )
      .returning()
      .then((res) => res[0]);

    if (!project) {
      return c.notFound();
    }

    return c.json(201);
  })
  .put(
    "/:id{[0-9]+}",
    getUser,
    zValidator("json", createProjectSchema),
    async (c) => {
      const id = Number.parseInt(c.req.param("id"));
      const project = await db
        .update(projectsTable)
        .set(c.req.valid("json"))
        .where(
          eq(projectsTable.id, id) && eq(projectsTable.userId, c.var.user.id)
        )
        .returning()
        .then((res) => res[0]);

      if (!project) {
        return c.notFound();
      }

      return c.json(201);
    }
  );
