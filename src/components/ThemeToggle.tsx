"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const noop = () => () => {};
const useMounted = () => useSyncExternalStore(noop, () => true, () => false);

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  // Avoid hydration mismatch — render a placeholder until mounted
  if (!mounted) {
    return <Button variant="ghost" size="icon" aria-hidden="true" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="rounded-full"
    >
      {isDark ? <Sun data-icon="inline-start" /> : <Moon data-icon="inline-start" />}
    </Button>
  );
};

export default ThemeToggle;
