import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThreadForYouFeed from "@/components/templates/thread/thread-for-you";
import { type Metadata } from "next";
import { FormThread } from "@/components/templates/form/thread/form-thread";

export const metadata: Metadata = {
  title: "Home",
};

export default function Home() {
  return (
    <main className="flex w-full min-w-0 gap-5 border-x-2">
      <div className="w-full min-w-0 space-y-5">
        <Tabs defaultValue="for-you" className="relative">
          <TabsList className="sticky top-0 z-50 h-fit w-full rounded-none border-b bg-background/80 p-0 backdrop-blur-lg">
            <TabsTrigger
              value="for-you"
              className="relative h-12 w-full bg-transparent after:absolute after:bottom-0 after:right-0 after:h-1 after:rounded-full after:bg-primary after:transition-all after:duration-300 after:content-[''] data-[state=active]:bg-transparent data-[state=active]:after:w-1/3 data-[state=active]:after:-translate-x-full"
            >
              For you
            </TabsTrigger>
            <TabsTrigger
              value="following"
              className="relative h-12 w-full bg-transparent after:absolute after:bottom-0 after:left-0 after:h-1 after:rounded-full after:bg-primary after:transition-all after:duration-300 after:content-[''] data-[state=active]:bg-transparent data-[state=active]:after:w-1/3 data-[state=active]:after:translate-x-full"
            >
              Following
            </TabsTrigger>
          </TabsList>
          <FormThread />
          <TabsContent value="for-you">
            <ThreadForYouFeed />
          </TabsContent>
          <TabsContent value="following"></TabsContent>
        </Tabs>
      </div>
      {/* <TrendsSidebar /> */}
    </main>
  );
}
