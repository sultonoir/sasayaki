import { Doc } from "@/convex/_generated/dataModel";
import { blurhashToDataUri } from "@unpic/placeholder";
import { Image } from "@unpic/react/nextjs";
import React from "react";

const attachments = [
  {
    _creationTime: 1743654581504.2708,
    _id: "n57bz58zkjzx2jsz16a9xdr46h7dav95",
    blur: "UJJRjnDP0f.S4.4TnOWA_4E0$%VsSixZX8xv",
    fileId: "598924514bd9d12d023b4137809d9076",
    format: "image",
    messageId: "nh75k04xjzesxg1n0eqsvfc4kn7dbhxj",
    name: "425761539_2044898605891434_3291277675662401449_n.jpg",
    url: "https://res.cloudinary.com/dv6cln4gs/image/upload/v1743654578/n97ceste3zdjqx8vzttce8ctzh7d7yga/imatp8vthx0jorlvxolw.jpg",
  },
  {
    _creationTime: 1743654581504.271,
    _id: "n579j5e17tq2d74r2xv4ftcctn7dbv8j",
    blur: "UJKUf+0LH??^00t79ExuT0xuR5Mx8^M{-;WA",
    fileId: "4cff5fb756fe7f16424a8d6446a68ed3",
    format: "image",
    messageId: "nh75k04xjzesxg1n0eqsvfc4kn7dbhxj",
    name: "425702024_2044898515891443_6887938675286740203_n.jpg",
    url: "https://res.cloudinary.com/dv6cln4gs/image/upload/v1743654578/n97ceste3zdjqx8vzttce8ctzh7d7yga/zrirdoojozqiqritdub1.jpg",
  },
  {
    _creationTime: 1743654581504.2712,
    _id: "n5714cabq2tvjntwrfwbqq71wn7db6e4",
    blur: "UGK1qA00ysM{00MxWAD%Ndoz-oIA%MkB.8%M",
    fileId: "a204ef3dfdf2c9b2f6cde4c1585aaaef",
    format: "image",
    messageId: "nh75k04xjzesxg1n0eqsvfc4kn7dbhxj",
    name: "425817232_2044898525891442_5267267900774935530_n.jpg",
    url: "https://res.cloudinary.com/dv6cln4gs/image/upload/v1743654578/n97ceste3zdjqx8vzttce8ctzh7d7yga/cydnpecla7l7jbncy75i.jpg",
  },
] as unknown as Doc<"attachment">[];

const Demo = () => {
  return (
    <div className="grid w-full max-w-[448px] grid-cols-3 grid-rows-2 gap-2">
      <div className="col-span-2 row-span-2">
        {renderImage(attachments[0], 300, 300)}
      </div>
      {attachments.slice(1).map((item) => renderImage(item, 144, 144))}
    </div>
  );
};

const renderImage = (
  item: Doc<"attachment">,
  width?: number,
  height?: number,
) => (
  <div key={item._id} className="group relative overflow-hidden rounded-md">
    <Image
      src={item.url}
      background={blurhashToDataUri(item.blur)}
      alt={item.name}
      width={width}
      height={height}
      className="object-cover"
    />
  </div>
);

export default Demo;
