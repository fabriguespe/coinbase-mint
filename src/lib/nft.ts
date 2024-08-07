import { ZDK, ZDKNetwork, ZDKChain } from "@zoralabs/zdk";

const zoraZdk = new ZDK({
  endpoint: "https://api.zora.co/graphql",
  networks: [
    {
      network: ZDKNetwork.Zora,
      chain: ZDKChain.ZoraMainnet,
    },
    {
      network: ZDKNetwork.Base,
      chain: ZDKChain.BaseMainnet,
    },
  ],
  apiKey: process.env.ZORA_API_KEY,
});

export const getNftData = async (
  chain: string,
  collectionAddress: string,
  tokenId: string
) => {
  try {
    const response = await zoraZdk.token({
      token: {
        address: collectionAddress as `0x${string}`,
        tokenId: tokenId,
      },
      networks:
        chain === "base"
          ? [{ network: ZDKNetwork.Base, chain: ZDKChain.BaseMainnet }]
          : [{ network: ZDKNetwork.Zora, chain: ZDKChain.ZoraMainnet }],
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
