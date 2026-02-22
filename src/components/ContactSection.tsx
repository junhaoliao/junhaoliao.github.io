"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { MapPin, Mail, MessageCircle, Linkedin, Github } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface ContactItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
  extra?: React.ReactNode;
}

export default function ContactSection() {
  const { t } = useTranslation();
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".contact-item", {
        opacity: 0,
        y: 25,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: container },
  );

  const items: ContactItem[] = [
    {
      icon: <MapPin className="h-5 w-5 shrink-0" />,
      label: t("contact.location"),
      href: "https://maps.app.goo.gl/k12U9Lre5H9hfVfAA",
    },
    {
      icon: <Mail className="h-5 w-5 shrink-0" />,
      label: t("contact.email"),
      href: "mailto:junhao@junhao.ca",
    },
    {
      icon: <MessageCircle className="h-5 w-5 shrink-0" />,
      label: t("contact.wechat"),
      href: "/images/wechat-qr.webp",
      extra: (
        <HoverCard>
          <HoverCardTrigger
            delay={100}
            closeDelay={100}
            render={
              <button
                onClick={() => window.open("/images/wechat-qr.webp", "_blank")}
                className="flex items-center gap-3 text-white/90 hover:text-white transition-colors group"
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
      icon: <Linkedin className="h-5 w-5 shrink-0" />,
      label: t("contact.linkedin"),
      href: "https://www.linkedin.com/in/junhaoliao/",
    },
    {
      icon: <Github className="h-5 w-5 shrink-0" />,
      label: t("contact.github"),
      href: "https://github.com/junhaoliao",
    },
  ];

  return (
    <section id="contact" ref={container} className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/contact-bg.webp"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        {/* Theme-aware overlay */}
        <div className="absolute inset-0 bg-black/55 dark:bg-black/40" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-md">
          <h2 className="contact-item text-3xl sm:text-4xl font-bold text-white mb-10">
            {t("contact.title")}
          </h2>

          <ul className="space-y-5">
            {items.map((item, i) =>
              item.extra ? (
                <li key={i} className="contact-item">
                  {item.extra}
                </li>
              ) : (
                <li key={i} className="contact-item">
                  <a
                    href={item.href}
                    target={item.href?.startsWith("http") ? "_blank" : undefined}
                    rel={item.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-3 text-white/85 hover:text-white transition-colors"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
