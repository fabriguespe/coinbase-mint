import { appURL } from "@/lib/frames";

interface FrameNftProps {
  imgSrc: string;
  title: string;
  subtitle: string;
  description?: string;
}

const FrameNft = ({ imgSrc, title, subtitle, description }: FrameNftProps) => {
  return (
    <div tw="relative flex flex-col text-center items-center justify-center">
      <img
        src={imgSrc}
        tw="h-full"
        style={{ opacity: 1, objectFit: "cover" }}
      />
      <div
        tw="w-full flex flex-col absolute text-white bottom-0 py-16 px-10 text-[48px] font-light leading-8"
        style={{ backgroundColor: "rgba(0,0,0, 0.8)" }}
      >
        <p>
          <b
            style={{
              fontFamily: "Urbanist-Bold",
              lineHeight: 1.5,
              textAlign: "left",
            }}
          >
            {title}
          </b>
        </p>
        <p tw="-mt-4 text-[38px]">{subtitle}</p>
        <p tw="-mt-4 text-[38px]">{description}</p>
      </div>
    </div>
  );
};

export default FrameNft;
