import { useEffect } from "react";

export const useKeySound = (soundUrl: string, key?: string) => {
  useEffect(() => {
    const audio = new Audio(soundUrl);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!key || e.key.toLowerCase() === key.toLowerCase()) {
        audio.currentTime = 0; // rewind so it plays every press
        audio.play().catch(() => {
          // ignore autoplay errors
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [soundUrl, key]);
};
