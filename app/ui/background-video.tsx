"use client";

import { useEffect, useRef } from "react";

export function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const setSlowPlayback = () => {
      video.playbackRate = 0.65;
    };

    setSlowPlayback();
    video.addEventListener("loadedmetadata", setSlowPlayback);

    return () => {
      video.removeEventListener("loadedmetadata", setSlowPlayback);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <video
        ref={videoRef}
        className="h-full w-full object-cover grayscale blur-[2px] brightness-[0.32]"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/videoarenafundo.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_36%)]" />
    </div>
  );
}
