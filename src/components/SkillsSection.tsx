"use client";

import { useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, Globe, Cog } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const FEATURED_SKILLS = [
  { key: "cpp", icon: <Code2 className="h-6 w-6" />, color: "text-rose-500" },
  { key: "web", icon: <Globe className="h-6 w-6" />, color: "text-amber-500" },
  { key: "rust", icon: <Cog className="h-6 w-6" />, color: "text-orange-500" },
] as const;

const CATEGORY_KEYS = ["languages", "infrastructure", "hardware"] as const;

export default function SkillsSection() {
  const { t } = useTranslation();
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".skill-card", {
        opacity: 0,
        y: 40,
        stagger: 0.1,
        duration: 0.6,
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
    <section id="skills" ref={container} className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {t("skills.title")}
          </h2>
        </div>

        {/* Featured skills — detailed cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {FEATURED_SKILLS.map(({ key, icon, color }) => (
            <Card
              key={key}
              className="skill-card group hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-muted ${color}`}>
                    {icon}
                  </div>
                  <CardTitle className="text-lg">
                    {t(`skills.items.${key}.name`)}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {(t(`skills.items.${key}.tags`, { returnObjects: true }) as string[]).map(
                  (tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="mr-1.5 mb-1.5"
                    >
                      {tag}
                    </Badge>
                  ),
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional skills — categorized columns */}
        <div className="skill-card">
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-5">
            {t("skills.also")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {CATEGORY_KEYS.map((cat) => (
              <div key={cat}>
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  {t(`skills.categories.${cat}.title`)}
                </h3>
                <ul className="space-y-2">
                  {(
                    t(`skills.categories.${cat}.items`, {
                      returnObjects: true,
                    }) as string[]
                  ).map((item) => (
                    <li
                      key={item}
                      className="text-sm text-muted-foreground flex items-center gap-2"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
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
}
