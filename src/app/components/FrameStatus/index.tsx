import { appURL } from "@/lib/frames";

interface FrameStatusProps {
  status: string;
}
const FrameStatus = ({ status }: FrameStatusProps) => {
  return (
    <div tw="relative flex flex-col text-center items-center justify-center">
      <img
        src={`${appURL()}/images/frame-landing.gif`}
        tw="w-full"
        style={{ opacity: 1, objectFit: "cover" }}
      />
      <div
        tw="w-full flex flex-col absolute text-white bottom-0 py-16 px-10 text-[48px] font-light leading-8"
        style={{ backgroundColor: "rgba(0,0,0, 0.8)" }}
      >
        <p tw="mr-2">
          <b style={{ fontFamily: "Urbanist-Bold" }}>{status}</b>
        </p>
      </div>
    </div>
  );
};

export default FrameStatus;
