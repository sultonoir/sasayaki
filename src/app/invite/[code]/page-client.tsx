"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { handleError } from "@/lib/handle-eror";
import { Image } from "@unpic/react/nextjs";
import { useMutation } from "convex/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

interface Props {
  server: Doc<"server"> & {
    image: Doc<"serverImage">;
    allMember: number;
    memebrOnline: number;
  };
  user: Doc<"users"> | null;
}

const PageClient = ({ server, user }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const mutate = useMutation(api.member.member_service.joinServer);

  const handleJoin = async () => {
    if (!user?._id) {
      return router.push(`/signin?redirectTo=${pathname}`);
    }
    setIsPending(true);
    try {
      await mutate({
        serverId: server._id,
        userId: user._id,
        username: user.name,
      });
    } catch (error) {
      setIsPending(false);
      return handleError({ error, message: "Error join server" });
    }

    setIsPending(false);
    router.push("/");
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex flex-col items-center justify-center">
        <Image
          src={server.image.url}
          alt={server.name}
          width={80}
          height={80}
          layout="fixed"
          priority={true}
          loading="eager"
          className="rounded-full"
        />
        <CardDescription>Invited you to join</CardDescription>
        <CardTitle className="capitalize">{server.name}</CardTitle>
        <div className="inline-flex gap-4">
          <div className="flex items-center text-xs">
            <span className="mr-2 size-3 rounded-full bg-zinc-400"></span>
            <span className="mr-1">{server.allMember}</span>
            <span className="text-muted-foreground">Members</span>
          </div>
          <div className="flex items-center text-xs">
            <span className="mr-2 size-3 rounded-full bg-emerald-500"></span>
            <span className="mr-1">{server.memebrOnline}</span>
            <span className="text-muted-foreground">Online</span>
          </div>
        </div>
      </CardHeader>
      <CardFooter>
        <Button
          loading={isPending}
          disabled={isPending}
          className="w-full"
          onClick={handleJoin}
        >
          Join server
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PageClient;
