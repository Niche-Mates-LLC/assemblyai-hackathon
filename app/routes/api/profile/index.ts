import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";

const clearbit = require("clearbit")(process.env.CLEARBIT_API_KEY);

export async function loader({ request }: LoaderArgs) {
  const email = new URL(request.url).searchParams.get("email") || "";
  try {
    const { person } = await getClearbitInfo(email);
    const {
      twitter: { handle: twitterHandle },
      linkedin: { handle: linkedinHandle },
    } = person;

    return json({
      twitterHandle: `https://twitter.com/${twitterHandle}`,
      linkedinHandle: `https://linkedin.com/${linkedinHandle}`,
    });
  } catch (err) {
    return json(err, 500);
  }
}

const getClearbitInfo = async (email: string) => {
  return await clearbit.Enrichment.find({
    email,
    stream: true,
  });
};
