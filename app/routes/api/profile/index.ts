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
  // remove this when you want to get the info for other emails etc.

  return {
    person: {
      twitter: {
        handle: "NafetsWirth",
        id: 2411164066,
        bio: "The Calm Founder 😌\n\nStressed VC-Startup CTO turned bootstrapper to bring the calm to his biz.\n\nTweeting about creating leverage with processes and automation.",
        followers: 2302,
        following: 1247,
        statuses: 19045,
        favorites: 17990,
        location: "Free systems for your SaaS  ➡️",
        site: "https://www.calmbusinessos.com/templates",
        avatar:
          "https://pbs.twimg.com/profile_images/1600689157650743296/ECll5w2-.png",
      },
      linkedin: { handle: "in/stefan-wirth-5aa03593" },
    },
  };

  return await clearbit.Enrichment.find({
    email,
    stream: true,
  });
};
