import FriendIcon from "@/components/ui/friend-icon";
import { PageContainer, PageTitle } from "@/components/ui/page-layouting";
import React from "react";

const Page = () => {
  return (
    <>
      <PageTitle>
        <FriendIcon />
        Friend
      </PageTitle>
      <PageContainer></PageContainer>
    </>
  );
};

export default Page;
