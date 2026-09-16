"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { cn, smoothScrollTo } from "@/lib/utils";
import { parseLocalePath, NAV_SECTIONS } from "@/lib/locales";
import { Menu, ExternalLink } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Navbar = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { urlLocale, isHome } = parseLocalePath(pathname);

  const navRef = useRef<HTMLElement>(null);
  const [scrollPastHero, setScrollPastHero] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isScrolled = !isHome || scrollPastHero;

  useEffect(() => {
    if (!isHome) return;
    const handler = () => setScrollPastHero(window.scrollY > 80);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [isHome]);

  const handleNavClick = (id: string) => {
    setMobileOpen(false);
    if (isHome) {
      setTimeout(() => smoothScrollTo(id), 50);
    } else {
      window.location.assign(`/${urlLocale}/#${id}`);
    }
  };

  return (
    <header
      ref={navRef}
      className={cn("fixed top-0 left-0 right-0 z-50 text-foreground transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
          : "photo-surface bg-transparent"
      )}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href={`/${urlLocale}/`}
          onClick={(e) => {
            if (isHome) {
              e.preventDefault();
              smoothScrollTo("hero");
            }
          }}
          className="text-lg font-bold tracking-tight transition-colors"
        >
          Junhao
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 text-muted-foreground">
          {NAV_SECTIONS.map((section) => (
            <Button
              key={section}
              variant="ghost"
              size="sm"
              onClick={() => handleNavClick(section)}
            >
              {t(`nav.${section}`)}
            </Button>
          ))}

          <a
            href="https://ictrl.ca/"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            {t("nav.ictrl")}
            <ExternalLink data-icon="inline-end" />
          </a>

          <Separator orientation="vertical" className="h-5 mx-1 self-center" />

          <div className="flex items-center gap-1 text-foreground">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile nav */}
        <div className="flex md:hidden items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open menu"
                />
              }
            >
              <Menu data-icon="inline-start" />
            </SheetTrigger>
            <SheetContent side="right" className="w-64 pt-12">
              <SheetTitle className="sr-only">{t("nav.menu")}</SheetTitle>
              <nav className="flex flex-col gap-1 text-muted-foreground" aria-label={t("nav.menu")}>
                {NAV_SECTIONS.map((section) => (
                  <Button
                    key={section}
                    variant="ghost"
                    onClick={() => handleNavClick(section)}
                    className="justify-start px-4"
                  >
                    {t(`nav.${section}`)}
                  </Button>
                ))}
                <a
                  href="https://ictrl.ca/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className={cn(buttonVariants({ variant: "ghost" }), "justify-start px-4")}
                >
                  {t("nav.ictrl")}
                  <ExternalLink data-icon="inline-end" />
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
