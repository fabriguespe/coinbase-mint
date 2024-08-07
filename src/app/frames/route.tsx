/* eslint-disable react/jsx-key */
import React from "react";
import { frames } from "@/app/frames/frames";
import { Button } from "frames.js/next";
import { appURL } from "@/lib/frames";
import { getNftData } from "@/lib/nft";
import { getNftPrice } from "@/lib/transaction";
import { formatUnits } from "viem";
import FrameNft from "@/app/components/FrameNft";

const handler = frames(async (ctx) => {
  const searchParams = new URLSearchParams(ctx.url.searchParams);
  const chain = searchParams.get("chain") || "zora";
  const collectionAddress =
    searchParams.get("collection") ||
    "0xFdd784E1566f20324d3da4AFf4bdBE4809437e1b";
  const tokenId = searchParams.get("tokenId") || "11";

  try {
    const nftMetadata = await getNftData(chain, collectionAddress, tokenId);
    const nftPrice = await getNftPrice(chain, collectionAddress, tokenId);

    const formattedNftPrice: string = parseFloat(
      formatUnits(nftPrice.totalCostEth, 18)
    ).toFixed(6);
    return {
      image: (
        <FrameNft
          imgSrc={nftMetadata.image}
          title={`${nftMetadata.name} #${tokenId}`}
          subtitle={`${formattedNftPrice} ETH`}
        />
      ),
      buttons: [
        <Button
          action="tx"
          key="1"
          target={`/execute?chain=${chain}&collection=${collectionAddress}&token_id=${tokenId}`}
          post_url={`/result?chain=${chain}`}
        >
          Mint
        </Button>,
      ],
      imageOptions: {
        aspectRatio: "1:1",
      },
    };
  } catch (error) {
    const errorMsg = (error as Error).message || "Failed to load NFT";
    console.error("Error fetching NFT data", error);
    return {
      image: (
        <FrameNft
          imgSrc={`${appURL()}/images/frame-landing.gif`}
          title={errorMsg}
          subtitle={collectionAddress}
          description={`TokenId #${tokenId}`}
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

export const GET = handler;
export const POST = handler;
