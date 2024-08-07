import { appURL, FRAMES_BASE_PATH } from "@/lib/frames";
import type { Metadata } from "next";
import { fetchMetadata } from "frames.js/next";
import { RedirectToZora } from "@/app/components/RedirectToZora";

export async function generateMetadata({
  params,
}: {
  params: { chain: string; collectionAddress: string; tokenId: string };
}): Promise<Metadata> {
  return {
    title: "MEM_FRAME+",
    description:
      "RANDOM ACCESS MEMORIES | LATAM CULTURE BUILDERS is a collection curated by Newtro that redefines the role of the BUILDER on the internet...",
    other: {
      ...(await fetchMetadata(
        new URL(
          `${FRAMES_BASE_PATH}?chain=${params.chain}&collection=${params.collectionAddress}&tokenId=${params.tokenId}`,
          appURL()
        )
      )),
    },
  };
}
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <RedirectToZora />
    </main>
  );
}
