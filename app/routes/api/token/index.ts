import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";

export async function loader({ params }: LoaderArgs) {
  const apiKey = await generateApiKey();

  return json(apiKey);
}

const generateApiKey = async () => {
  const headers: HeadersInit = {
    authorization: process.env.ASSEMBLY_API_KEY || "",
    "content-type": "application/json",
  };

  const res = await fetch("https://api.assemblyai.com/v2/realtime/token", {
    method: "POST",
    headers,
    body: JSON.stringify({ expires_in: 180 }),
  });
  return await res.json();
};
