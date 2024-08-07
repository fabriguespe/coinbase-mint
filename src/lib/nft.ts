import { ZDK, ZDKNetwork, ZDKChain } from "@zoralabs/zdk";

const zoraZdk = new ZDK({
  endpoint: "https://api.zora.co/graphql",
  networks: [
    {
      network: ZDKNetwork.Zora,
      chain: ZDKChain.ZoraMainnet,
    },
  ],
  apiKey: process.env.ZORA_API_KEY,
});
const baseZdk = new ZDK({
  endpoint: "https://api.zora.co/graphql",
  networks: [
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
  let wZdk = zoraZdk;
  if (chain === "base") {
    wZdk = baseZdk;
  }
  const response = await wZdk.token({
    token: {
      address: collectionAddress as `0x${string}`,
      tokenId: tokenId,
    },
    networks: [
      {
        network: ZDKNetwork.Base,
        chain: ZDKChain.BaseMainnet,
      },
    ],
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
};
