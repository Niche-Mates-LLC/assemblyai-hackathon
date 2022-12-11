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
  const [advice, setAdvice] = useState({
    description: [
      "They like to be in a position where they can control the conversation and terms.",
      "They like to act fast and expect others to do the same.",
      "More than the product, they care about the effectiveness of the product.",
    ],
    adjectives: ["Strong-Willed", "Decisive", "Impact-Driven"],
    what_to_say: [
      "Hold your ground without indulging in one-upmanship.",
      "Refer to testimonials from well-known industry leaders.",
      "When negotiating terms, help them build an impression that they are the ones calling the shots.",
    ],
    what_to_avoid: [
      "Avoid being a storyteller and don’t try to oversell.",
      "Don't try too hard to forge relationships with them.",
      "Do not hesitate from asking counter questions, just avoid challenging their authority.",
    ],
    key_traits: {
      "Risk Appetite": "The risks don’t matter much to them.",
      "Ability To Say No":
        "If they decide not to use your product, they will say no clearly.",
      Speed:
        "They can take decisions very fast if you manage to convince them.",
      "Decision Drivers":
        "Conviction around the impact matters the most to them, followed by a sense of achievement and ROI.",
    },
  });
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
    // await fetch(
    //   `https://api.humantic.ai/v1/user-profile/create?apikey=${PERSONALITY_API_KEY}&id=${uid}`
    // );
  };

  const updatePersonalityProfile = async (text: string) => {
    // await fetch(
    //   `https://api.humantic.ai/v1/user-profile/create?apikey=${PERSONALITY_API_KEY}&id=${uid}`,
    //   {
    //     method: "POST",
    //     body: JSON.stringify({ text }),
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );
  };

  const fetchPersonalityProfile = async () => {
    // const response = await fetch(
    //   `https://api.humantic.ai/v1/user-profile?apikey=${PERSONALITY_API_KEY}&id=${uid}`
    // );
    // const { metadata, results } = await response.json();
    // if (metadata.analysis_status === "COMPLETE") {
    //   setAdvice(results.persona.sales.communication_advice);
    // }
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
