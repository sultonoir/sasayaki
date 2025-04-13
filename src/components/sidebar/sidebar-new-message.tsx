import { api } from "@/convex/_generated/api";
import { useQuery } from "convex-helpers/react";
import React from "react";
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar";
import { Skeleton } from "../ui/skeleton";
import { Image } from "@unpic/react/nextjs";
import Link from "next/link";
import { blurhashToDataUri } from "@unpic/placeholder";

const SidebarNewMessage = () => {
  const { toggleSidebar, isMobile } = useSidebar();
  const { data, isPending, isError } = useQuery(
    api.personal.personal_service.getNewDms,
  );

  if (isPending) {
    return (
      <>
        {Array.from({ length: 20 }).map((_, i) => (
          <SidebarMenuItem
            key={i}
            className="size-12 flex-none items-center justify-center p-0"
          >
            <Skeleton key={i} className="size-12" />
          </SidebarMenuItem>
        ))}
      </>
    );
  }

  if (isError || data.length === 0) return null;

  return (
    <SidebarMenuItem className="px-2">
      {data.map((content) => (
        <SidebarMenuButton
          key={content.id}
          asChild
          variant="default"
          size="lg"
          onClick={() => {
            if (isMobile) {
              toggleSidebar();
            }
          }}
          className="size-12 flex-none items-center justify-center p-0"
          tooltip={{
            children: content.name,
            hidden: false,
          }}
        >
          <Link href={`/dm/${content.id}/${content.userId}`}>
            <Image
              alt={content.name}
              src={content.image ?? "/avatar.png"}
              width={48}
              height={48}
              layout="fixed"
              background={blurhashToDataUri(
                content.blur ?? "UCFgu59^00nj_NELR4wc0cv~Khf#qvw|L0Xm",
                40,
                40,
              )}
              className="rounded-md object-cover"
            />
            {content.count > 0 && (
              <div className="bg-card absolute right-0 bottom-0 rounded-lg p-1 text-[10px] text-white">
                <span className="bg-destructive rounded-full px-1.5 py-0.5">
                  12
                </span>
              </div>
            )}
          </Link>
        </SidebarMenuButton>
      ))}
    </SidebarMenuItem>
  );
};

export default SidebarNewMessage;
