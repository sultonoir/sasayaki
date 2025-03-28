import React from "react";
import TodoClient from "./page-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home page",
};

const Page = () => {
  return (
    <div className="max-w-lg mx-auto">
      <TodoClient />
    </div>
  );
};

export default Page;
