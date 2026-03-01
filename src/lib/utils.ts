import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
};

export const smoothScrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
    window.history.replaceState(null, "", window.location.pathname);
  }
};
