"use client";

import DmHeader from "@/components/dm/dm-header";
import { PageHeader } from "@/components/ui/page-layouting";
import { DmPage } from "@/types";

interface PageClientProps {
  user: DmPage;
}

const PageClient = ({ user }: PageClientProps) => {
  return (
    <>
      <PageHeader
        title="Direct messages"
        url="/logo.png"
        blur={user.blur}
        type={"image"}
      />
      <DmHeader
        name={user.name || "unknown user"}
        image={user.image}
        blur={user.blur}
        online={!!user.online}
      />
    </>
  );
};

export default PageClient;
