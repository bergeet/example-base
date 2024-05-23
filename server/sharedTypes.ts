import { z } from "zod";
import { insertProjectSchema } from "./db/schema/projects";

const projectSchema = insertProjectSchema.omit({
  createdAt: true,
  userId: true,
});

type Project = z.infer<typeof projectSchema>;

export const createProjectSchema = projectSchema.omit({ id: true });
