import { appURL, FRAMES_BASE_PATH } from "@/lib/frames";
import type { Metadata } from "next";
import { fetchMetadata } from "frames.js/next";
import { RedirectToZora } from "@/app/components/RedirectToZora";

interface HomeProps {
  params: {
    chain: string;
    collectionAddress: string;
    tokenId: string;
  };
}

export async function generateMetadata({
  params,
}: HomeProps): Promise<Metadata> {
  return {
    title: "XMTP x Base x Zora",
    description: "Mint with a frame on zora...",
    other: {
      ...(await fetchMetadata(
        new URL(
          `${FRAMES_BASE_PATH}?chain=${params.chain}&collection=${params.collectionAddress}`,
          appURL()
        )
      )),
    },
  };
}
export default function Home({ params }: HomeProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <RedirectToZora
        chain={params.chain}
        collectionAddress={params.collectionAddress}
        tokenId={params.tokenId}
      />
    </main>
  );
}
