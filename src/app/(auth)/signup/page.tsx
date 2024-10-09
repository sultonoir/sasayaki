import { FormSignup } from "@/components/templates/form/auth/form-signup";
import { type Metadata } from "next";

import React from "react";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Signup Page",
};

const Page = () => {
  return <FormSignup />;
};

export default Page;
