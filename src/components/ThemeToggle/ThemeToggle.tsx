import type { ReactNode } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/hooks";
import type { Theme } from "@/store";
import styles from "./ThemeToggle.module.scss";

const THEME_OPTIONS: Array<{ value: Theme; icon: typeof Sun; label: string }> = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "dark", icon: Moon, label: "Dark" },
  { value: "system", icon: Monitor, label: "System" },
];

export function ThemeToggle(): ReactNode {
  const { theme, setTheme } = useTheme();

  return (
    <div className={styles.toggle} data-testid="theme-toggle">
      {THEME_OPTIONS.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          className={styles.option}
          data-active={theme === value}
          onClick={() => setTheme(value)}
          title={label}
          aria-label={`Switch to ${label} theme`}
        >
          <Icon size={16} />
        </button>
      ))}
    </div>
  );
}

