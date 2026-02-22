"use client";

import { useRef } from "react";
import { useTranslation, Trans } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { MapPin, CalendarDays } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type TimelineItem =
  | {
      type: "experience";
      i18nKey: string;
      dates: string;
      logo: string;
      logoClassName?: string;
      highlightKey?: string;
    }
  | {
      type: "education";
      educationKey: string;
      logo: string;
      logoClassName?: string;
      url: string;
    };

// Square logos fill the circle (crop to round). Crests/wordmarks stay contained.
const LOGO_FILL = "w-full h-full object-cover rounded-full";
const LOGO_CREST = "w-7 h-7 sm:w-9 sm:h-9 object-contain";
const LOGO_WIDE = "w-8 h-4 sm:w-9 sm:h-5 object-contain";

const TIMELINE_ITEMS: TimelineItem[] = [
  { type: "experience", i18nKey: "hero.roles.yscope_mgr", dates: "Jan 2026 – Present", logo: "/images/yscope-logo.webp" },
  { type: "experience", i18nKey: "hero.previous_roles.uber", dates: "May 2024 – Jun 2025", logo: "/images/uber-logo.webp", highlightKey: "uber" },
  { type: "experience", i18nKey: "hero.roles.yscope_dev", dates: "Jan 2024 – Present", logo: "/images/yscope-logo.webp", highlightKey: "yscope_dev" },
  { type: "experience", i18nKey: "hero.previous_roles.qualcomm_ft", dates: "Sep 2022 – Dec 2023", logo: "/images/qualcomm-logo.svg", logoClassName: LOGO_WIDE, highlightKey: "qualcomm_ft" },
  {
    type: "education",
    educationKey: "uoft",
    logo: "/images/uoft-crest.svg",
    url: "https://www.utoronto.ca/",
  },
  { type: "experience", i18nKey: "hero.previous_roles.ta_2022", dates: "Jan 2022 – May 2022", logo: "/images/uoft-crest.svg", logoClassName: LOGO_CREST, highlightKey: "ta_2022" },
  { type: "experience", i18nKey: "hero.previous_roles.qualcomm_intern", dates: "May 2020 – May 2021", logo: "/images/qualcomm-logo.svg", logoClassName: LOGO_WIDE, highlightKey: "qualcomm_intern" },
  { type: "experience", i18nKey: "hero.previous_roles.ta_2021", dates: "Jan 2021 – May 2021", logo: "/images/uoft-crest.svg", logoClassName: LOGO_CREST, highlightKey: "ta_2021" },
  {
    type: "education",
    educationKey: "bodwell",
    logo: "/images/bodwell-crest.webp",
    url: "https://bodwell.edu/",
  },
  {
    type: "education",
    educationKey: "gdsyzx",
    logo: "/images/gdsyzx-logo.webp",
    url: "http://www.gdsyzx.edu.cn/",
  },
];

const PUBLICATION = {
  text: "hero.publications.asee",
  url: "https://peer.asee.org/40631",
};

export default function TimelineSection() {
  const { t } = useTranslation();
  const container = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Animate section heading
      gsap.from(".timeline-heading", {
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      // Animate timeline line drawing in via scrub
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: container.current,
              start: "top 70%",
              end: "80% 50%",
              scrub: 0.5,
            },
          },
        );
      }

      // Stagger timeline items
      gsap.from(".tl-item", {
        opacity: 0,
        x: -30,
        stagger: 0.15,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      // Publication
      gsap.from(".tl-publication", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".tl-publication",
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: container },
  );

  return (
    <section
      id="education"
      ref={container}
      className="py-32 lg:py-40 bg-background text-foreground"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="timeline-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            {t("timeline.title")}
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            ref={lineRef}
            className="absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 bg-border origin-top"
          />

          {/* Timeline items */}
          <div className="space-y-8 sm:space-y-10">
            {TIMELINE_ITEMS.map((item, idx) => {
              if (item.type === "experience") {
                return (
                  <div
                    key={item.i18nKey}
                    className="tl-item relative flex items-start gap-5 sm:gap-6 pl-14 sm:pl-18"
                  >
                    {/* Logo */}
                    <div className="absolute left-0 sm:left-1 top-0 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white flex items-center justify-center shadow-md ring-2 ring-border overflow-hidden">
                      <Image
                        src={item.logo}
                        alt=""
                        width={28}
                        height={28}
                        className={item.logoClassName ?? LOGO_FILL}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-base sm:text-lg leading-relaxed">
                        <Trans
                          i18nKey={item.i18nKey}
                          components={{
                            loc: (
                              <span className="block text-sm opacity-55 mt-0.5" />
                            ),
                          }}
                        />
                        <span className="block text-xs opacity-40 mt-1">{item.dates}</span>
                      </p>
                      {item.highlightKey && (
                        <p className="mt-2 text-sm opacity-50 leading-relaxed">
                          {t(`hero.highlights.${item.highlightKey}`)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              }

              // Education item
              const { educationKey: key, logo, logoClassName = LOGO_CREST, url } = item;
              const degree = t(`education.items.${key}.degree`);
              const details = t(`education.items.${key}.details`);

              return (
                <div
                  key={key}
                  className="tl-item relative flex items-start gap-5 sm:gap-6 pl-14 sm:pl-18"
                >
                  {/* Logo */}
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute left-0 sm:left-1 top-0 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white flex items-center justify-center shadow-md ring-2 ring-border overflow-hidden"
                  >
                    <Image
                      src={logo}
                      alt={t(`education.items.${key}.name`)}
                      width={28}
                      height={28}
                      className={logoClassName}
                    />
                  </a>

                  {/* Content */}
                  <div className="flex-1 min-w-0 p-5 sm:p-6 rounded-xl bg-muted/60 dark:bg-muted/40">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg sm:text-xl font-semibold hover:opacity-80 transition-opacity"
                    >
                      {t(`education.items.${key}.name`)}
                    </a>

                    {degree && (
                      <p className="text-sm sm:text-base opacity-70 mt-0.5">
                        {degree}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-4 mt-2 text-sm opacity-60">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {t(`education.items.${key}.years`)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {t(`education.items.${key}.location`)}
                      </span>
                    </div>

                    {details && (
                      <p className="mt-3 text-sm opacity-55 whitespace-pre-line leading-relaxed">
                        {details}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Publication */}
        <div className="tl-publication mt-12 pt-8 border-t border-border">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-50 mb-4">
            {t("hero.publications_label")}
          </p>
          <p className="text-sm opacity-60 leading-relaxed">
            {t(PUBLICATION.text)}{" "}
            <a
              href={PUBLICATION.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
              [Link]
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
