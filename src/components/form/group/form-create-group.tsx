"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessagesSquareIcon } from "lucide-react";
import React from "react";
import FieldImage from "./field-image";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UploadedFile } from "@/types";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  images: z.array(z.instanceof(File)),
});

export function FormCreatGroup() {
  const [open, setOpen] = React.useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      images: [],
    },
  });

  const mutate = useMutation(api.group.group_service.createGroup);

  async function onSubmit(value: z.infer<typeof FormSchema>) {
    const images: UploadedFile[] = [];
    try {
      const formData = new FormData();
      value.images.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("folder", "group");

      const result = await fetch("/api/image", {
        method: "POST",
        body: formData,
      });

      if (!result.ok) {
        toast.error("Failed to upload files");
      }

      const data = await result.json<{
        success: boolean;
        results: UploadedFile[];
      }>();

      if (!data.success || !data.results) {
        toast.error("Failed to upload files");
      }

      images.push(...data.results);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
      return toast.error("Failed to upload files");
    }

    void mutate({ name: value.name, image: images[0].url });
    form.reset();
    setOpen(false);
  }

  const disable = form.formState.isSubmitting;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="create group">
              <MessagesSquareIcon />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Create Group</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
          <DialogDescription className="sr-only">
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FieldImage
                      setImages={field.onChange}
                      images={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              loading={disable}
              disabled={disable}
              type="submit"
              className="w-full"
            >
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
