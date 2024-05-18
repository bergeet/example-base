import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createLazyFileRoute("/_authenticated/projects/")({
  component: Projects,
});

async function getProjects() {
  const res = await api.projects.$get();
  if (!res.ok) throw new Error("server error");
  const data = await res.json();
  return data;
}

function Projects() {
  const { isPending, error, data } = useQuery({
    queryKey: ["get-all-projects"],
    queryFn: getProjects,
  });

  if (error) return "An error has occured";

  return (
    <div className="p-2 max-w-3xl m-auto">
      <Table>
        <TableCaption>A list of your projects.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Descrption</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Created at</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending
            ? Array(2)
                .fill(0)
                .map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">
                      <Skeleton className=" h-4 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className=" h-4 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className=" h-4 rounded-full" />
                    </TableCell>
                  </TableRow>
                ))
            : data?.projects.map((project, i) => (
                <TableRow key={i}>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.description}</TableCell>
                  <TableCell>{project.difficulty}</TableCell>
                  <TableCell>
                    {project.createdAt.replace("T", " ").replace("Z", "")}
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
