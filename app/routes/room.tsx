import { useState } from "react";
import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { ClientOnly } from "remix-utils";
import Call from "../components/call/index.client";

const PERSONALITY_API_KEY = "chrexec_6d61c717981abc3eb993d3535dca2e7b";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);

  return {
    name: url.searchParams.get("name"),
  };
};

export default function Index() {
  const { name } = useLoaderData<typeof loader>();

  const [personality, setPersonality] = useState({
    personality_analysis: {
      summary: {
        disc: {
          color: "red",
          archetype: "Commander",
          group: "dominant",
          description: ["High Dominance"],
          label: ["D"],
        },
        ocean: {
          description: [
            "Extroverted",
            "Somewhat Open",
            "Somewhat Conscientious",
          ],
          label: ["e", "o", "c"],
        },
      },
    },
  });

  const [advice, setAdvice] = useState({
    _type: ["high dominance"],
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

  const createPersonalityProfile = async () => {
    await fetch(
      `https://api.humantic.ai/v1/user-profile/create?apikey=${PERSONALITY_API_KEY}&id=${name}`
    );
  };

  const updatePersonalityProfile = async (text: string) => {
    await fetch(
      `https://api.humantic.ai/v1/user-profile/create?apikey=${PERSONALITY_API_KEY}&id=${name}`,
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
      `https://api.humantic.ai/v1/user-profile?apikey=${PERSONALITY_API_KEY}&id=${name}`
    );

    const { metadata, results } = await response.json();

    if (metadata.analysis_status === "COMPLETE") {
      return results;
    } else {
      return { status: "404" };
    }
  };

  return (
    <main className="relative h-screen min-h-screen bg-gray-800 p-5">
      <ClientOnly>{() => <Call />}</ClientOnly>

      <div
        className="absolute right-0 top-0 m-5 h-[95%] w-[400px] rounded-xl bg-white p-5"
      >
        <h2 className="text-2xl font-bold text-gray-800">Personality</h2>
        <ul className="my-5 text-md">
          <li className="flex">
            <span className="font-bold">Color</span>
            <div className="mx-2 mb-2 flex-grow border-b border-dotted border-gray-300"></div>
            <span>{personality.personality_analysis.summary.disc.color}</span>
          </li>
          <li className="flex">
            <span className="font-bold">Archetype</span>
            <div className="mx-2 mb-2 flex-grow border-b border-dotted border-gray-300"></div>
            <span>
              {personality.personality_analysis.summary.disc.archetype}
            </span>
          </li>
          <li className="flex">
            <span className="font-bold">Group</span>
            <div className="mx-2 mb-2 flex-grow border-b border-dotted border-gray-300"></div>
            <span>{personality.personality_analysis.summary.disc.group}</span>
          </li>
          <li className="flex">
            <span className="font-bold">Description</span>
            <div className="mx-2 mb-2 flex-grow border-b border-dotted border-gray-300"></div>
            <span>{personality.personality_analysis.summary.disc.description.join(', ')}</span>
          </li>
          <li className="flex">
            <span className="font-bold">Label</span>
            <div className="mx-2 mb-2 flex-grow border-b border-dotted border-gray-300"></div>
            <span>{personality.personality_analysis.summary.disc.label.join(', ')}</span>
          </li>
          <li className="flex">
            <span className="font-bold">Character</span>
            <div className="mx-2 mb-2 flex-grow border-b border-dotted border-gray-300"></div>
            <span>{advice.adjectives.join(', ')}</span>
          </li>
        </ul>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Advice</h2>
        <span className="text-lg font-bold">
          General 
        </span>
        <ul className="my-4">
          {advice.description.map((d, i) => (
            <li key={`description-${i}`} className="mb-2">{d}</li>
          ))}
          {Object.values(advice.key_traits).map((d, i) => (
            <li key={`description-${i}`} className="mb-2">{d}</li>
          ))}
        </ul>

        <span className="text-lg font-bold">
          What to say 
        </span>
        <ul className="my-4">
          {advice.what_to_say.map((d, i) => (
            <li key={`dos-${i}`} className="mb-2">{d}</li>
          ))}
        </ul>

        <span className="text-lg font-bold">
          What to avoid
        </span>
        <ul className="my-4">
          {advice.what_to_avoid.map((d, i) => (
            <li key={`donts-${i}`} className="mb-2">{d}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}
