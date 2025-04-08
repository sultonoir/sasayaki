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

const FormSchema = z.object({
  private: z.boolean().default(false),
  name: z.string(),
});

export function FormCreateChannel({ className }: ComponentProps<"form">) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      private: false,
      name: "",
    },
  });

  const { setOpen, id, setId } = useDialogCreateChannel();

  const mutate = useMutation(api.channel.channel_service.createChannel);
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await mutate({
        ...data,
        serverId: id as unknown as Id<"server">,
      });
    } catch (error) {
      return handleError({ error, message: "Error Create channel" });
    }

    setOpen(false);
    setId("");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("w-full space-y-6", className)}
      >
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
                    // Get raw value from input
                    let newValue = e.target.value;

                    // Replace any sequence of one or more spaces with a single hyphen
                    // This handles any number of consecutive spaces (even millions)
                    newValue = newValue.replace(/\s+/g, "-");

                    // Remove any consecutive hyphens (replace with single hyphen)
                    newValue = newValue.replace(/-+/g, "-");

                    // Update the form

                    if (newValue.length <= 100) {
                      field.onChange(newValue);
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
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
}
