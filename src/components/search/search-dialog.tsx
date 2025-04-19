"use client";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "../ui/button";
import { ArrowLeft, SendHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Member, Messages } from "@/types";
import { SearchResults } from "./search-result";
import { useParams, usePathname } from "next/navigation";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import React from "react";
import { useDialogSearch } from "@/hooks/use-dialog-search";

function DialogSeach() {
  const [isPending, setIsPending] = React.useState(false);
  const [results, setResults] = React.useState<{
    messages: Messages[];
    members: Member[];
  }>();
  const { isOpen, open, close } = useDialogSearch();
  const [body, setBody] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
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
      setResults(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setIsPending(false);
      return;
    }
  };

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${1024 - 1}px)`);

    const onChange = () => {
      const isMobile = window.innerWidth < 1024;

      // Jika bukan mobile, tutup dialog
      if (!isMobile) {
        close();
      }
    };

    mql.addEventListener("change", onChange);

    // Inisialisasi saat komponen mount
    const initialIsMobile = window.innerWidth < 1024;

    if (!initialIsMobile) {
      close();
    }

    return () => mql.removeEventListener("change", onChange);
  }, [close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ duration: 0.3 }}
          className="bg-card absolute inset-0 z-50 h-dvh w-full overflow-hidden p-3 shadow-lg"
        >
          <div className="flex size-full flex-col gap-2">
            <div className="flex w-full flex-none shrink-0 items-center gap-2">
              <Button
                startContent={<ArrowLeft size={16} />}
                size="icon"
                variant="glow"
                className="flex-none rounded-full"
                onClick={close}
              />
              <div className="bg-secondary relative flex-1 rounded-lg border">
                <div className="flex h-auto min-h-[48px] items-center gap-2 px-3 py-2">
                  <form
                    onSubmit={handleSubmit}
                    className="flex w-full items-center gap-2"
                  >
                    <input
                      ref={inputRef}
                      type="search"
                      id="search-message"
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      onFocus={open}
                      placeholder="Search..."
                      className="text-md flex-1 border-none bg-transparent text-black outline-none placeholder:text-sm placeholder:text-black/60 dark:text-white dark:placeholder:text-white/60"
                      onInput={(e) => {
                        const value = (e.target as HTMLInputElement).value;
                        setBody(value);
                        if (value === "") {
                          setResults(undefined);
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
                  </form>
                </div>
              </div>
            </div>
            <div className="relative flex h-[90dvh] flex-1 flex-col overflow-y-auto rounded-lg">
              {results && (
                <SearchResults
                  result={results}
                  loading={isPending}
                  close={close}
                  className="max-h-max shadow-none"
                  container={{ className: "shadow-none mt-0" }}
                />
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default DialogSeach;
