"use client";

import { useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { URL_LOCALES, LOCALE_LABELS, LOCALE_RE, NAV_SECTIONS, parseLocalePath, type UrlLocale } from "@/lib/locales";

const SHORT_LABELS: Record<UrlLocale, string> = {
  en: "EN",
  fr: "FR",
  zh: "\u7b80",
  "zh-Hant": "\u7e41",
};

/** NAV_SECTIONS reversed (bottom-up) + "hero" for viewport detection. */
const HOME_SECTIONS = [...[...NAV_SECTIONS].reverse(), "hero"] as const;

const getCurrentSection = (): string | null => {
  for (const id of HOME_SECTIONS) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top < window.innerHeight / 2) {
      return id === "hero" ? null : id;
    }
  }
  return null;
};

const LanguageSwitcher = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { urlLocale: currentUrlLocale, isHome } = parseLocalePath(pathname);

  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  const switchLocale = (target: UrlLocale) => {
    let newPath = pathname.replace(LOCALE_RE, `/${target}$2`);
    if (isHome) {
      const section = getCurrentSection();
      if (section) newPath += `#${section}`;
    }
    router.push(newPath);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        render={
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 px-2"
            aria-label={`${SHORT_LABELS[currentUrlLocale]} — Change language`}
          />
        }
      >
        <span className="text-sm font-medium">{SHORT_LABELS[currentUrlLocale]}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {URL_LOCALES.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => switchLocale(loc)}
            className={currentUrlLocale === loc ? "font-semibold bg-accent" : ""}
          >
            {LOCALE_LABELS[loc]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
