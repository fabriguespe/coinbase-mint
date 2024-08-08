import { Abi, encodeFunctionData, getAddress } from "viem";
import { ERC1155_CONTRACT_ABI } from "@/lib/abis";
import { TransactionTargetResponse } from "frames.js";
import {
  getChainId,
  getCollectorClient,
  isSupportedChain,
  NATIVE_TOKEN,
} from "./utils";

export async function getNftPrice(
  chain: string,
  collectionAddress: string,
  tokenId?: string,
  amount?: number
) {
  if (!chain || !collectionAddress || (chain && !isSupportedChain(chain))) {
    throw new Error("Invalid getNftPrice parameters");
  }

  let wrappedCollectorClient = getCollectorClient(chain);
  const { prepareMint } = await wrappedCollectorClient.getToken({
    tokenContract: getAddress(collectionAddress),
    tokenId: tokenId && tokenId != "" ? BigInt(tokenId) : undefined,
    mintType: tokenId && tokenId != "" ? "1155" : "721",
  });
  const { costs } = prepareMint({
    minterAccount: NATIVE_TOKEN,
    quantityToMint: amount ? amount : 1,
  });
  return costs;
}

export async function mint1155Creator(
  chain: string,
  collectionAddress: string,
  fromAddress: string,
  tokenId?: string,
  amount?: number,
  comment?: string
) {
  if (
    !chain ||
    !collectionAddress ||
    !fromAddress ||
    (chain && !isSupportedChain(chain))
  ) {
    throw new Error("Invalid mint parameters");
  }

  let wrappedCollectorClient = getCollectorClient(chain);

  // prepare the mint transaction
  let mintObject: any = {};
  if (tokenId && tokenId != "") {
    mintObject = {
      tokenContract: getAddress(collectionAddress),
      mintType: "1155",
      tokenId: BigInt(tokenId),
      quantityToMint: amount ? amount : 1,
      // optional comment to include with the mint
      mintComment: comment,
      // optional address that will receive a mint referral reward
      mintReferral: process.env.ZORA_REFERRAL_ADDRESS
        ? (process.env.ZORA_REFERRAL_ADDRESS as `0x${string}`)
        : undefined,
      minterAccount: fromAddress as `0x${string}`,
    };
  } else {
    mintObject = {
      tokenContract: getAddress(collectionAddress),
      mintType: "721",
      quantityToMint: amount ? amount : 1,
      mintComment: comment,
      mintReferral: process.env.ZORA_REFERRAL_ADDRESS
        ? (process.env.ZORA_REFERRAL_ADDRESS as `0x${string}`)
        : undefined,
      minterAccount: fromAddress as `0x${string}`,
    };
  }
  const collectorData = await wrappedCollectorClient.mint(mintObject);

  const mintData = encodeFunctionData(collectorData.parameters);

  const costs = await getNftPrice(chain, collectionAddress, tokenId, amount);

  let CHAIN_ID = getChainId(chain);
  return {
    chainId: "eip155:".concat(CHAIN_ID.toString()),
    method: "eth_sendTransaction",
    params: {
      abi: ERC1155_CONTRACT_ABI as Abi,
      to: collectionAddress as `0x${string}`,
      data: mintData,
      value: costs.totalCostEth.toString(),
    },
  } as TransactionTargetResponse;
}
