import type { ReactNode } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks";
import styles from "./ThemeToggle.module.scss";

export function ThemeToggle(): ReactNode {
  const { theme, setTheme } = useTheme();

  return (
    <div className={styles.toggle} data-testid="theme-toggle">
      <button
        className={styles.option}
        data-active={theme === "light"}
        onClick={() => setTheme("light")}
        title="Light"
        aria-label="Switch to light theme"
      >
        <Sun size={16} />
      </button>
      <button
        className={styles.option}
        data-active={theme === "dark"}
        onClick={() => setTheme("dark")}
        title="Dark"
        aria-label="Switch to dark theme"
      >
        <Moon size={16} />
      </button>
    </div>
  );
}
