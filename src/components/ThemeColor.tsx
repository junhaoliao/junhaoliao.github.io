"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Keep browser chrome in sync with the applied CSS theme, including saved choices. */
const ThemeColor = () => {
  const pathname = usePathname();

  useEffect(() => {
    const syncColor = () => {
      const background = getComputedStyle(document.body).backgroundColor;
      document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
        meta.content = background;
      });
    };
    // next-themes applies its class in an effect, after child effects may have run.
    const observer = new MutationObserver(syncColor);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    syncColor();
    return () => observer.disconnect();
  }, [pathname]);

  return null;
};

export default ThemeColor;
