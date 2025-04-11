"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserProfile from "./user-profile";
import { useSaveToast } from "@/hooks/use-save-toast";

export default function UserPage() {
  const { open } = useSaveToast();
  return (
    <div className="container max-w-4xl pt-10">
      <Tabs defaultValue="tab-2" orientation="vertical" className="flex-row">
        <TabsList className="sticky top-10 h-fit flex-col gap-1 bg-transparent py-0">
          <TabsTrigger
            value="tab-1"
            className="dark:data-[state=active]:bg-accent w-full min-w-40 justify-start focus:ring-0 data-[state=active]:shadow-none data-[state=active]:ring-0"
            disabled
          >
            My Account
          </TabsTrigger>
          <TabsTrigger
            value="tab-2"
            className="dark:data-[state=active]:bg-accent w-full min-w-40 justify-start focus:ring-0 data-[state=active]:shadow-none data-[state=active]:ring-0"
            disabled={open !== undefined}
          >
            Profile
          </TabsTrigger>
        </TabsList>
        <div className="grow text-start">
          <TabsContent value="tab-1">
            <p className="text-muted-foreground border-none px-4 py-3 text-xs">
              Content for Tab 1
            </p>
            <p className="text-muted-foreground border-none px-4 py-3 text-xs">
              Content for Tab 1
            </p>
          </TabsContent>
          <TabsContent value="tab-2">
            <UserProfile />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
