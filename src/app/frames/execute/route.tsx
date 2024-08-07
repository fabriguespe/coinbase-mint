import { NextRequest, NextResponse } from "next/server";
import { mint1155Creator } from "@/lib/transaction";
import { frames } from "@/app/frames/frames";
import { Button, transaction } from "frames.js/core";
import { appURL } from "@/lib/frames";

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
        <div tw="relative flex flex-col text-center items-center justify-center">
          <img
            src={`${appURL()}/images/frame-failed-balance.png`}
            tw="w-full"
          />
          <div
            tw="w-full flex flex-col absolute text-white bottom-0 py-16 px-10 text-[48px] font-light leading-8"
            style={{ backgroundColor: "rgba(0,0,0, 0.8)" }}
          >
            <p tw="mr-2">
              <b style={{ fontFamily: "Urbanist-Bold" }}>{errorMsg}</b>
            </p>
            <p tw="-mt-4 text-[32px]">{collectionAddress}</p>
            <p tw="-mt-4 text-[32px]">tokenId {tokenId}</p>
          </div>
        </div>
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
