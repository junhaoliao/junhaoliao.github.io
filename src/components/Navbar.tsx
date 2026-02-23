"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { smoothScrollTo } from "@/lib/utils";
import { Menu, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const NAV_SECTIONS = ["skills", "projects", "education", "blog", "contact"] as const;

export default function Navbar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const navRef = useRef<HTMLElement>(null);
  const [scrollPastHero, setScrollPastHero] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isScrolled = !isHome || scrollPastHero;

  useGSAP(
    () => {
      if (!isHome) return;
      ScrollTrigger.create({
        trigger: "#hero",
        start: "bottom 80px",
        onEnterBack: () => setScrollPastHero(false),
        onLeave: () => setScrollPastHero(true),
      });
    },
    { scope: navRef, dependencies: [isHome] },
  );

  // Eager scroll listener so the navbar is styled before ScrollTrigger initializes
  useEffect(() => {
    if (!isHome) return;
    const handler = () => setScrollPastHero(window.scrollY > 80);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [isHome]);

  const handleNavClick = (id: string) => {
    setMobileOpen(false);
    if (isHome) {
      setTimeout(() => smoothScrollTo(id), 50);
    } else {
      window.location.assign(`/#${id}`);
    }
  };

  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          onClick={(e) => {
            if (isHome) {
              e.preventDefault();
              smoothScrollTo("hero");
            }
          }}
          className={`text-lg font-bold tracking-tight transition-colors ${
            isScrolled ? "text-foreground" : "text-white"
          }`}
        >
          Junhao
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_SECTIONS.map((section) => (
            <button
              key={section}
              onClick={() => handleNavClick(section)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isScrolled
                  ? "text-muted-foreground hover:text-foreground hover:bg-accent"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              {t(`nav.${section}`)}
            </button>
          ))}

          <a
            href="https://ictrl.ca/"
            target="_blank"
            rel="noopener noreferrer"
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors inline-flex items-center gap-1 ${
              isScrolled
                ? "text-muted-foreground hover:text-foreground hover:bg-accent"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            {t("nav.ictrl")}
            <ExternalLink className="h-3 w-3" />
          </a>

          <Separator orientation="vertical" className={`h-5 mx-1 ${isScrolled ? "" : "bg-white/30"}`} />

          <div className={`flex items-center gap-1 ${isScrolled ? "" : "text-white [&_button]:text-white [&_button]:hover:bg-white/10"}`}>
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile nav */}
        <div className={`flex md:hidden items-center gap-1 ${isScrolled ? "" : "text-white [&_button]:text-white [&_button]:hover:bg-white/10"}`}>
          <LanguageSwitcher />
          <ThemeToggle />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className={`w-9 h-9 ${isScrolled ? "" : "text-white hover:bg-white/10"}`}
                  aria-label="Open menu"
                />
              }
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-64 pt-12">
              <div className="flex flex-col gap-1">
                {NAV_SECTIONS.map((section) => (
                  <button
                    key={section}
                    onClick={() => handleNavClick(section)}
                    className="text-left px-4 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    {t(`nav.${section}`)}
                  </button>
                ))}
                <a
                  href="https://ictrl.ca/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors inline-flex items-center gap-1.5"
                >
                  {t("nav.ictrl")}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
