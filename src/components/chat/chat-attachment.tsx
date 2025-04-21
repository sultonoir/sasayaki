import { Doc } from "@/convex/_generated/dataModel";
import { blurhashToDataUri } from "@unpic/placeholder";
import NextImage from "next/image";
import { Image } from "@unpic/react/nextjs";
import React from "react";
import { useLightboxStore } from "@/hooks/use-lightbox";

interface Props {
  attachments: Doc<"attachment">[];
}

const ChatAttachment: React.FC<Props> = ({ attachments }) => {
  const len = attachments.length;
  const { open } = useLightboxStore();
  if (len === 1) {
    const item = attachments[0];
    return (
      <>
        <NextImage
          src={item.url}
          blurDataURL={blurhashToDataUri(item.blur)}
          placeholder="blur"
          alt={item.name}
          width={300}
          height={400}
          onClick={() => open(attachments, 0)}
          className="size-auto max-w-[300px] rounded-lg object-cover"
        />
      </>
    );
  }

  if (len === 2) {
    return (
      <div className="grid w-full max-w-[440px] grid-cols-2 gap-2">
        {attachments.map((item, index) => (
          <RenderImage
            item={item}
            key={item._id}
            width={220}
            height={220}
            attachments={attachments}
            index={index}
          />
        ))}
      </div>
    );
  }

  if (len === 3) {
    return (
      <div className="grid w-full max-w-[448px] grid-cols-3 grid-rows-2 gap-2">
        <div className="col-span-2 row-span-2">
          <RenderImage
            item={attachments[0]}
            width={300}
            height={300}
            attachments={attachments}
            index={0}
          />
        </div>
        {attachments.slice(1).map((item, i) => (
          <RenderImage
            item={item}
            key={item._id}
            width={220}
            height={220}
            attachments={attachments}
            index={i + 1}
          />
        ))}
      </div>
    );
  }

  if (len === 4) {
    return (
      <div className="grid w-full max-w-[400px] grid-cols-2 gap-2">
        {attachments.map((item, index) => (
          <RenderImage
            item={item}
            key={item._id}
            width={200}
            height={200}
            attachments={attachments}
            index={index}
          />
        ))}
      </div>
    );
  }

  if (len === 5 || len === 8) {
    return (
      <div className="flex w-full max-w-[448px] flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          {attachments.slice(0, 2).map((item, index) => (
            <RenderImage
              item={item}
              key={item._id}
              width={220}
              height={220}
              attachments={attachments}
              index={index}
            />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {attachments.slice(2).map((item, i) => (
            <RenderImage
              item={item}
              key={item._id}
              width={220}
              height={220}
              attachments={attachments}
              index={i + 2}
            />
          ))}
        </div>
      </div>
    );
  }

  if (len === 6 || len === 9) {
    return (
      <div className="grid w-full max-w-[660px] grid-cols-3 gap-2">
        {attachments.map((item, index) => (
          <RenderImage
            item={item}
            key={item._id}
            width={220}
            height={220}
            attachments={attachments}
            index={index}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex size-full w-full max-w-[448px] flex-col gap-2">
      <div className="grid size-full items-center gap-2">
        <RenderImage
          item={attachments[0]}
          key={attachments[0]._id}
          width={448}
          height={220}
          attachments={attachments}
          index={0}
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {attachments.slice(1).map((item, i) => (
          <RenderImage
            item={item}
            key={item._id}
            width={220}
            height={220}
            attachments={attachments}
            index={i + 1}
          />
        ))}
      </div>
    </div>
  );
};

interface RenderImageProps {
  item: Doc<"attachment">;
  width: number;
  height: number;
  attachments: Doc<"attachment">[];
  index: number;
}

const RenderImage: React.FC<RenderImageProps> = ({
  attachments,
  index,
  item,
  width,
  height,
}) => {
  const { open } = useLightboxStore();
  return (
    <div className="group relative cursor-pointer overflow-hidden rounded-md">
      <Image
        src={item.url}
        background={blurhashToDataUri(item.blur)}
        alt={item.name}
        width={width}
        height={height}
        layout="constrained"
        className="object-cover"
        onClick={() => open(attachments, index)}
      />
    </div>
  );
};

export default ChatAttachment;
