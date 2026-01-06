import { useEffect } from "react";
import { useUIStore, type Theme } from "@/store";

/**
 * Hook that applies the theme to the document and handles system preference changes.
 * Call this once in App.tsx to initialize theme handling.
 */
export function useTheme(): {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
} {
  const { theme, setTheme } = useUIStore();

  // Determine the resolved theme (what's actually shown)
  const getResolvedTheme = (): "light" | "dark" => {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return theme;
  };

  const resolvedTheme = getResolvedTheme();

  // Apply theme to document
  useEffect(() => {
    const applyTheme = () => {
      const resolved = getResolvedTheme();
      document.documentElement.setAttribute("data-theme", resolved);
    };

    applyTheme();

    // Listen for system theme changes when in "system" mode
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  return { theme, setTheme, resolvedTheme };
}

