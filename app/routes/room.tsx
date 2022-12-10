import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);

  return {
    name: url.searchParams.get("name"),
  };
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      Your call here {data.name}
    </main>
  );
}
