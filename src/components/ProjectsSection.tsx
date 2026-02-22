"use client";

import { useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PROJECTS = [
  {
    key: "ictrl",
    logo: "/images/ictrl-logo.svg",
    githubUrl: "https://github.com/junhaoliao/iCtrl",
    externalUrl: "https://ictrl.ca/",
  },
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
      gsap.from(".project-card", {
        opacity: 0,
        y: 40,
        stagger: 0.12,
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
    <section id="projects" ref={container} className="py-24 bg-muted/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {t("projects.title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project) => {
            const desc = t(`projects.items.${project.key}.description`);
            return (
              <Card
                key={project.key}
                className="project-card flex flex-col hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {"logo" in project && (
                      <Image
                        src={project.logo}
                        alt={t(`projects.items.${project.key}.name`)}
                        width={40}
                        height={40}
                        className="w-10 h-10 object-contain shrink-0"
                      />
                    )}
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
