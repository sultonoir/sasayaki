"use client";

import * as React from "react";

import { useDialogSearch } from "@/hooks/use-dialog-search";
import { Button } from "../ui/button";
import { SearchIcon } from "lucide-react";

export const SearchMobile = () => {
  const { open } = useDialogSearch();

  return (
    <Button onClick={open} size="icon" variant="outline" className="lg:hidden">
      <SearchIcon />
    </Button>
  );
};
