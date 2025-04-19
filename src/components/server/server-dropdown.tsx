import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { Doc } from "@/convex/_generated/dataModel";
import {
  Bell,
  CalendarIcon,
  EditIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { useDialogCreateChannel } from "@/hooks/use-dialog-create-channel";
import { Image } from "@unpic/react/nextjs";
import { blurhashToDataUri } from "@unpic/placeholder";
import dynamic from "next/dynamic";

interface Props {
  name: string;
  image: Doc<"serverImage">;
  access: Doc<"access">;
  owner: boolean;
}

const DialogEditServer = dynamic(
  () => import("@/components/server/dialog-edit-server"),
  {
    ssr: false,
  },
);

const ServerDropdown = ({ name, access, owner, image }: Props) => {
  const { setOpen, setId } = useDialogCreateChannel();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="accent">{name}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          side="bottom"
          align="center"
          sideOffset={4}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex w-full items-center gap-2 px-1 py-1.5 ps-2 text-left text-sm [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_img]:shrink-0">
              <Image
                src={image.url}
                className="h-full w-full rounded-full object-cover"
                width={20}
                height={20}
                background={blurhashToDataUri(image.blur)}
                alt="Profile image"
              />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{name}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          {access.update && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={() => setIsOpen(true)}>
                  <EditIcon />
                  Edit Server
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    setOpen(true);
                    setId({
                      id: "",
                      name: "",
                      isPrivate: false,
                      type: "crete",
                    });
                  }}
                >
                  <PlusIcon />
                  Create channel
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CalendarIcon />
                  Create Event
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Bell />
              Notifications
            </DropdownMenuItem>
          </DropdownMenuGroup>

          {owner && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <TrashIcon />
                Remove server
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {isOpen && (
        <DialogEditServer
          image={image}
          name={name}
          isOpen={isOpen}
          onOpenChange={() => setIsOpen((prev) => !prev)}
        />
      )}
    </>
  );
};

export default ServerDropdown;
