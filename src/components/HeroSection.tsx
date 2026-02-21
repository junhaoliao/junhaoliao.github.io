"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslation, Trans } from "react-i18next";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

gsap.registerPlugin(useGSAP);

function smoothScrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function HeroSection() {
  const { t } = useTranslation();
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-portrait", { opacity: 0, scale: 0.85, duration: 0.9 })
        .from(".hero-name", { opacity: 0, y: 30, duration: 0.7 }, "-=0.5")
        .from(".hero-role", { opacity: 0, y: 20, duration: 0.6 }, "-=0.4")
        .from(".hero-list-item", { opacity: 0, y: 15, stagger: 0.08, duration: 0.5 }, "-=0.3")
        .from(".hero-cta", { opacity: 0, y: 10, duration: 0.4 }, "-=0.2")
        .from(".hero-scroll", { opacity: 0, duration: 0.4 }, "-=0.1");
    },
    { scope: container },
  );

  return (
    <section
      id="hero"
      ref={container}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero.webp"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Consistent overlay — hero always uses white text regardless of theme */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/45 to-black/25" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 sm:gap-8 lg:gap-16 items-center">
          {/* Text — text-shadow boosts contrast without needing a heavier overlay */}
          <div className="order-2 md:order-1 [text-shadow:0_1px_6px_rgba(0,0,0,0.7)]">
            <h1 className="hero-name text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-3 sm:mb-6 [text-shadow:0_2px_10px_rgba(0,0,0,0.6)]">
              {t("hero.name")}
            </h1>

            {/* Current */}
            <p className="hero-role text-sm font-semibold uppercase tracking-widest text-blue-200 mb-2">
              {t("hero.current")}
            </p>
            <ul className="hero-list-item mb-5 sm:mb-7 space-y-1.5 sm:space-y-2 list-disc pl-5 marker:text-blue-300/80">
              <li className="text-base sm:text-lg text-white">
                <Trans
                  i18nKey="hero.roles.yscope"
                  components={{
                    loc: <span className="text-white/75" />,
                  }}
                />
              </li>
              <li className="text-base sm:text-lg text-white/95">
                <Trans
                  i18nKey="hero.roles.ictrl_contributor"
                  components={{
                    link: (
                      <a
                        href="https://ictrl.ca/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2 hover:text-blue-300 transition-colors"
                      />
                    ),
                  }}
                />
              </li>
            </ul>

            {/* Previously */}
            <p className="hero-list-item text-sm font-semibold uppercase tracking-widest text-blue-200 mb-2">
              {t("hero.previously")}
            </p>
            <ul className="space-y-1 sm:space-y-1.5 mb-5 sm:mb-7 list-disc pl-5 marker:text-white/50">
              {(["uber", "qualcomm", "ta", "student"] as const).map((key) => (
                <li key={key} className="hero-list-item text-base text-white/90">
                  <Trans
                    i18nKey={`hero.previous_roles.${key}`}
                    components={{
                      loc: <span className="text-white/70" />,
                    }}
                  />
                </li>
              ))}
            </ul>

            {/* Publication */}
            <p className="hero-list-item text-sm font-semibold uppercase tracking-widest text-blue-200 mb-1">
              {t("hero.publications")}
            </p>
            <p className="hero-list-item text-sm text-white/85 mb-5 sm:mb-8 leading-relaxed">
              {t("hero.publication")}{" "}
              <a
                href="https://peer.asee.org/40631"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-blue-300 transition-colors"
              >
                https://peer.asee.org/40631
              </a>
            </p>

            <div className="hero-cta">
              <Button
                size="lg"
                onClick={() => smoothScrollTo("contact")}
                className="rounded-full px-8 font-semibold"
              >
                {t("hero.cta")}
              </Button>
            </div>
          </div>

          {/* Portrait */}
          <div className="order-1 md:order-2 flex justify-center">
            <div className="hero-portrait relative w-32 h-32 sm:w-52 sm:h-52 md:w-60 md:h-60 lg:w-64 lg:h-64">
              <Image
                src="/images/portrait.webp"
                alt="Junhao Liao"
                fill
                priority
                className="object-cover rounded-full ring-4 ring-white/20 shadow-2xl"
                sizes="(max-width: 640px) 128px, (max-width: 768px) 208px, (max-width: 1024px) 240px, 256px"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown className="h-6 w-6 text-white/50" />
      </div>
    </section>
  );
}
