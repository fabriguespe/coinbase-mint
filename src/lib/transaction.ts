import { Abi, createPublicClient, encodeFunctionData, http } from "viem";
import { zora, base } from "viem/chains";
import { ERC1155_CONTRACT_ABI } from "@/lib/abis";
import { createCollectorClient } from "@zoralabs/protocol-sdk";
import { TransactionTargetResponse } from "frames.js";

export const NATIVE_TOKEN: `0x${string}` =
  "0x0000000000000000000000000000000000000000";

export const basePublicClient = createPublicClient({
  chain: base,
  transport: http(),
});
const baseCollectorClient = createCollectorClient({
  chainId: base.id,
  publicClient: basePublicClient,
});

export const zoraPublicClient = createPublicClient({
  chain: zora,
  transport: http(),
});
const zoraCollectorClient = createCollectorClient({
  chainId: zora.id,
  publicClient: zoraPublicClient,
});

export async function getNftPrice(
  chain: string,
  collectionAddress: string,
  tokenId: string,
  amount?: number
) {
  if (!chain || !collectionAddress || !tokenId) {
    throw new Error("Invalid getNftPrice parameters");
  }

  let wrappedCollectorClient =
    chain === "base" ? baseCollectorClient : zoraCollectorClient;
  try {
    const { prepareMint } = await wrappedCollectorClient.getToken({
      tokenContract: collectionAddress as `0x${string}`,
      tokenId: BigInt(tokenId),
      mintType: "1155",
    });
    try {
      const { costs } = prepareMint({
        minterAccount: "0x699d04F9994f181F3E310F70cF6aC8E8445aCe9A",
        quantityToMint: amount ? amount : 1,
      });
      return costs;
    } catch (e) {
      console.error("Error fetching token costs", e, "2");
      throw new Error("Error fetching token costs");
    }
  } catch (e) {
    console.error("Error fetching token data", e, "1");
    throw new Error("Error fetching token data");
  }
}

export async function mint1155Creator(
  chain: string,
  collectionAddress: string,
  tokenId: string,
  fromAddress: string,
  amount?: number,
  comment?: string
) {
  if (!chain || !collectionAddress || !tokenId || !fromAddress) {
    throw new Error("Invalid mint parameters");
  }
  let wrappedCollectorClient =
    chain === "base" ? baseCollectorClient : zoraCollectorClient;

  // prepare the mint transaction
  const collectorData = await wrappedCollectorClient.mint({
    // 1155 contract address
    tokenContract: collectionAddress as `0x${string}`,
    // type of item to mint
    mintType: "1155",
    // 1155 token id to mint
    tokenId: BigInt(tokenId),
    // quantity of tokens to mint
    quantityToMint: amount ? amount : 1,
    // optional comment to include with the mint
    mintComment: comment,
    // optional address that will receive a mint referral reward
    mintReferral: process.env.ZORA_REFERRAL_ADDRESS
      ? (process.env.ZORA_REFERRAL_ADDRESS as `0x${string}`)
      : undefined,
    // account that is to invoke the mint transaction
    minterAccount: fromAddress as `0x${string}`,
  });

  const mintData = encodeFunctionData(collectorData.parameters);

  const costs = await getNftPrice(chain, collectionAddress, tokenId, amount);

  const CHAIN_ID = chain === "base" ? "8453" : "7777777";
  return {
    chainId: "eip155:".concat(CHAIN_ID),
    method: "eth_sendTransaction",
    params: {
      abi: ERC1155_CONTRACT_ABI as Abi,
      to: collectionAddress as `0x${string}`,
      data: mintData,
      value: costs.totalCostEth.toString(),
    },
  } as TransactionTargetResponse;
}
