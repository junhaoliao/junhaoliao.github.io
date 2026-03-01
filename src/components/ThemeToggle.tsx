"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const noop = () => () => {};
const useMounted = () => useSyncExternalStore(noop, () => true, () => false);

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  // Avoid hydration mismatch — render a placeholder until mounted
  if (!mounted) {
    return <Button variant="ghost" size="icon" className="w-9 h-9" aria-hidden="true" />;
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="w-9 h-9 rounded-full"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
};

export default ThemeToggle;
