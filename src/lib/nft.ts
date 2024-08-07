import { ZDK, ZDKNetwork, ZDKChain } from "@zoralabs/zdk";

const zoraNetworks = [
  {
    network: ZDKNetwork.Zora,
    chain: ZDKChain.ZoraMainnet,
  },
];
const zoraZdk = new ZDK({
  endpoint: "https://api.zora.co/graphql",
  networks: zoraNetworks,
  apiKey: process.env.ZORA_API_KEY,
});

const baseNetworks = [
  {
    network: ZDKNetwork.Base,
    chain: ZDKChain.BaseMainnet,
  },
];
const baseZdk = new ZDK({
  endpoint: "https://api.zora.co/graphql",
  networks: baseNetworks,
  apiKey: process.env.ZORA_API_KEY,
});

export const getNftData = async (
  chain: string,
  collectionAddress: string,
  tokenId: string
) => {
  try {
    const wrappedZdk = chain === "base" ? baseZdk : zoraZdk;
    const response = await wrappedZdk.token({
      token: {
        address: collectionAddress as `0x${string}`,
        tokenId: tokenId,
      },
      networks: chain === "base" ? baseNetworks : zoraNetworks,
    });
    let imgUrl = response.token?.token.image?.url;
    if (imgUrl?.includes("ipfs://")) {
      const hash = imgUrl.split("ipfs://").pop();
      imgUrl = `https://gateway.pinata.cloud/ipfs/${hash}`;
    }

    return {
      name: response?.token?.token.name || "",
      description: response?.token?.token.description || "",
      image: imgUrl || "",
      mimeType: response?.token?.token.image?.mimeType || "",
    };
  } catch (error) {
    console.error("Error fetching NFT data", error);
    return {
      name: "",
      description: "",
      image: "",
      mimeType: "",
    };
  }
};
