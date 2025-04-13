"use client";
import React, { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Image } from "@unpic/react/nextjs";
import { blurhashToDataUri } from "@unpic/placeholder";
import FriendIcon from "./friend-icon";
import { Button } from "./button";
import { ArrowLeft } from "lucide-react";
import { useSidebar } from "./sidebar";

const PageTitle = ({
  className,
  children,
  ...props
}: ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "flex h-10 flex-none items-center justify-center gap-2 py-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const PageContainer = ({
  className,
  children,
  ...props
}: ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "bg-sidebar flex size-full h-[calc(100svh-40px)] flex-col border-t border-l",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface PageHeaderProps {
  title: string;
  url: string;
  blur: string;
  type: "image" | "icon";
}

const PageHeader = ({ title, url, blur, type }: PageHeaderProps) => {
  const { toggleSidebar, isMobile } = useSidebar();
  return (
    <div className={cn("flex items-center justify-center gap-2 px-4")}>
      <Button
        className={cn("size-7 flex-none", { hidden: !isMobile })}
        size="icon"
        variant="ghost"
        onClick={toggleSidebar}
      >
        <ArrowLeft />
      </Button>
      <PageTitle>
        {type === "image" ? (
          <Image
            width={20}
            height={20}
            src={url}
            alt={title}
            layout="fixed"
            background={blurhashToDataUri(blur, 20, 20)}
            className="rounded-full object-cover"
          />
        ) : (
          <FriendIcon />
        )}
        <p className="text-xs">{title}</p>
      </PageTitle>
    </div>
  );
};

export { PageTitle, PageContainer, PageHeader };
