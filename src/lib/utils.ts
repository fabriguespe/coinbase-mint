import { createPublicClient, http } from "viem";
import { zora, base, optimism, mainnet, arbitrum, blast } from "viem/chains";
import { CollectorClient, createCollectorClient } from "@zoralabs/protocol-sdk";

export const NATIVE_TOKEN: `0x${string}` =
  "0x0000000000000000000000000000000000000000";

const ethPublicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});
const basePublicClient = createPublicClient({
  chain: base,
  transport: http(),
});
const zoraPublicClient = createPublicClient({
  chain: zora,
  transport: http(),
});
const optimismPublicClient = createPublicClient({
  chain: optimism,
  transport: http(),
});
const arbitrumPublicClient = createPublicClient({
  chain: arbitrum,
  transport: http(),
});
// const blastPublicClient = createPublicClient({
//   chain: blast,
//   transport: http(),
// });

const ethCollectorClient = createCollectorClient({
  chainId: mainnet.id,
  publicClient: ethPublicClient,
});
const optimismCollectorClient = createCollectorClient({
  chainId: optimism.id,
  publicClient: optimismPublicClient,
});
const arbitrumCollectorClient = createCollectorClient({
  chainId: arbitrum.id,
  publicClient: arbitrumPublicClient,
});
// const blastCollectorClient = createCollectorClient({
//   chainId: blast.id,
//   publicClient: blastPublicClient,
// });
const baseCollectorClient = createCollectorClient({
  chainId: base.id,
  publicClient: basePublicClient,
});
const zoraCollectorClient = createCollectorClient({
  chainId: zora.id,
  publicClient: zoraPublicClient,
});

export function getCollectorClient(chain: string): CollectorClient {
  switch (chain) {
    case "base":
      return baseCollectorClient;
    case "zora":
      return zoraCollectorClient;
    case "optimism":
      return optimismCollectorClient;
    case "arbitrum":
      return arbitrumCollectorClient;
    // case "blast":
    //   return blastCollectorClient;
    case "eth":
      return ethCollectorClient;
    default:
      return zoraCollectorClient;
  }
}

export function getChainId(chain: string): number {
  switch (chain) {
    case "base":
      return base.id;
    case "zora":
      return zora.id;
    case "optimism":
      return optimism.id;
    case "arbitrum":
      return arbitrum.id;
    // case "blast":
    //   return blast.id;
    case "eth":
      return mainnet.id;
    default:
      return zora.id;
  }
}

export function getPublicClient(chain: string) {
  switch (chain) {
    case "base":
      return basePublicClient;
    case "zora":
      return zoraPublicClient;
    case "optimism":
      return optimismPublicClient;
    case "arbitrum":
      return arbitrumPublicClient;
    // case "blast":
    //   return blastPublicClient;
    case "eth":
      return ethPublicClient;
    default:
      return zoraPublicClient;
  }
}

export async function getTransactionReceipt(
  chain: string,
  txHash: `0x${string}`
) {
  const publicClient = getPublicClient(chain);
  publicClient.getTransactionReceipt({
    hash: txHash,
  });
}

export function getBlockExplorer(chain: string, txHash: `0x${string}`) {
  switch (chain) {
    case "base":
      return `https://basescan.org/tx/${txHash}`;
    case "zora":
      return `https://explorer.zora.energy/tx/${txHash}`;
    case "optimism":
      return `https://optimistic.etherscan.io/tx/${txHash}`;
    case "arbitrum":
      return `https://arbiscan.io/tx/${txHash}`;
    // case "blast":
    //   return `https://blastscan.io/tx/${txHash}`;
    case "eth":
      return `https://etherscan.io/tx/${txHash}`;
    default:
      return `https://explorer.zora.energy/tx/${txHash}`;
  }
}

const supportedChains = [
  "zora",
  "eth",
  "optimism",
  "base",
  "arbitrum",
  // "blast",
];
const supportedChainIds = [
  "7777777",
  "1",
  "10",
  "8453",
  "42161",
  // "81457",
];

export function isSupportedChain(chain: string) {
  return supportedChains.includes(chain);
}

export function isSupportedChainId(chainId: string) {
  return supportedChainIds.includes(chainId);
}

export function getChainName(chainId: string) {
  switch (chainId) {
    case "7777777":
      return "zora";
    case "1":
      return "eth";
    case "10":
      return "optimism";
    case "8453":
      return "base";
    case "42161":
      return "arbitrum";
    // case "81457":
    //   return "blast";
  }
  return "base";
}
