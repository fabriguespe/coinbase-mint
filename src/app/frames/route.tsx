/* eslint-disable react/jsx-key */
import React from "react";
import { frames } from "@/app/frames/frames";
import { Button } from "frames.js/next";
import { appURL } from "@/lib/frames";

const handler = frames(async (ctx) => {
  return {
    image: `${appURL()}/images/frame-landing.gif`,
    buttons: [
      <Button action="post" key="1" target={`/mint`}>
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
