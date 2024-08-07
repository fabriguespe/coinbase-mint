import {
  encodeAbiParameters,
  createPublicClient,
  encodeFunctionData,
  http,
} from "viem";
import { zora, base } from "viem/chains";
import {
  ERC1155_CONTRACT_ABI,
  ERC20_ABI,
  ZORA_FIXED_PRICE_STRATEGY_ABI,
  ZORA_MERKLE_MINT_STRATEGY_ABI,
} from "@/lib/abis";
import { TOKENS } from "./tokens";
import { createCollectorClient } from "@zoralabs/protocol-sdk";

export const NATIVE_TOKEN: `0x${string}` =
  "0x0000000000000000000000000000000000000000";

export const CHAIN_ID = parseInt(process.env.CHAIN_ID || "7777777"); // zora mainnet
// export const CHAIN_ID = 8453; // base mainnet

export const zoraPublicClient = createPublicClient({
  chain: zora,
  transport: http(),
});
export const basePublicClient = createPublicClient({
  chain: base,
  transport: http(),
});

const zoraCollectorClient = createCollectorClient({
  chainId: zora.id,
  publicClient: zoraPublicClient,
});
const baseCollectorClient = createCollectorClient({
  chainId: zora.id,
  publicClient: zoraPublicClient,
});

export async function getTokenBalance(address: string, token: string) {
  if (!address || !token) {
    throw new Error("Address and token are required");
  }

  const tokenAddress = TOKENS[CHAIN_ID as number][token];
  if (tokenAddress === NATIVE_TOKEN) {
    const balance = (await zoraPublicClient.getBalance({
      address: address as `0x${string}`,
    })) as bigint;

    return balance;
  }

  const balance = (await zoraPublicClient.readContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
  })) as bigint;

  return balance;
}

export async function checkTokenDecimals(
  tokenAddress: string
): Promise<number> {
  if (!tokenAddress) {
    throw new Error("Token address is required");
  }

  if (tokenAddress === NATIVE_TOKEN) {
    return 18;
  }

  const decimals = (await zoraPublicClient.readContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "decimals",
  })) as number;

  if (isNaN(decimals)) {
    throw new Error(`Token decimals not available for address ${tokenAddress}`);
  }

  return decimals;
}

export async function getNftPrice(
  chain: string,
  collectionAddress: string,
  tokenId: string,
  fromAddress: string,
  amount?: number
) {
  let wrappedCollectorClient = zoraCollectorClient;
  if (chain === "base") {
    wrappedCollectorClient = baseCollectorClient;
  }
  const { prepareMint } = await wrappedCollectorClient.getToken({
    // 1155 contract address
    tokenContract: collectionAddress as `0x${string}`,
    // 1155 token id
    tokenId: BigInt(tokenId),
    mintType: "1155",
  });
  const { costs } = prepareMint({
    minterAccount: fromAddress as `0x${string}`,
    quantityToMint: amount ? amount : 1,
  });

  return costs;
}

export async function mint1155Creator(
  chain: string,
  collectionAddress: string,
  tokenId: string,
  fromAddress: string,
  amount?: number,
  comment?: string
) {
  if (!collectionAddress || !tokenId || !fromAddress) {
    throw new Error("Invalid mint parameters");
  }
  let wrappedCollectorClient = zoraCollectorClient;
  if (chain === "base") {
    wrappedCollectorClient = baseCollectorClient;
  }

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
    mintReferral: "0x0C8596Ee50e06Ce710237c9c905D4aB63A132207",
    // account that is to invoke the mint transaction
    minterAccount: fromAddress as `0x${string}`,
  });

  const mintData = encodeFunctionData(collectorData.parameters);

  const costs = await getNftPrice(
    chain,
    collectionAddress,
    tokenId,
    fromAddress,
    amount
  );

  return {
    chainId: "eip155:".concat(CHAIN_ID.toString()),
    method: "eth_sendTransaction",
    params: {
      abi: ERC1155_CONTRACT_ABI,
      to: collectionAddress as `0x${string}`,
      data: mintData,
      value: costs.totalCostEth.toString(),
    },
  };
}
