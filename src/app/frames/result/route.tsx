import { Button } from "frames.js/next";
import { frames } from "@/app/frames/frames";
import { basePublicClient, zoraPublicClient } from "@/lib/transaction";
import { appURL } from "@/lib/frames";

const handler = frames(async (ctx) => {
  const transactionId =
    ctx.message?.transactionId || ctx.url.searchParams.get("tx");

  const searchParams = new URLSearchParams(ctx.url.searchParams);
  const chain = searchParams.get("chain") || "zora";
  const txUrl =
    chain === "base"
      ? `https://basescan.org/tx/${transactionId}`
      : `https://explorer.zora.energy/tx/${transactionId}`;

  // transactionId not valid
  if (!transactionId) {
    return {
      image: (
        <div tw="relative flex flex-col text-center items-center justify-center">
          <img src={`${appURL()}/images/frame-landing.gif`} tw="w-full" />
        </div>
      ),
      buttons: [
        <Button action="post" key="1" target="/">
          Home
        </Button>,
      ],
    };
  }

  let transactionReceipt: any = null;
  try {
    transactionReceipt =
      chain === "zora"
        ? await zoraPublicClient.getTransactionReceipt({
            hash: transactionId as `0x${string}`,
          })
        : await basePublicClient.getTransactionReceipt({
            hash: transactionId as `0x${string}`,
          });
  } catch (e) {
    console.error(e);
  }

  if (!transactionReceipt) {
    return {
      image: (
        <div tw="relative flex flex-col text-center items-center justify-center">
          Loading...
        </div>
      ),
      buttons: [
        <Button key="1" action="link" target={txUrl}>
          See tx details
        </Button>,
        <Button
          key="2"
          action="post"
          target={`/result?chain=${chain}&tx=${transactionId}`}
        >
          Refresh
        </Button>,
        <Button action="post" key="3" target="/">
          Home
        </Button>,
      ],
    };
  }

  if (transactionReceipt.status === "success") {
    return {
      image: (
        <div tw="relative flex flex-col text-center items-center justify-center">
          Tx Successfull
        </div>
      ),
      buttons: [
        <Button
          key="1"
          action="link"
          target={`https://basescan.org/tx/${transactionId}`}
        >
          See tx on Zora Explorer
        </Button>,
        <Button action="post" key="2" target="/">
          Home
        </Button>,
      ],
    };
  } else if (transactionReceipt.status === "reverted") {
    return {
      image: (
        <div tw="relative flex flex-col text-center items-center justify-center">
          Tx Failed
        </div>
      ),
      buttons: [
        <Button
          key="1"
          action="link"
          target={`https://basescan.org/tx/${transactionId}`}
        >
          See tx details
        </Button>,
        <Button action="post" key="2" target="/">
          Home
        </Button>,
      ],
    };
  }

  return {
    image: (
      <div tw="relative flex flex-col text-center items-center justify-center">
        Loading...
      </div>
    ),
    buttons: [
      <Button key="1" action="link" target={txUrl}>
        See tx details
      </Button>,
      <Button
        key="2"
        action="post"
        target={`/result?chain=${chain}&tx=${transactionId}`}
      >
        Refresh
      </Button>,
      <Button action="post" key="3" target="/">
        Home
      </Button>,
    ],
  };
});

export const GET = handler;
export const POST = handler;
