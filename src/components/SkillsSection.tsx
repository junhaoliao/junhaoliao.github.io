"use client";

import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { gsap, useGSAP } from "@/lib/gsap";
import { Badge } from "@/components/ui/badge";
import { Code2, Globe, Cog } from "lucide-react";

const FEATURED_SKILLS = [
  { key: "cpp", icon: <Code2 className="h-8 w-8" />, color: "text-rose-500" },
  { key: "web", icon: <Globe className="h-8 w-8" />, color: "text-amber-500" },
  { key: "rust", icon: <Cog className="h-8 w-8" />, color: "text-orange-500" },
] as const;

const CATEGORY_KEYS = ["languages", "infrastructure", "hardware", "spoken"] as const;

const SkillsSection = () => {
  const { t } = useTranslation();
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(".section-heading",
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: container.current, start: "top 85%", toggleActions: "play none none reverse" },
        },
      );

      gsap.utils.toArray<HTMLElement>(".skill-row").forEach((row, i) => {
        gsap.fromTo(row,
          { opacity: 0, x: i % 2 === 0 ? -60 : 60 },
          {
            opacity: 1, x: 0, duration: 0.8, ease: "power2.out",
            scrollTrigger: { trigger: row, start: "top 85%", toggleActions: "play none none reverse" },
          },
        );
      });

      gsap.fromTo(".category-grid",
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
          scrollTrigger: { trigger: ".category-grid", start: "top 85%", toggleActions: "play none none reverse" },
        },
      );
    },
    { scope: container },
  );

  return (
    <section id="skills" ref={container} className="py-32 lg:py-40 bg-muted/40 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="section-heading opacity-0 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            {t("skills.title")}
          </h2>
        </div>

        <div className="space-y-12 sm:space-y-16 mb-16 sm:mb-20">
          {FEATURED_SKILLS.map(({ key, icon, color }, index) => (
            <div
              key={key}
              className={`skill-row opacity-0 flex flex-col ${index % 2 === 1 ? "items-end text-right" : "items-start text-left"}`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-2xl bg-muted/60 ${color}`}>
                  {icon}
                </div>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                  {t(`skills.items.${key}.name`)}
                </h3>
              </div>
              <div className={`flex flex-wrap gap-2 sm:gap-3 ${index % 2 === 1 ? "justify-end" : ""}`}>
                {(t(`skills.items.${key}.tags`, { returnObjects: true }) as string[]).map(
                  (tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-sm px-3 py-1 h-auto"
                    >
                      {tag}
                    </Badge>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="category-grid opacity-0 border-t border-border/50 pt-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-8">
            {t("skills.also")}
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {CATEGORY_KEYS.map((cat) => (
              <div key={cat}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground mb-4">
                  {t(`skills.categories.${cat}.title`)}
                </h3>
                <ul className="space-y-2.5">
                  {(
                    t(`skills.categories.${cat}.items`, {
                      returnObjects: true,
                    }) as string[]
                  ).map((item) => (
                    <li
                      key={item}
                      className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
