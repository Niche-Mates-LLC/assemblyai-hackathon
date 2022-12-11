import { useState, useEffect } from "react";
import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { ClientOnly } from "remix-utils";
import Call from "~/components/call/index.client";
import Sidebar from "~/components/sidebar";

const PERSONALITY_API_KEY = "chrexec_6d61c717981abc3eb993d3535dca2e7b";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  const role = url.searchParams.get("role");

  const { twitterHandle, linkedinHandle } = await (
    await fetch(`http://localhost:3000/api/profile?email=${email}`)
  ).json();

  return {
    name: url.searchParams.get("name"),
    twitterHandle,
    linkedinHandle,
    role,
  };
};

export default function Index() {
  const { name, twitterHandle, linkedinHandle, role } =
    useLoaderData<typeof loader>();
  const [advice, setAdvice] = useState();
  const [uid] = useState(() => {
    if (twitterHandle) {
      return twitterHandle;
    } else if (linkedinHandle) {
      return linkedinHandle;
    } else {
      return name;
    }
  });

  const createPersonalityProfile = async () => {
    await fetch(
      `https://api.humantic.ai/v1/user-profile/create?apikey=${PERSONALITY_API_KEY}&id=${uid}`
    );
  };

  const updatePersonalityProfile = async (text: string) => {
    await fetch(
      `https://api.humantic.ai/v1/user-profile/create?apikey=${PERSONALITY_API_KEY}&id=${uid}`,
      {
        method: "POST",
        body: JSON.stringify({ text }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };

  const fetchPersonalityProfile = async () => {
    const response = await fetch(
      `https://api.humantic.ai/v1/user-profile?apikey=${PERSONALITY_API_KEY}&id=${uid}`
    );
    const { metadata, results } = await response.json();
    if (metadata.analysis_status === "COMPLETE") {
      setAdvice(results.persona.sales.communication_advice);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchPersonalityProfile, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative h-screen min-h-screen bg-gray-50 p-5">
      <ClientOnly>
        {() => (
          <Call
            onCreate={createPersonalityProfile}
            onUpdate={updatePersonalityProfile}
          />
        )}
      </ClientOnly>
      {role === "operator" && <Sidebar advice={advice} />}
    </main>
  );
}
