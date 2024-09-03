import { frames } from "@/app/frames/frames";
import { Button, transaction } from "frames.js/core";
import { appURL } from "@/lib/frames";
import FrameNft from "@/app/components/FrameNft";
import { isSupportedChainId } from "@/lib/utils";
import {
  getCoinbase721MintTransaction,
  getCoinbase721NftCost,
} from "@/lib/coinbase-mint";
import { isAddress } from "viem";

export const POST = frames(async (ctx) => {
  const searchParams = new URLSearchParams(ctx.url.searchParams);
  const userAddress = await ctx.walletAddress();
  const chainId = searchParams.get("chainId") || "";
  const collectionAddress = searchParams.get("collection") || "";
  const nftType = searchParams.get("nftType") || "";

  try {
    if (
      !chainId ||
      !collectionAddress ||
      !isAddress(collectionAddress) ||
      (chainId && !isSupportedChainId(chainId)) ||
      !userAddress ||
      !isAddress(userAddress) ||
      !nftType
    ) {
      throw new Error("Invalid parameters");
    }

    const nftPrice = await getCoinbase721NftCost(chainId, collectionAddress);

    // mint erc721
    const txCalldata = await getCoinbase721MintTransaction(
      userAddress,
      chainId,
      nftType,
      collectionAddress,
      nftPrice,
      1
    );

    return transaction(txCalldata);
  } catch (e) {
    console.error("mint error", e);
    const errorMsg = (e as Error).message || "";
    return {
      image: (
        <FrameNft
          imgSrc={`${appURL()}/images/frame-failed.png`}
          title={errorMsg}
          subtitle={collectionAddress}
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
