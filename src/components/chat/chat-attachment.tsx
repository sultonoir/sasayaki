import { Doc } from "@/convex/_generated/dataModel";
import { blurhashToDataUri } from "@unpic/placeholder";
import NextImage from "next/image";
import { Image } from "@unpic/react/nextjs";
import React from "react";

interface Props {
  attachments: Doc<"attachment">[];
}

const ChatAttachment: React.FC<Props> = ({ attachments }) => {
  const len = attachments.length;

  if (len === 1) {
    const item = attachments[0];
    return (
      <NextImage
        src={item.url}
        blurDataURL={blurhashToDataUri(item.blur)}
        placeholder="blur"
        alt={item.name}
        width={300}
        height={400}
        className="size-auto max-w-[300px] rounded-lg object-cover"
      />
    );
  }

  if (len === 2) {
    return (
      <div className="grid w-full max-w-[440px] grid-cols-2 gap-2">
        {attachments.map((item) => (
          <RenderImage item={item} key={item._id} width={220} height={220} />
        ))}
      </div>
    );
  }

  if (len === 3) {
    return (
      <div className="grid w-full max-w-[448px] grid-cols-3 grid-rows-2 gap-2">
        <div className="col-span-2 row-span-2">
          <RenderImage item={attachments[0]} width={300} height={300} />
        </div>
        {attachments.slice(1).map((item) => (
          <RenderImage item={item} key={item._id} width={220} height={220} />
        ))}
      </div>
    );
  }

  if (len === 4) {
    return (
      <div className="grid w-full max-w-[400px] grid-cols-2 gap-2">
        {attachments.map((item) => (
          <RenderImage item={item} key={item._id} width={200} height={200} />
        ))}
      </div>
    );
  }

  if (len === 5 || len === 8) {
    return (
      <div className="flex size-full w-full max-w-[448px] flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          {attachments.slice(0, 2).map((item) => (
            <RenderImage item={item} key={item._id} width={220} height={220} />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {attachments.slice(2).map((item) => (
            <RenderImage item={item} key={item._id} width={220} height={220} />
          ))}
        </div>
      </div>
    );
  }

  if (len === 6 || len === 9) {
    return (
      <div className="grid w-full max-w-[660px] grid-cols-3 gap-2">
        {attachments.map((item) => (
          <RenderImage item={item} key={item._id} width={220} height={220} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex size-full w-full max-w-[448px] flex-col gap-2">
      <div className="grid size-full items-center gap-2">
        {attachments.slice(0, 1).map((item) => (
          <RenderImage item={item} key={item._id} width={448} height={220} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {attachments.slice(1).map((item) => (
          <RenderImage item={item} key={item._id} width={220} height={220} />
        ))}
      </div>
    </div>
  );
};

interface RenderImageProps {
  item: Doc<"attachment">;
  width: number;
  height: number;
}

const RenderImage: React.FC<RenderImageProps> = ({ item, width, height }) => (
  <div className="group relative overflow-hidden rounded-md">
    <Image
      src={item.url}
      background={blurhashToDataUri(item.blur)}
      alt={item.name}
      width={width}
      height={height}
      layout="constrained"
      className="object-cover"
    />
  </div>
);

export default ChatAttachment;
