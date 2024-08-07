"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";

export const RedirectToZora = () => {
  useEffect(() => {
    redirect(
      "https://zora.co/collect/zora:0xfdd784e1566f20324d3da4aff4bdbe4809437e1b/11"
    );
  });
  return <></>;
};
