import { FormSignin } from "@/components/templates/form/auth/form-signin";
import { type Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Signin Page",
};

const Page = () => {
  return <FormSignin />;
};

export default Page;
