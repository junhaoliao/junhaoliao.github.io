"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { gsap, useMotionGSAP } from "@/lib/gsap";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MapPin, Mail, MessageCircle, Linkedin, Github, type LucideIcon } from "lucide-react";

interface ContactItem {
  id: string;
  icon: LucideIcon;
  label: string;
  href?: string;
  extra?: React.ReactNode;
}

const ContactLink = ({ item }: { item: ContactItem }) => {
  if (item.extra) return item.extra;
  const Icon = item.icon;
  return (
    <a
      href={item.href}
      target={item.href?.startsWith("http") ? "_blank" : undefined}
      rel={item.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      className={cn(buttonVariants({ variant: "ghost" }), "contact-item gap-3")}
    >
      <Icon data-icon="inline-start" />
      <span>{item.label}</span>
    </a>
  );
};

const ContactSection = () => {
  const { t } = useTranslation();
  const container = useRef<HTMLElement>(null);

  useMotionGSAP(
    () => {
      gsap.to(".contact-bg", {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.fromTo(".contact-item",
        { opacity: 0, y: 25 },
        {
          opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: "power2.out",
          scrollTrigger: { trigger: container.current, start: "top 75%", toggleActions: "play none none reverse" },
        },
      );
    },
    container,
  );

  const items: ContactItem[] = [
    {
      id: "location",
      icon: MapPin,
      label: t("contact.location"),
      href: "https://maps.app.goo.gl/k12U9Lre5H9hfVfAA",
    },
    {
      id: "email",
      icon: Mail,
      label: t("contact.email"),
      href: "mailto:junhao@junhao.ca",
    },
    {
      id: "wechat",
      icon: MessageCircle,
      label: t("contact.wechat"),
      extra: (
        <HoverCard>
          <HoverCardTrigger
            delay={100}
            closeDelay={100}
            render={
              <a
                href="/images/wechat-qr.webp"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "ghost" }), "contact-item gap-3")}
                aria-label="WeChat QR code"
              />
            }
          >
            <MessageCircle data-icon="inline-start" />
            <span>{t("contact.wechat")}</span>
          </HoverCardTrigger>
          <HoverCardContent
            side="right"
            align="center"
            className="w-48 p-2"
          >
            <Image
              src="/images/wechat-qr.webp"
              alt="WeChat QR code"
              width={176}
              height={176}
              className="rounded"
            />
          </HoverCardContent>
        </HoverCard>
      ),
    },
    {
      id: "linkedin",
      icon: Linkedin,
      label: t("contact.linkedin"),
      href: "https://www.linkedin.com/in/junhaoliao/",
    },
    {
      id: "github",
      icon: Github,
      label: t("contact.github"),
      href: "https://github.com/junhaoliao",
    },
  ];

  return (
    <section id="contact" ref={container} className="relative py-40 lg:py-48 overflow-hidden">
      <div className="contact-bg absolute -inset-y-16 inset-x-0 z-0 will-change-transform">
        <Image
          src="/images/contact-bg.webp"
          alt=""
          fill
          className="object-cover scale-110"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-contact-scrim" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="contact-item text-4xl sm:text-5xl lg:text-6xl font-bold text-photo-foreground tracking-tight mb-12 sm:mb-16">
          {t("contact.title")}
        </h2>

        <div className="photo-surface flex flex-col gap-5 text-muted-foreground">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-5 sm:gap-8">
            {items.slice(0, 3).map((item) => (
              <ContactLink key={item.id} item={item} />
            ))}
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-5 sm:gap-8">
            {items.slice(3).map((item) => (
              <ContactLink key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
