import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

async function getTotalProjectsMade() {
  const res = await api.projects["total-projects-made"].$get();
  if (!res.ok) throw new Error("server error");
  const data = await res.json();
  return data;
}

function Index() {
  const { isPending, error, data } = useQuery({
    queryKey: ["get-total-projects-made"],
    queryFn: getTotalProjectsMade,
  });

  if (error) return "An error has occured";

  return (
    <Card className="w-[350px] m-auto">
      <CardHeader>
        <CardTitle>Total Projects Made</CardTitle>
        <CardDescription>The total projects you've made</CardDescription>
      </CardHeader>
      <CardContent>{isPending ? "..." : data.totalProjects}</CardContent>
    </Card>
  );
}
