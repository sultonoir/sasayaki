"use client";
import React, { ComponentProps, ReactNode } from "react";
import { NavUser } from "../sidebar/nav-user";
import SidebarSever from "../sidebar/sidebar-server-list";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import SidebarHome from "../sidebar/sidebar-home";
import { Image } from "@unpic/react/nextjs";
import { blurhashToDataUri } from "@unpic/placeholder";
import FriendIcon from "./friend-icon";

const PageLayout = ({ children }: { children: ReactNode }) => {
  const { isOpen } = useSidebar();
  return (
    <div className="flex h-svh flex-col overflow-hidden">
      <div
        className={cn(
          "ease-[cubic-bezier(0.4, 0.0, 0.2, 1)] bg-background fixed top-0 left-0 z-10 h-full w-full shadow-xl transition-all duration-300 will-change-transform md:w-[365px]",
          {
            "-translate-x-full opacity-0": !isOpen,
            "translate-x-0 opacity-100": isOpen,
          },
        )}
      >
        <PageMenu />
      </div>

      <div
        className={cn(
          "ease-[cubic-bezier(0.4, 0.0, 0.2, 1)] flex-1 transition-all duration-300 will-change-transform",
          {
            "ml-[365px]": isOpen,
            "ml-0": !isOpen,
          },
        )}
      >
        {children}
      </div>
    </div>
  );
};

const PageMenu = () => {
  return (
    <div className="flex size-full flex-col">
      <div className="mt-[40px] flex h-full flex-row overflow-x-hidden overflow-y-auto">
        <div className="flex w-[65px] flex-none flex-col gap-2 overflow-y-auto">
          <SidebarSever />
        </div>
        <SidebarHome />
      </div>
      <div className="flex-none shrink-0 p-4 pt-0">
        <NavUser />
      </div>
    </div>
  );
};

const PageTitle = ({
  className,
  children,
  ...props
}: ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "flex h-10 flex-none items-center justify-center gap-4 py-2",
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
  return (
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
  );
};

export { PageLayout, PageTitle, PageContainer, PageHeader };
