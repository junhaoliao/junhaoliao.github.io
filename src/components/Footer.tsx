"use client";

import { useTranslation } from "react-i18next";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer>
      <Separator />
      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground">
          {t("footer.copyright", { year })}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
