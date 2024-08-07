"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";

interface RedirectToZoraProps {
  chain: string;
  collectionAddress: string;
  tokenId: string;
}
export const RedirectToZora = ({
  chain,
  collectionAddress,
  tokenId,
}: RedirectToZoraProps) => {
  useEffect(() => {
    redirect(
      `https://zora.co/collect/${chain}:${collectionAddress}/${tokenId}`
    );
  });
  return <></>;
};
