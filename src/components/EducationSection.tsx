"use client";

import { useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MapPin, CalendarDays } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SCHOOLS = [
  {
    key: "uoft",
    url: "https://www.utoronto.ca/",
  },
  {
    key: "bodwell",
    url: "https://bodwell.edu/",
  },
  {
    key: "gdsyzx",
    url: "http://www.gdsyzx.edu.cn/",
  },
] as const;

export default function EducationSection() {
  const { t } = useTranslation();
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".edu-item", {
        opacity: 0,
        x: -30,
        stagger: 0.15,
        duration: 0.65,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: container },
  );

  return (
    <section id="education" ref={container} className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {t("education.title")}
          </h2>
        </div>

        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-border hidden sm:block" />

          <div className="space-y-10">
            {SCHOOLS.map(({ key, url }) => {
              const degree = t(`education.items.${key}.degree`);
              const details = t(`education.items.${key}.details`);
              return (
                <div key={key} className="edu-item flex gap-6">
                  {/* Timeline dot */}
                  <div className="hidden sm:flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-primary mt-2 shrink-0 z-10" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-2">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl font-semibold hover:text-primary transition-colors"
                    >
                      {t(`education.items.${key}.name`)}
                    </a>

                    {degree && (
                      <p className="text-base text-muted-foreground mt-0.5">{degree}</p>
                    )}

                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
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
                      <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line">
                        {details}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
