import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import I18nProvider from "@/components/I18nProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Junhao Liao - Junhao's Personal Website",
  description: "Junhao Liao — Software Developer at YScope Inc. Based in Toronto, Canada.",
  // metadataBase is required for resolving relative OG image URLs
  // Using a relative URL works at deploy time; this avoids hardcoding a domain.
  metadataBase: new URL("https://junhaoliao.github.io"),
  openGraph: {
    type: "website",
    title: "Junhao Liao - Junhao's Personal Website",
    description: "Junhao Liao — Software Developer at YScope Inc. Based in Toronto, Canada.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Junhao Liao",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Junhao Liao - Junhao's Personal Website",
    description: "Junhao Liao — Software Developer at YScope Inc. Based in Toronto, Canada.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>{children}</I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
