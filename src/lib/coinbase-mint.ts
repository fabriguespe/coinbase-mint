import { Abi, encodeFunctionData } from "viem";
import { getChainName, getPublicClient } from "./utils";
import { TransactionTargetResponse } from "frames.js";
import { COINBASE_OPENEDITION721MINT_ABI } from "./abis";

export const getCoinbase721MintTransaction = async (
  userAddress: `0x${string}`,
  chainId: string,
  nftType: string,
  collectionAddress: `0x${string}`,
  price: bigint,
  quantity: number = 1
) => {
  if (!chainId || !nftType || !collectionAddress || !userAddress || !price) {
    throw new Error("Invalid parameters");
  }

  // function mintWithComment(address to, uint256 quantity, string calldata comment) external payable;
  const mintData = encodeFunctionData({
    abi: COINBASE_OPENEDITION721MINT_ABI as Abi,
    functionName: "mintWithComment",
    args: [userAddress as `0x${string}`, quantity, ""],
  });

  return {
    chainId: "eip155:".concat(chainId.toString()),
    method: "eth_sendTransaction",
    params: {
      abi: COINBASE_OPENEDITION721MINT_ABI as Abi,
      to: collectionAddress as `0x${string}`,
      data: mintData,
      value: price.toString(),
    },
  } as TransactionTargetResponse;
};

export const getCoinbase721NftCost = async (
  chainId: string,
  collectionAddress: `0x${string}`
): Promise<bigint> => {
  const chainName = getChainName(chainId);
  const publicClient = getPublicClient(chainName);

  // read from contract
  const cost = await publicClient.readContract({
    address: collectionAddress,
    abi: COINBASE_OPENEDITION721MINT_ABI as Abi,
    functionName: "cost",
    args: [1], // quantity uint256
  });

  return cost as bigint;
};
