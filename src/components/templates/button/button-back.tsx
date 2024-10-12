"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const ButtonBack = () => {
  const pathname = usePathname();
  const router = useRouter();

  const namePage = React.useMemo(() => {
    if (pathname?.startsWith("/thread")) {
      return "Thread";
    } else if (pathname?.startsWith("/user")) {
      const username = pathname?.split("/").at(-1);

      return username;
    } else {
      return pathname?.split("/").at(-1);
    }
  }, [pathname]);
  return (
    <div className="sticky top-0 z-50 flex h-12 w-full items-center gap-2 rounded-none border-b bg-background/80 px-2 backdrop-blur-lg">
      <Button variant="ghost" size="icon" onClick={() => router.back()}>
        <ArrowLeft />
      </Button>
      <p>{namePage}</p>
    </div>
  );
};

export default ButtonBack;
