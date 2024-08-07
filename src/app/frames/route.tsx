/* eslint-disable react/jsx-key */
import React from "react";
import { frames } from "@/app/frames/frames";
import { Button } from "frames.js/next";
import { appURL } from "@/lib/frames";

const handler = frames(async (ctx) => {
  const searchParams = new URLSearchParams(ctx.url.searchParams);
  const chain = searchParams.get("chain") || "zora";
  const collectionAddress =
    searchParams.get("collection") ||
    "0xFdd784E1566f20324d3da4AFf4bdBE4809437e1b";
  const tokenId = searchParams.get("tokenId") || "11";

  return {
    image: `${appURL()}/images/frame-landing.gif`,
    buttons: [
      <Button
        action="post"
        key="1"
        target={`/mint?chain=${chain}&collection=${collectionAddress}&token_id=${tokenId}`}
      >
        Mint
      </Button>,
    ],
    imageOptions: {
      aspectRatio: "1:1",
    },
  };
});

export const GET = handler;
export const POST = handler;
