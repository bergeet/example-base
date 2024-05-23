import { api, userQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_authenticated/profile")({
  component: Profile,
});

function Profile() {
  const { isPending, error, data } = useQuery(userQueryOptions);

  if (isPending) return "Loading...";

  if (error) return "not logged in";
  return (
    <div className="p-2">
      <p>Username: {data.user.email}</p>
      {data.user.picture && <img src={data.user.picture} alt="avatar" />}
      <a href="/api/logout">Logout</a>
    </div>
  );
}
