/** Shared constants used across multiple components. */

/** Logo image className presets for timeline items. */
export const LOGO_CLASSES = {
  FILL: "size-full object-cover rounded-full",
  CREST: "size-7 sm:size-9 object-contain",
  WIDE: "w-8 h-4 sm:w-9 sm:h-5 object-contain",
} as const;

/** GSAP ScrollTrigger start positions shared across section animations. */
export const SCROLL_TRIGGERS = {
  HEADING: "top 85%",
  ITEM: "top 75%",
  LINE_START: "top 70%",
  LINE_END: "80% 50%",
  PUBLICATION: "top 90%",
} as const;
