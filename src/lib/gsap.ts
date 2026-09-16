import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Run decorative motion only while allowed, reverting styles and triggers on change/unmount. */
export const useMotionGSAP = (animate: () => void, scope: RefObject<HTMLElement | null>) => {
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", animate, scope);
    return () => media.revert();
  }, { scope });
};

export { gsap, ScrollTrigger };
