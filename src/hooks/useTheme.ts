import { useEffect } from "react";
import { useUIStore, type Theme } from "@/store";

/**
 * Hook that applies the theme to the document.
 * Call this once in App.tsx to initialize theme handling.
 */
export function useTheme(): {
  theme: Theme;
  setTheme: (theme: Theme) => void;
} {
  const { theme, setTheme } = useUIStore();

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return { theme, setTheme };
}
