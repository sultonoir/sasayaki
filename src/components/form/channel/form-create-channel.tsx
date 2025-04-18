"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { LockIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { useDialogCreateChannel } from "@/hooks/use-dialog-create-channel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { handleError } from "@/lib/handle-eror";
import { useParams } from "next/navigation";

const FormSchema = z.object({
  private: z.boolean(),
  name: z.string(),
});

export function FormCreateChannel({ className }: ComponentProps<"form">) {
  const { setOpen, channel, setId } = useDialogCreateChannel();
  const { server } = useParams<{ server: string }>();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      private: channel.isPrivate,
      name: channel.name,
    },
  });

  const mutate = useMutation(api.channel.channel_service.createChannel);
  const editMutate = useMutation(api.channel.channel_service.editChannel);

  async function handleCreate(data: z.infer<typeof FormSchema>) {
    try {
      await mutate({
        ...data,
        serverId: channel.id as unknown as Id<"server">,
      });
    } catch (error) {
      return handleError({ error, message: "Error Create channel" });
    }

    setOpen(false);
    setId({
      id: "",
      name: "",
      isPrivate: false,
      type: "crete",
    });
  }

  async function handleUpdate(data: z.infer<typeof FormSchema>) {
    try {
      await editMutate({
        serverId: server as unknown as Id<"server">,
        private: data.private,
        name: data.name,
        channelId: channel.id as unknown as Id<"channel">,
      });
    } catch (error) {
      return handleError({ error, message: "Error Create channel" });
    }

    setOpen(false);
    setId({
      id: "",
      name: "",
      isPrivate: false,
      type: "crete",
    });
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (channel.type === "crete") {
      return handleCreate(data);
    }
    return handleUpdate(data);
  }

  const isPending =
    form.formState.isSubmitting || form.watch("name").trim() === "";
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("w-full space-y-6", className)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Channel</FormLabel>
              <FormControl>
                <Input
                  placeholder="# new channel"
                  value={field.value}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    let newValue = e.target.value;

                    newValue = newValue.replace(/[^a-zA-Z0-9\s]/g, "-");
                    newValue = newValue.replace(/\s+/g, "-");
                    newValue = newValue.replace(/-+/g, "-");
                    if (newValue.length <= 100) {
                      field.onChange(newValue.toLowerCase());
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="private"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>
                  <LockIcon className="size-4" />
                  Private Channel
                </FormLabel>
                <FormDescription className="text-xs">
                  Only selected member and roles will be able to view this
                  channel.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={isPending}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
