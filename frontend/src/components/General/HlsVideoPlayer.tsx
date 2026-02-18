// import { useEffect, useRef } from "react";
// import Hls from "hls.js";

// interface HLSVideoPlayerProps {
//   src: string;
//   className?: string;
// }

// const HlsVideoPlayer: React.FC<HLSVideoPlayerProps> = ({ src, className }) => {
//   const videoRef = useRef<HTMLVideoElement | null>(null);

//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) {
//       return;
//     }

//     let hls: Hls | null = null;

//     if (Hls.isSupported()) {
//       hls = new Hls();
//       hls.loadSource(src);
//       hls.attachMedia(video);

//       return () => {
//         if (hls) {
//           hls.destroy();
//         }
//       };
//     } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
//       video.src = src;
//     }
//   }, [src]);
//   return;
//   <video
//     ref={videoRef}
//     controls
//     playsInline
//     className={
//       className ?? "rounded-xl w-full max-h-[500px] object-contain bg-black"
//     }
//   />;
// };

// export default HlsVideoPlayer;

import { useEffect, useRef, type JSX } from "react";
import Hls from "hls.js";

interface HLSVideoPlayerProps {
  src: string;
  className?: string;
}

const HLSVideoPlayer = ({
  src,
  className,
}: HLSVideoPlayerProps): JSX.Element => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS support (Safari)
      video.src = src;
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      controls
      playsInline
      className={
        className ?? "rounded-xl w-full max-h-[500px] object-contain bg-black"
      }
    />
  );
};

export default HLSVideoPlayer;
