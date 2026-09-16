"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslation, Trans } from "react-i18next";
import { gsap, useMotionGSAP } from "@/lib/gsap";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const HeroSection = () => {
  const { t } = useTranslation();
  const container = useRef<HTMLElement>(null);

  useMotionGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-tagline", { opacity: 0, y: 30, duration: 0.7 })
        .from(".hero-cta", { opacity: 0, y: 20, duration: 0.6 }, "-=0.3")
        .from(".hero-scroll", { opacity: 0, duration: 0.5 }, "-=0.2");

      gsap.to(".hero-bg", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".hero-content", {
        opacity: 0,
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "60% top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    container,
  );

  return (
    <section
      id="hero"
      ref={container}
      className="relative min-h-svh flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="hero-bg absolute inset-0 z-0 will-change-transform">
        <Image
          src="/images/hero.webp"
          alt=""
          fill
          priority
          className="object-cover scale-110"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-photo-scrim/50" />
      </div>

      <div className="hero-content relative z-10 flex flex-col items-center text-center px-4 sm:px-6 [text-shadow:0_1px_8px_var(--photo-text-shadow)]">
        <div className="hero-portrait relative size-28 sm:size-32 md:size-36 mb-6 sm:mb-8">
          <Image
            src="/images/portrait.webp"
            alt="Junhao Liao"
            fill
            priority
            className="object-cover rounded-full ring-4 ring-photo-foreground/20 shadow-2xl"
            sizes="(max-width: 640px) 112px, (max-width: 768px) 128px, 144px"
          />
        </div>

        <h1 className="hero-name text-6xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-bold text-photo-foreground tracking-tighter leading-none [text-shadow:0_2px_12px_var(--photo-title-shadow)]">
          {t("hero.name")}
        </h1>

        <p className="hero-tagline mt-4 sm:mt-6 text-lg sm:text-xl md:text-2xl text-photo-foreground/75 font-light tracking-wide max-w-2xl">
          <Trans
            i18nKey="hero.tagline"
            components={{
              link: (
                <a
                  href="https://ictrl.ca/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-photo-foreground transition-colors"
                  aria-label="iCtrl"
                />
              ),
            }}
          />
        </p>

        <div className="hero-cta mt-8 sm:mt-10">
          <a
            href="#contact"
            className={cn(buttonVariants({ size: "lg" }), "rounded-full px-10")}
          >
            {t("hero.cta")}
          </a>
        </div>
      </div>

      <div aria-hidden="true" className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <ChevronDown className="size-6 text-photo-foreground/50" />
      </div>
    </section>
  );
};

export default HeroSection;
