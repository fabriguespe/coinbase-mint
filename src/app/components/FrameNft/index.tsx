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
        style={{
          opacity: 1,
          objectFit: "cover",
        }}
      />
      <div tw="w-full flex items-center justify-between absolute text-white bottom-0 text-[38px] font-light leading-8">
        <div
          tw="h-fit max-w-3/4 w-fit flex px-4 py-0"
          style={{ backgroundColor: "rgba(0,0,0, 0.7)" }}
        >
          <p>
            <b
              style={{
                fontFamily: "Urbanist-Bold",
                textAlign: "left",
                textOverflow: "ellipsis",
              }}
            >
              {title.length > 44 ? `${title.slice(0, 44)}...` : title}
            </b>
          </p>
        </div>
        <div
          tw="h-fit w-fit max-w-1/4 flex px-4 py-0"
          style={{ backgroundColor: "rgba(0,0,0, 0.7)" }}
        >
          <p tw="">{subtitle}</p>
          <p tw="">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default FrameNft;
