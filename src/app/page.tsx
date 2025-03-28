import React from "react";
import TodoClient from "./page-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home page",
};

const Page = () => {
  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-center font-bold text-xl">Todo</h1>
      <TodoClient />
    </div>
  );
};

export default Page;
