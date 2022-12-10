import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { ClientOnly } from "remix-utils";
import Call from "../components/call/index.client";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);

  return {
    name: url.searchParams.get("name"),
  };
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  console.log(data);

  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <ClientOnly>{() => <Call />}</ClientOnly>
    </main>
  );
}
