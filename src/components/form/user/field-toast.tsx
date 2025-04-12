"use client";
import { ToastSave } from "@/components/ui/toast-save";
import { api } from "@/convex/_generated/api";
import { handleError } from "@/lib/handle-eror";
import { useProfileEdit } from "@/provider/profile-edit-provider";
import { useSession } from "@/provider/session-provider";
import { UploadedFile } from "@/types";
import { useMutation } from "convex/react";
import React from "react";
import { toast } from "sonner";

const FieldToast = () => {
  const { user } = useSession();
  const { state, dispatch } = useProfileEdit();

  const mutate = useMutation(api.user.user_service.updateUser);
  const mutateBanner = useMutation(api.banner.banner_service.removeBanner);

  const mutateImage = useMutation(api.user.user_service.removeImage);

  async function onUpload(newFiles: File[]) {
    const images: UploadedFile[] = [];
    dispatch({ type: "SET_TOAST", payload: "loading" });
    try {
      const formData = new FormData();
      newFiles.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("folder", "group");

      const result = await fetch("/api/image", {
        method: "POST",
        body: formData,
      });

      if (!result.ok) {
        toast.error("Failed to upload files");
        dispatch({ type: "SET_TOAST", payload: "initial" });
        return;
      }

      const data = await result.json<{
        success: boolean;
        results: UploadedFile[];
      }>();

      if (!data.success || !data.results) {
        toast.error("Failed to upload files");
        dispatch({ type: "SET_TOAST", payload: "initial" });
        return;
      }

      images.push(...data.results);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
      dispatch({ type: "SET_TOAST", payload: "initial" });
      toast.error("Failed to upload files");
      return;
    }

    await mutate({
      name: state.name,
      username: state.username,
      status: state.bio,
      image: images.find((item) => item.name === state.avatar?.name),
      banner: images.find((item) => item.name === state.banner?.name),
    });

    dispatch({ type: "SET_TOAST", payload: "success" });
    setTimeout(() => dispatch({ type: "SET_TOAST", payload: undefined }), 2000);
  }

  const handleRemoveBanner = async () => {
    if (!user?.banner) return;
    const result = await fetch("/api/image", {
      method: "DELETE",
      body: JSON.stringify({ fileId: user.banner.fileId }),
    });

    if (!result.ok) {
      toast.error("Failed to upload files");
      dispatch({ type: "SET_TOAST", payload: "initial" });
      return;
    }

    await mutateBanner({
      bannerId: user.banner._id,
    });
  };

  const handleRemoveImage = async () => {
    if (!user?.profile) return;
    const result = await fetch("/api/image", {
      method: "DELETE",
      body: JSON.stringify({ fileId: user.profile?.fileId }),
    });

    if (!result.ok) {
      toast.error("Failed to upload files");
      dispatch({ type: "SET_TOAST", payload: "initial" });
      return;
    }

    await mutateImage({
      imageId: user.profile._id,
    });
  };

  const handleSave = async () => {
    dispatch({ type: "SET_TOAST", payload: "loading" });
    const files: File[] = [];
    if (state.avatar) files.push(state.avatar);
    if (state.banner) files.push(state.banner);

    try {
      if (state.initialBanner) {
        await handleRemoveBanner();
      }

      if (state.initialAvatar) {
        await handleRemoveImage();
      }

      if (files.length > 0) {
        return await onUpload(files);
      }

      await mutate({
        name: state.name,
        username: state.username,
        status: state.bio,
      });
    } catch (error) {
      dispatch({
        type: "RESET",
        payload: {
          banner: undefined,
          avatar: undefined,
          username: user?.username || "",
          name: user?.name || "",
          isRmAvatar: false,
          isRmBanner: false,
          toast: undefined,
          initialAvatar: user?.image,
          initialBanner: user?.banner ?? null,
          bio: user?.status || "",
        },
      });
      return handleError({ error, message: "Error edit profile" });
    }
    dispatch({ type: "SET_TOAST", payload: "success" });
    setTimeout(() => dispatch({ type: "SET_TOAST", payload: undefined }), 2000);
  };

  const handleReset = () => {
    dispatch({
      type: "RESET",
      payload: {
        banner: undefined,
        avatar: undefined,
        username: user?.username || "",
        name: user?.name || "",
        isRmAvatar: false,
        isRmBanner: false,
        toast: undefined,
        initialAvatar: user?.image,
        initialBanner: user?.banner ?? null,
        bio: user?.status || "",
      },
    });
  };

  return (
    <>
      {state.toast !== undefined && (
        <div className="w-fullitems-center fixed inset-x-0 bottom-2 z-[100] flex justify-center">
          <ToastSave
            state={state.toast}
            onSave={handleSave}
            onReset={handleReset}
            className="w-full max-w-2xl"
          />
        </div>
      )}
    </>
  );
};

export default FieldToast;
