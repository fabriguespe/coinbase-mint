/* eslint-disable react/jsx-key */
import React from "react";
import { frames } from "@/app/frames/frames";
import { Button } from "frames.js/next";
import { appURL } from "@/lib/frames";
import { getNftData } from "@/lib/nft";
import { getNftPrice } from "@/lib/transaction";
import { formatUnits } from "viem";

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
                <b style={{ fontFamily: "Urbanist-Bold" }}>
                  {nftMetadata.name}
                </b>{" "}
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
              <b style={{ fontFamily: "Urbanist-Bold" }}>{errorMsg}</b>{" "}
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

export const GET = handler;
export const POST = handler;
