import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { useForm } from "@tanstack/react-form";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { createProjectSchema } from "@server/sharedTypes";

export const Route = createLazyFileRoute(
  "/_authenticated/projects/create-project"
)({
  component: CreateProject,
});

interface CreateProject {
  name: string;
  description: string;
  difficulty: number;
}

function CreateProject() {
  const navigate = useNavigate();
  const form = useForm({
    validatorAdapter: zodValidator,
    defaultValues: {
      name: "",
      description: "",
      difficulty: 0,
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      const response = await api.projects.$post({ json: value });
      if (!response.ok) throw new Error("Server error");

      navigate({ to: "/projects" });
    },
  });

  return (
    <div className="p-2 max-w-xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="flex flex-col m-auto max-w-xl gap-y-4"
      >
        <form.Field
          name="name"
          validators={{
            onChange: createProjectSchema.shape.name,
          }}
          children={(field) => (
            <>
              <Label htmlFor={field.name}>Name</Label>
              <Input
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors ? (
                <em role="alert">{field.state.meta.errors.join(", ")}</em>
              ) : null}
            </>
          )}
        />
        <form.Field
          name="description"
          validators={{
            onChange: createProjectSchema.shape.description,
          }}
          children={(field) => (
            <>
              <Label htmlFor={field.name}>Description</Label>
              <Input
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors ? (
                <em role="alert">{field.state.meta.errors.join(", ")}</em>
              ) : null}
            </>
          )}
        />
        <form.Field
          name="difficulty"
          validators={{
            onChange: createProjectSchema.shape.difficulty,
          }}
          children={(field) => (
            <>
              <Label htmlFor={field.name}>Difficulty</Label>
              <Input
                id={field.name}
                type="range"
                min="1"
                max="5"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
              />
              {field.state.meta.errors ? (
                <em role="alert">{field.state.meta.errors.join(", ")}</em>
              ) : null}
            </>
          )}
        />
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button className="mt-4" type="submit" disabled={!canSubmit}>
              {isSubmitting ? "..." : "Submit"}
            </Button>
          )}
        />
      </form>
    </div>
  );
}
