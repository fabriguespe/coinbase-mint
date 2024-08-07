/* eslint-disable react/jsx-key */
import React from "react";
import { frames } from "@/app/frames/frames";
import { Button } from "frames.js/next";
import { appURL } from "@/lib/frames";
import { getNftData } from "@/lib/nft";
import { formatUnits } from "viem";
import { getNftPrice } from "@/lib/transaction";

const handler = frames(async (ctx) => {
  const userAddress = await ctx.walletAddress();

  if (!userAddress) {
    return {
      image: `${appURL()}/images/frame-landing.png`,
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

  const searchParams = new URLSearchParams(ctx.url.searchParams);
  const chain = searchParams.get("chain") || "zora";
  const chainId = chain === "zora" ? 7777777 : 8453;
  const collectionAddress =
    searchParams.get("collection") ||
    "0xFdd784E1566f20324d3da4AFf4bdBE4809437e1b";
  const tokenId = searchParams.get("tokenId") || "11";

  const nftMetadata = await getNftData(chain, collectionAddress, tokenId);
  const nftPrice = await getNftPrice(
    chain,
    collectionAddress,
    tokenId,
    userAddress
  );

  const formattedNftPrice: string = parseFloat(
    formatUnits(nftPrice.totalCostEth, 18)
  ).toFixed(6);
  return {
    image: (
      <div tw="relative flex flex-col text-center items-center justify-center">
        <img
          src={nftMetadata.image}
          tw="h-full"
          style={{ opacity: 1, objectFit: "cover" }}
        />
        <div
          tw="w-full flex flex-col absolute text-white bottom-0 py-16 px-10 text-[48px] font-light leading-8"
          style={{ backgroundColor: "rgba(0,0,0, 0.8)" }}
        >
          <div tw="flex items-center">
            <p tw="mr-2">
              <b style={{ fontFamily: "Urbanist-Bold" }}>{nftMetadata.name}</b>{" "}
            </p>
            <p tw="">#{tokenId}</p>
          </div>
          <div tw="flex -mt-4">{formattedNftPrice} ETH</div>
        </div>
      </div>
    ),
    buttons: [
      <Button
        action="tx"
        key="1"
        target={`/api/mint?collection=${collectionAddress}&token_id=${tokenId}&user_address=${userAddress}`}
        post_url={`/result?transaction_type=mint&collection=${collectionAddress}&token_id=${tokenId}`}
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
