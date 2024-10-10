"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { ContentField } from "./content-field";
import { useSession } from "@/provider/session-provider";
import ImageField from "./image-field";
import { uploadFiles } from "@/lib/uploadthing";
import { ButtonLoading } from "../../button/button-loading";
import UserAvatar from "@/components/templates/user/user-avatar";
import { CreateThreadForm } from "@/server/api/routers/thread/thread,input";
import { api } from "@/trpc/react";
import { toast } from "sonner";

export function FormThread() {
  const { user } = useSession();
  const form = useForm<CreateThreadForm>({
    resolver: zodResolver(CreateThreadForm),
    defaultValues: {
      content: "",
      media: [],
    },
  });

  const utils = api.useUtils();
  const { mutateAsync, isPending } = api.thread.createThread.useMutation({
    onSuccess: () => {
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: async () => {
      await utils.thread.invalidate();
    },
  });

  async function onSubmit(data: CreateThreadForm) {
    let resultImages: string[] = [];
    if (data.media.length > 0) {
      const uploadimages = await uploadFiles("media", {
        files: data.media,
      });
      resultImages = uploadimages?.map((item) => item.url) ?? [];
    }
    await mutateAsync({
      content: data.content,
      media: resultImages,
    });
  }

  const isDisabled = () => {
    let isdisabled = true;
    if (
      form.getValues("content") !== "" ||
      form.getValues("media").length !== 0 ||
      isPending
    ) {
      isdisabled = false;
    }

    return isdisabled;
  };

  return (
    <div className="flex flex-col border-b-2 p-5">
      <div className="flex w-full flex-1 flex-row gap-4">
        <div className="flex flex-col items-center">
          <UserAvatar avatarUrl={user?.image} />
          <div className="thread-card_bar" />
        </div>
        <div className="flex w-full flex-col space-y-2">
          <div className="w-fit">
            <h4 className="text-base-semibold text-light-1 cursor-pointer">
              {user?.name}
            </h4>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ContentField
                        value={field.value}
                        setValue={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="media"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageField
                        images={field.value}
                        setImages={field.onChange}
                        submitButton={
                          <ButtonLoading
                            onClick={form.handleSubmit(onSubmit)}
                            disabled={isDisabled()}
                            loading={form.formState.isSubmitting}
                          >
                            Submit
                          </ButtonLoading>
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
