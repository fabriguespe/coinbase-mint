import { Abi, encodeFunctionData } from "viem";
import { getChainName, getPublicClient } from "./utils";
import { TransactionTargetResponse } from "frames.js";
import {
  COINBASE_MINTERIMPLEMENTATION_ABI,
  COINBASE_OPENEDITION721MINT_ABI,
} from "./abis";

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

export const getCoinbase1155MintTransaction = async (
  userAddress: `0x${string}`,
  chainId: string,
  nftType: string,
  collectionAddress: `0x${string}`,
  price: bigint,
  tokenId: bigint,
  quantity: number = 1
) => {
  if (
    !chainId ||
    !nftType ||
    !collectionAddress ||
    !userAddress ||
    !price ||
    !tokenId
  ) {
    throw new Error("Invalid parameters");
  }

  // function mintWithComment(address to, uint256 quantity, string calldata comment) external payable;
  const mintData = encodeFunctionData({
    abi: COINBASE_MINTERIMPLEMENTATION_ABI as Abi,
    functionName: "mint",
    args: [tokenId, BigInt(quantity), ""], // tokenId, quantity to mint (amount), data (bytes)
  });

  return {
    chainId: "eip155:".concat(chainId.toString()),
    method: "eth_sendTransaction",
    params: {
      abi: COINBASE_MINTERIMPLEMENTATION_ABI as Abi,
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

export const getCoinbase1155NftCost = async (
  chainId: string,
  collectionAddress: `0x${string}`,
  tokenId: bigint
): Promise<bigint> => {
  const chainName = getChainName(chainId);
  const publicClient = getPublicClient(chainName);

  // read from contract
  const cost = (await publicClient.readContract({
    address: collectionAddress,
    abi: COINBASE_MINTERIMPLEMENTATION_ABI as Abi,
    functionName: "mintPrice",
    args: [tokenId], // tokenId uint256
  })) as bigint;

  // read from contract
  const platformFee = (await publicClient.readContract({
    address: collectionAddress,
    abi: COINBASE_MINTERIMPLEMENTATION_ABI as Abi,
    functionName: "getPlatformFee",
    args: [tokenId], // tokenId uint256
  })) as bigint;

  const totalCost = cost + platformFee;

  return totalCost;
};

export const isCoinbase1155Mintable = async (
  chainId: string,
  collectionAddress: `0x${string}`,
  tokenId: bigint
): Promise<boolean> => {
  const chainName = getChainName(chainId);
  const publicClient = getPublicClient(chainName);

  const isMintable = await publicClient.readContract({
    address: collectionAddress,
    abi: COINBASE_MINTERIMPLEMENTATION_ABI as Abi,
    functionName: "isMintable",
    args: [tokenId], // tokenId uint256
  });

  return isMintable as boolean;
};
