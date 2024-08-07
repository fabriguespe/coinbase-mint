import { NextRequest, NextResponse } from "next/server";
import { mint1155Creator } from "@/lib/transaction";
import { frames } from "@/app/frames/frames";
import { Button, transaction } from "frames.js/core";
import { appURL } from "@/lib/frames";
import FrameNft from "@/app/components/FrameNft";

export const POST = frames(async (ctx) => {
  const searchParams = new URLSearchParams(ctx.url.searchParams);
  const user_address = await ctx.walletAddress();
  const chain = searchParams.get("chain") || "zora";
  const collectionAddress = searchParams.get("collection") || "";
  const tokenId = searchParams.get("token_id") || "";

  if (!user_address) {
    throw new Error("Error retrieving User Address");
  }

  try {
    const txCalldata = await mint1155Creator(
      chain,
      collectionAddress,
      tokenId,
      user_address
    );
    return transaction(txCalldata);
  } catch (e) {
    console.log("mint error", e);
    const errorMsg = (e as Error).message || "";
    return {
      image: (
        <FrameNft
          imgSrc={`${appURL()}/images/frame-failed-balance.png`}
          title={errorMsg}
          subtitle={collectionAddress}
          description={`TokenId ${tokenId}`}
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
});
