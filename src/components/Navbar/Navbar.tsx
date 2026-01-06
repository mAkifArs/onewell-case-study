import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import styles from "./Navbar.module.scss";

export function Navbar(): ReactNode {
  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.brand}>
        <img src="/logo.svg" alt="OneWell" className={styles.logo} />
      </Link>

      <div className={styles.actions}>
        <ThemeToggle />
      </div>
    </nav>
  );
}

