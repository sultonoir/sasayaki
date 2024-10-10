import React from "react";

type Props = {
  value: string;
  setValue: (value: string) => void;
};

export const ContentField = ({ value, setValue }: Props) => {
  const ref = React.useRef<HTMLTextAreaElement>(null);
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${e.target.scrollHeight - 1}px`;
      setValue(ref.current.value);
    }
  };
  return (
    <textarea
      ref={ref}
      rows={1}
      maxLength={550}
      value={value}
      onInput={handleInput}
      className="min-h-5 w-full resize-none bg-transparent outline-none focus:outline-none"
      placeholder="Start a thrade..."
    />
  );
};
