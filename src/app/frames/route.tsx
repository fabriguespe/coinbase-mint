/* eslint-disable react/jsx-key */
import React from "react";
import { frames } from "@/app/frames/frames";
import { Button } from "frames.js/next";
import { appURL } from "@/lib/frames";
import { getNftPrice } from "@/lib/transaction";
import { formatUnits } from "viem";
import FrameNft from "@/app/components/FrameNft";
import { isSupportedChain } from "@/lib/utils";

const handler = frames(async (ctx) => {
  const searchParams = new URLSearchParams(ctx.url.searchParams);
  const chain = searchParams.get("chain") || "";
  const collectionAddress = searchParams.get("collection") || "";
  const tokenId = searchParams.get("tokenId") || "";
  let nftImage: string = "";
  let nftName: string = "";

  try {
    if (!chain || !collectionAddress || (chain && !isSupportedChain(chain))) {
      throw new Error("Invalid parameters");
    }

    // check if nft is erc1155
    const OPENSEA_API_KEY = process.env.OPENSEA_API_KEY || "";
    const OPENSEA_BASE_URL = `https://api.opensea.io/api/v2/chain/${
      chain === "eth" ? "ethereum" : chain
    }/contract/${collectionAddress}/nfts${
      tokenId ? `/${tokenId}` : ""
    }?limit=1`;
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
    if (tokenId) {
      tokenStandard = data?.nft.token_standard || "";
      nftImage = data?.nft.display_image_url || data?.nft.image_url;
      nftName = data?.nft.name || "";
    } else {
      tokenStandard = data?.nfts[0].token_standard || "";
      nftImage = data?.nfts[0].display_image_url || data?.nfts[0].image_url;
      nftName = data?.nfts[0].name || "";
    }
    if (tokenStandard !== "erc1155" && tokenStandard !== "erc721") {
      throw new Error(`Token Standard ${tokenStandard} not supported`);
    }

    if (nftImage.startsWith("https://ipfs.io/ipfs/")) {
      nftImage = nftImage.replace(
        "https://ipfs.io/ipfs/",
        "https://gateway.pinata.cloud/ipfs/"
      );
    }

    // retrieve nft metadata and price
    const nftPrice = await getNftPrice(
      chain,
      collectionAddress,
      tokenStandard,
      tokenId
    );

    const formattedNftPrice: string = parseFloat(
      formatUnits(nftPrice.totalCostEth, 18)
    ).toFixed(6);

    return {
      image: (
        <FrameNft
          imgSrc={nftImage}
          title={tokenId ? `${nftName} #${tokenId}` : nftName}
          subtitle={`${formattedNftPrice} ETH`}
        />
      ),
      buttons: [
        <Button
          action="tx"
          key="1"
          target={`/execute?chain=${chain}&collection=${collectionAddress}&token_id=${tokenId}&token_standard=${tokenStandard}`}
          post_url={`/result?chain=${chain}&imageUrl=${nftImage}`}
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
