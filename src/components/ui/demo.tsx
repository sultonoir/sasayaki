"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "@/hooks/use-session";
import { Image } from "@unpic/react/nextjs";

const Demo = () => {
  const { user } = useSession();
  return (
    <Card className="max-w-xs gap-4 overflow-hidden p-0">
      <div className="h-[130px] w-full bg-sky-200"></div>
      <div className="relative isolate size-full">
        <div className="bg-card absolute -top-[65px] left-2.5 rounded-full p-1.5">
          <Image
            alt={user?.name || "unknown user"}
            src={user?.image || "/avatar.png"}
            layout="fixed"
            width={80}
            height={80}
            className="rounded-full object-cover"
          />

          <div className="bg-card absolute right-[1px] bottom-[18px] size-7 rounded-full p-1.5">
            <div className="size-full rounded-full bg-emerald-500"></div>
          </div>
        </div>
      </div>
      <CardHeader className="mt-4 gap-1 px-4">
        <CardTitle>{user?.name}</CardTitle>
        <CardDescription>{user?.username}</CardDescription>
      </CardHeader>
      <CardContent className="px-4">
        <p>Card Content</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
};

export default Demo;
