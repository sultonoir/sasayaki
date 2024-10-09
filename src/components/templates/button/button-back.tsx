"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const ButtonBack = () => {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div className="flex gap-2 h-12 w-full bg-background/80 backdrop-blur-lg sticky top-0 z-50 border-b rounded-none items-center">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.back()}>
        <ArrowLeft />
      </Button>
      <p>{pathname.split("/").at(-1)}</p>
    </div>
  );
};

export default ButtonBack;
