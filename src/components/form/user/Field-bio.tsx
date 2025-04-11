import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import { useProfileEdit } from "@/provider/profile-edit-provider";
import React, { useState } from "react";

const FieldBio = () => {
  const maxLength = 180;
  const { state, dispatch } = useProfileEdit();
  const [characterCount, setCharacterCount] = useState(0);

  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 52,
    maxHeight: 200,
  });

  return (
    <div className="space-y-2">
      <Label htmlFor="bio">About me</Label>
      <Textarea
        id="bio"
        placeholder="Write a few sentences about yourself"
        className="w-full max-w-xs resize-none bg-black/5 px-4 py-3 leading-[1.2] placeholder:text-black/70 focus-visible:ring-0 dark:placeholder:text-white/70"
        value={state.bio}
        maxLength={maxLength}
        ref={textareaRef}
        onChange={(e) => {
          const newValue = e.target.value;
          if (newValue.length <= maxLength) {
            dispatch({ type: "SET_BIO", payload: newValue });
            setCharacterCount(newValue.length);
            adjustHeight();
          }
        }}
        aria-describedby="description"
      />
      <p
        id="description"
        className="text-muted-foreground mt-2 text-right text-xs"
        role="status"
        aria-live="polite"
      >
        <span className="tabular-nums">{maxLength - characterCount}</span>{" "}
        characters left
      </p>
    </div>
  );
};

export default FieldBio;
