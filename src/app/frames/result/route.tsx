import { Button } from "frames.js/next";
import { frames } from "@/app/frames/frames";
import { basePublicClient, zoraPublicClient } from "@/lib/transaction";
import { appURL } from "@/lib/frames";
import FrameNft from "@/app/components/FrameNft";

const handler = frames(async (ctx) => {
  const transactionId =
    ctx.message?.transactionId || ctx.url.searchParams.get("tx");

  const searchParams = new URLSearchParams(ctx.url.searchParams);
  const chain = searchParams.get("chain") || "zora";
  const imageUrl =
    searchParams.get("imageUrl") || `${appURL()}/images/frame-landing.gif`;
  const txUrl =
    chain === "base"
      ? `https://basescan.org/tx/${transactionId}`
      : `https://explorer.zora.energy/tx/${transactionId}`;

  // transactionId not valid
  if (!transactionId) {
    return {
      image: (
        <FrameNft
          imgSrc={imageUrl}
          title="Error transaction not found"
          subtitle=""
        />
      ),
      buttons: [
        <Button action="post" key="1" target="/">
          Home
        </Button>,
      ],
      imageOptions: {
        aspectRatio: "1:1",
      },
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

  let status = "";
  if (!transactionReceipt) {
    status = "Loading...";
  } else if (transactionReceipt.status === "success") {
    status = "Transaction Successful";
  } else if (transactionReceipt.status === "reverted") {
    status = "Transaction Failed";
  }

  return {
    image: <FrameNft imgSrc={imageUrl} title={status} subtitle="" />,
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
    imageOptions: {
      aspectRatio: "1:1",
    },
  };
});

export const GET = handler;
export const POST = handler;
