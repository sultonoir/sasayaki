/* eslint-disable @typescript-eslint/no-unused-vars */
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { SearchIcon, SendHorizontal } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useClickOutside } from "@/hooks/use-click-outside";
import { AnimatePresence, motion } from "motion/react";
import { SearchResults } from "./search-result";
import { useMutation } from "convex/react";
import { Label } from "../ui/label";
import { Member, Messages } from "@/types";

const SearchDesktop = () => {
  const [isPending, setIsPending] = useState(false);
  const [results, setResults] = useState<{
    messages: Messages[];
    members: Member[];
  }>();
  const [isOpen, setIsOpen] = useState(false);
  const [body, setBody] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useClickOutside(containerRef, () => setIsOpen(false));
  const pathname = usePathname();
  const { channel, server, dmId } = useParams<{
    server: Id<"server">;
    channel: string;
    dmId: string;
  }>();

  const serverId = pathname.startsWith("/server") ? server : undefined;

  const channelId = pathname.startsWith("/server") ? channel : dmId;

  const mutate = useMutation(api.message.message_service.searchMessage);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    try {
      const data = await mutate({ channelId, serverId, body });
      setIsPending(false);
      setIsOpen(true);
      setResults(data);
    } catch (error) {
      setIsPending(false);
      return;
    }
  };

  return (
    <div className="relative hidden lg:block" ref={containerRef}>
      <div className="bg-secondary relative rounded-lg">
        <form
          onSubmit={handleSubmit}
          className="flex h-auto min-h-[48px] flex-wrap items-center gap-2 px-3 py-2"
        >
          <div className="flex items-center gap-2 rounded-md bg-black/10 px-2 py-1 text-sm dark:bg-white/10">
            <span className="flex flex-shrink-0 items-center gap-1.5">
              <SearchIcon className="h-4 w-4 text-black/50 dark:text-white/50" />
              <span className="text-black/70 dark:text-white/70">Search</span>
            </span>
          </div>
          <div className="flex flex-1 items-center gap-2">
            <Label htmlFor="search-message" className="sr-only">
              Search...
            </Label>
            <input
              ref={inputRef}
              type="search"
              id="search-message"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onFocus={() => setIsOpen(true)}
              placeholder="Search..."
              className="text-md flex-1 border-none bg-transparent text-black outline-none placeholder:text-sm placeholder:text-black/60 dark:text-white dark:placeholder:text-white/60"
              onInput={(e) => {
                const value = (e.target as HTMLInputElement).value;
                setBody(value);
                if (value === "") {
                  setResults(undefined);
                  setIsOpen(true);
                }
              }}
            />
            <Button
              size="icon"
              variant={body.trim() === "" ? "ghost" : "glow"}
              type="submit"
              startContent={<SendHorizontal className="size-4" />}
              className={cn("size-7", {
                "text-muted-foreground": body.trim() === "",
              })}
            />
          </div>
        </form>
      </div>
      <AnimatePresence>
        {isOpen && results && (
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "bg-secondary absolute z-50 mt-2 w-full overflow-hidden rounded-lg p-2 shadow-lg",
            )}
          >
            <SearchResults
              key="search-results"
              result={results}
              loading={isPending}
              close={() => setIsOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchDesktop;
