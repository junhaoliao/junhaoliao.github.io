import type { Metadata } from "next";
import { DEFAULT_LOCALE } from "@/lib/locales";

export const metadata: Metadata = {
  title: "404: This page could not be found.",
};

/** Multiple root layouts need a standalone document for unmatched static URLs. */
const GlobalNotFound = () => (
  <html lang={DEFAULT_LOCALE}>
    <body>
      <style>{`
        body { margin: 0; color: #000; background: #fff; }
        main {
          font-family: system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          height: 100vh; display: flex; align-items: center; justify-content: center;
          text-align: center;
        }
        h1 {
          display: inline-block; margin: 0 20px 0 0; padding: 0 23px 0 0;
          font-size: 24px; font-weight: 500; line-height: 49px;
          border-right: 1px solid rgba(0, 0, 0, .3);
        }
        h2 { display: inline-block; margin: 0; font-size: 14px; font-weight: 400; line-height: 49px; }
        @media (prefers-color-scheme: dark) {
          body { color: #fff; background: #000; }
          h1 { border-color: rgba(255, 255, 255, .3); }
        }
      `}</style>
      <main>
        <div>
          <h1>404</h1>
          <h2>This page could not be found.</h2>
        </div>
      </main>
    </body>
  </html>
);

export default GlobalNotFound;
