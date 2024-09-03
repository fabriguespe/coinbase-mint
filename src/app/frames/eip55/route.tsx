/* eslint-disable react/jsx-key */
import React from "react";
import { frames } from "@/app/frames/frames";
import { Button } from "frames.js/next";
import { appURL } from "@/lib/frames";
import { formatUnits, isAddress } from "viem";
import FrameNft from "@/app/components/FrameNft";
import { getChainName, isSupportedChainId } from "@/lib/utils";
import { getCoinbase721NftCost } from "@/lib/coinbase-mint";

const handler = frames(async (ctx) => {
  const searchParams = new URLSearchParams(ctx.url.searchParams);
  const chainId = searchParams.get("chainId") || "";
  const collectionAddress = searchParams.get("collection") || "";
  const nftType = searchParams.get("nftType") || "";
  let nftImage: string = "";
  let nftName: string = "";

  try {
    if (
      !chainId ||
      !collectionAddress ||
      !isAddress(collectionAddress) ||
      (chainId && !isSupportedChainId(chainId)) ||
      !nftType
    ) {
      throw new Error("Invalid parameters");
    }

    // check if nft is erc1155
    const OPENSEA_API_KEY = process.env.OPENSEA_API_KEY || "";
    const OPENSEA_BASE_URL = `https://api.opensea.io/api/v2/chain/${
      chainId === "1" ? "ethereum" : getChainName(chainId)
    }/contract/${collectionAddress}/nfts?limit=1`;

    const data = await fetch(OPENSEA_BASE_URL, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": OPENSEA_API_KEY,
      },
    }).then((res) => res.json());

    if (data?.error) {
      throw new Error(data?.error);
    }

    let tokenStandard;

    tokenStandard = data?.nfts[0].token_standard || "";
    nftImage = data?.nfts[0].display_image_url || data?.nfts[0].image_url;
    nftName = data?.nfts[0].name || "";

    if (tokenStandard !== "erc1155" && tokenStandard !== "erc721") {
      throw new Error(`Token Standard ${tokenStandard} not supported`);
    }

    if (nftImage.startsWith("https://ipfs.io/ipfs/")) {
      nftImage = nftImage.replace(
        "https://ipfs.io/ipfs/",
        "https://gateway.pinata.cloud/ipfs/"
      );
    }

    // retrieve nft price
    const nftPrice = await getCoinbase721NftCost(chainId, collectionAddress);

    const formattedNftPrice: string = parseFloat(
      formatUnits(nftPrice, 18)
    ).toFixed(6);

    return {
      image: (
        <FrameNft
          imgSrc={nftImage}
          title={nftName}
          subtitle={`${formattedNftPrice} ETH`}
        />
      ),
      buttons: [
        <Button
          action="tx"
          key="1"
          target={`/eip55/execute?chainId=${chainId}&collection=${collectionAddress}&nftType=${nftType}`}
          post_url={`/result?chain=${getChainName(
            chainId
          )}&imageUrl=${nftImage}`}
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
          imgSrc={nftImage || `${appURL()}/images/frame-failed.png`}
          title={`Error: ${errorMsg}`}
          subtitle={nftName || collectionAddress}
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
