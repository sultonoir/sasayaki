import HomePage from "@/components/ui/home-page";
import { api } from "@/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";

const Page = async () => {
  const friends = await fetchQuery(
    api.friend.friend_service.getAllFriends,
    {},
    {
      token: await convexAuthNextjsToken(),
    },
  );
  return <HomePage friends={friends} />;
};

export default Page;
