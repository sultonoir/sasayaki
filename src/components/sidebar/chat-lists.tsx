import React from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { Skeleton } from "../ui/skeleton";
import { useQuery } from "convex-helpers/react";
import { api } from "@/convex/_generated/api";
import { MessageSquare } from "lucide-react";
import { Image } from "@unpic/react/nextjs";
import { fromNow } from "@/lib/from-now";
import Link from "next/link";

const ChatLists = () => {
  return (
    <SidebarGroup className="px-0">
      <SidebarGroupContent>
        <Content />
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

function Content() {
  const { data, isPending, isError } = useQuery(api.chatlist.listChats);
  if (isPending) {
    return <Loader />;
  }

  if (isError || !data) {
    return (
      <div className="flex h-[700px] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <span className="bg-accent inline-flex size-12 items-center justify-center rounded-full">
            <MessageSquare />
          </span>
          <span>You dont have messages</span>
        </div>
      </div>
    );
  }

  return (
    <SidebarMenu>
      {data.map((item) => (
        <SidebarMenuItem key={item._id}>
          <SidebarMenuButton className="flex h-fit w-full" asChild>
            <Link href={`/${item.type}/${item._id}`} prefetch={true}>
              <Image
                className="flex-none rounded-full object-cover"
                src={item.avatarUrlId}
                alt={item.name}
                layout="constrained"
                width={40}
                height={40}
              />
              <div className="flex flex-1 flex-col">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold capitalize">{item.name}</span>
                  <span className="text-muted-foreground text-xs">
                    {fromNow(new Date(1743468668602))}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="line-clamp-1 text-xs">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Tempore inventore ab doloribus dolor accusantium
                    repellendus, nisi, deleniti provident commodi voluptate amet
                    iure delectus sit praesentium rem ipsam nihil ut dolorem
                    magnam debitis officiis similique? Enim, officia aliquid!
                    Totam ab, quaerat ipsum consequuntur neque ex aliquam, vitae
                    doloremque magni velit ullam dolorum facere. Ipsum
                    laudantium maxime quibusdam adipisci deserunt. Aliquam
                    deleniti quae doloribus, cum explicabo saepe, ratione in
                    optio consequuntur, odit exercitationem provident? Quisquam
                    enim quaerat, nesciunt, quasi assumenda eligendi esse eius
                    fugit quis cumque dolorum, tempore non in quam. Officia qui
                    quibusdam placeat itaque culpa accusantium rerum omnis sequi
                    laborum alias. Iure accusantium dolorum recusandae
                    perferendis at ullam harum incidunt doloribus distinctio,
                    quisquam, tempora repudiandae. Nobis voluptas natus, amet
                    voluptatum, ab maiores adipisci consequatur doloremque iusto
                    eveniet et officiis aperiam asperiores incidunt nihil!
                    Blanditiis dolor repellat libero est harum beatae nisi,
                    iusto corporis inventore accusamus quis, tenetur odio eius,
                    modi iste obcaecati vitae saepe ut temporibus pariatur cum
                    ratione illum quos exercitationem? Nostrum inventore, sit
                    totam neque id cum est. Deserunt quisquam iure minima at
                    placeat a labore, itaque alias rem natus sunt possimus
                    aperiam cupiditate maxime vitae ullam eos, dolorum nobis aut
                    quae fuga soluta? Ea rerum iusto expedita.
                  </span>
                </div>
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

function Loader() {
  return (
    <div className="grid grid-cols-1 gap-2">
      {Array.from({ length: 14 }).map((_, index) => (
        <div className="flex items-center space-x-4" key={index}>
          <Skeleton className="h-12 w-12 flex-none rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChatLists;
