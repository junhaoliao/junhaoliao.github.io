"use client";

import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { gsap, useGSAP } from "@/lib/gsap";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink } from "lucide-react";

const FEATURED_PROJECT = {
  key: "ictrl",
  logo: "/images/ictrl-logo.svg",
  screenshot: "/images/ictrl-screenshot.webp",
  githubUrl: "https://github.com/junhaoliao/iCtrl",
  externalUrl: "https://ictrl.ca/",
} as const;

const SECONDARY_PROJECTS = [
  {
    key: "github",
    logo: "/images/github-mark.svg",
    githubUrl: "https://github.com/junhaoliao",
  },
  {
    key: "ict",
    logo: "/images/ict-robotics.webp",
    externalUrl: "https://ictziv.weebly.com/",
  },
] as const;

export default function ProjectsSection() {
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

      gsap.fromTo(".featured-card",
        { opacity: 0, y: 40, scale: 0.97 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: ".featured-card", start: "top 85%", toggleActions: "play none none reverse" },
        },
      );

      gsap.fromTo(".project-card",
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 0.7, ease: "power2.out",
          scrollTrigger: { trigger: ".project-card", start: "top 85%", toggleActions: "play none none reverse" },
        },
      );
    },
    { scope: container },
  );

  return (
    <section id="projects" ref={container} className="py-32 lg:py-40 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="section-heading opacity-0 mb-10 sm:mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">
            {t("projects.featured_label")}
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            {t("projects.title")}
          </h2>
        </div>

        <div className="featured-card opacity-0 mb-8 rounded-2xl ring-1 ring-foreground/10 bg-card shadow-xs overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src={FEATURED_PROJECT.logo}
                  alt={t(`projects.items.${FEATURED_PROJECT.key}.name`)}
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain"
                />
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                  {t(`projects.items.${FEATURED_PROJECT.key}.name`)}
                </h3>
              </div>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
                {t(`projects.items.${FEATURED_PROJECT.key}.description`)}
              </p>
              <div className="flex gap-3">
                <Button variant="outline" nativeButton={false} render={<a href={FEATURED_PROJECT.githubUrl} target="_blank" rel="noopener noreferrer" />} className="inline-flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  {t("projects.view_github")}
                </Button>
                <Button variant="outline" nativeButton={false} render={<a href={FEATURED_PROJECT.externalUrl} target="_blank" rel="noopener noreferrer" />} className="inline-flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  {t("projects.view_link")}
                </Button>
              </div>
            </div>

            <div className="relative min-h-[200px] lg:min-h-0">
              <Image
                src={FEATURED_PROJECT.screenshot}
                alt="iCtrl screenshot"
                fill
                className="object-cover brightness-75 saturate-75"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card/60 via-card/20 to-transparent" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {SECONDARY_PROJECTS.map((project) => {
            const desc = t(`projects.items.${project.key}.description`);
            return (
              <Card
                key={project.key}
                className="project-card opacity-0 flex flex-col"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Image
                      src={project.logo}
                      alt={t(`projects.items.${project.key}.name`)}
                      width={40}
                      height={40}
                      className="w-10 h-10 object-contain shrink-0"
                    />
                    <CardTitle className="text-xl">
                      {t(`projects.items.${project.key}.name`)}
                    </CardTitle>
                  </div>
                </CardHeader>

                {desc && (
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </CardContent>
                )}

                <CardFooter className="gap-2 mt-auto pt-4">
                  {"githubUrl" in project && (
                    <Button variant="outline" size="sm" nativeButton={false} render={<a href={project.githubUrl} target="_blank" rel="noopener noreferrer" />} className="inline-flex items-center gap-1.5">
                      <Github className="h-3.5 w-3.5" />
                      {t("projects.view_github")}
                    </Button>
                  )}
                  {"externalUrl" in project && (
                    <Button variant="outline" size="sm" nativeButton={false} render={<a href={project.externalUrl} target="_blank" rel="noopener noreferrer" />} className="inline-flex items-center gap-1.5">
                      <ExternalLink className="h-3.5 w-3.5" />
                      {t("projects.view_link")}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
