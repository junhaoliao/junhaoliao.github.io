"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { gsap, useGSAP } from "@/lib/gsap";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { MapPin, Mail, MessageCircle, Linkedin, Github } from "lucide-react";

interface ContactItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  href?: string;
  extra?: React.ReactNode;
}

const ContactLink = ({ item }: { item: ContactItem }) => {
  if (item.extra) return item.extra;
  return (
    <a
      href={item.href}
      target={item.href?.startsWith("http") ? "_blank" : undefined}
      rel={item.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      className="contact-item opacity-0 flex items-center gap-3 text-white/85 hover:text-white transition-colors"
    >
      {item.icon}
      <span>{item.label}</span>
    </a>
  );
};

const ContactSection = () => {
  const { t } = useTranslation();
  const container = useRef<HTMLElement>(null);

  useGSAP(
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
    { scope: container },
  );

  const items: ContactItem[] = [
    {
      id: "location",
      icon: <MapPin className="h-5 w-5 shrink-0" />,
      label: t("contact.location"),
      href: "https://maps.app.goo.gl/k12U9Lre5H9hfVfAA",
    },
    {
      id: "email",
      icon: <Mail className="h-5 w-5 shrink-0" />,
      label: t("contact.email"),
      href: "mailto:junhao@junhao.ca",
    },
    {
      id: "wechat",
      icon: <MessageCircle className="h-5 w-5 shrink-0" />,
      label: t("contact.wechat"),
      extra: (
        <HoverCard>
          <HoverCardTrigger
            delay={100}
            closeDelay={100}
            render={
              <button
                onClick={() => window.open("/images/wechat-qr.webp", "_blank")}
                className="contact-item opacity-0 flex items-center gap-3 text-white/85 hover:text-white transition-colors"
                aria-label="WeChat QR code"
              />
            }
          >
            <MessageCircle className="h-5 w-5 shrink-0" />
            <span>{t("contact.wechat")}</span>
          </HoverCardTrigger>
          <HoverCardContent
            side="right"
            align="center"
            className="w-48 p-2 border-0 shadow-xl"
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
      icon: <Linkedin className="h-5 w-5 shrink-0" />,
      label: t("contact.linkedin"),
      href: "https://www.linkedin.com/in/junhaoliao/",
    },
    {
      id: "github",
      icon: <Github className="h-5 w-5 shrink-0" />,
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
        <div className="absolute inset-0 bg-black/0 dark:bg-black/40" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="contact-item opacity-0 text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-12 sm:mb-16">
          {t("contact.title")}
        </h2>

        <div className="space-y-5">
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
