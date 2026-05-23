"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  // Load from localStorage on mount — also migrate old "slate" value
  useEffect(() => {
    const raw = localStorage.getItem("tmstry-theme");
    const saved: Theme = raw === "light" || raw === "slate" ? "light" : raw === "dark" ? "dark" : "dark";
    if (raw === "slate") localStorage.setItem("tmstry-theme", "light"); // migrate
    setTheme(saved);
    if (saved === "light") document.documentElement.setAttribute("data-theme", "light");
  }, []);

  const toggle = () => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      localStorage.setItem("tmstry-theme", next);
      if (next === "light") {
        document.documentElement.setAttribute("data-theme", "light");
      } else {
        document.documentElement.removeAttribute("data-theme");
      }
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
