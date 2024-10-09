import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import ky from "ky";
import { BookmarkIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

type Props = {
  initialData: boolean;
  threadId: string;
};

export const ThreadBookmarButton = ({ initialData, threadId }: Props) => {
  const [isBookmaked, setIsBookmaked] = React.useState(initialData);

  const { mutate, isPending } = useMutation({
    mutationKey: ["bookmark", threadId],
    mutationFn: async () =>
      ky.post(`/v1/thread/bookmark/${threadId}`).json<boolean>(),
    onSuccess: (data) => {
      setIsBookmaked(data);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleClick = () => {
    mutate();
  };

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      disabled={isPending}
      size="icon"
      className="hover:bg-transparent gap-1 group text-muted-foreground items-center text-[14px] leading-5 hover:text-primary">
      <div className="relative group-hover:text-pribg-primary">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 size-10 rounded-full bg-primary/20 opacity-0 group-hover:opacity-100 z-0 transition-all" />
        <BookmarkIcon
          size={18}
          className={cn("z-10 relative", {
            "text-primary": isBookmaked,
            "fill-primary": isBookmaked,
          })}
        />
      </div>
    </Button>
  );
};
