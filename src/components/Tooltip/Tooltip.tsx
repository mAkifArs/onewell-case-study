import {
  type ReactNode,
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Tooltip.module.scss";

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

const GAP = 8;
const VIEWPORT_PADDING = 12;

export function Tooltip({
  content,
  children,
  position = "top",
}: TooltipProps): ReactNode {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [theme, setTheme] = useState<string | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Get current theme from document
  useEffect(() => {
    const updateTheme = () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      setTheme(currentTheme);
    };

    updateTheme();

    // Watch for theme changes
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  // Calculate position after tooltip is rendered (so we can measure it)
  useLayoutEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let top = 0;
      let left = 0;

      switch (position) {
        case "top":
          top = triggerRect.top - tooltipRect.height - GAP;
          left =
            triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          break;
        case "bottom":
          top = triggerRect.bottom + GAP;
          left =
            triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          break;
        case "left":
          top =
            triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          left = triggerRect.left - tooltipRect.width - GAP;
          break;
        case "right":
          top =
            triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          left = triggerRect.right + GAP;
          break;
      }

      // Edge detection - prevent overflow
      if (left < VIEWPORT_PADDING) {
        left = VIEWPORT_PADDING;
      } else if (left + tooltipRect.width > viewportWidth - VIEWPORT_PADDING) {
        left = viewportWidth - tooltipRect.width - VIEWPORT_PADDING;
      }

      if (top < VIEWPORT_PADDING) {
        // Flip to bottom if no room on top
        top = triggerRect.bottom + GAP;
      } else if (top + tooltipRect.height > viewportHeight - VIEWPORT_PADDING) {
        // Flip to top if no room on bottom
        top = triggerRect.top - tooltipRect.height - GAP;
      }

      setCoords({ top, left });
    }
  }, [isVisible, position, content]);

  return (
    <>
      <div
        ref={triggerRef}
        className={styles.wrapper}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        {children}
      </div>
      {createPortal(
        <AnimatePresence>
          {isVisible && (
            <motion.div
              ref={tooltipRef}
              className={styles.tooltip}
              data-theme={theme}
              style={{ top: coords.top, left: coords.left }}
              initial={{ opacity: 0, y: position === "top" ? 4 : -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: position === "top" ? 4 : -4 }}
              transition={{ duration: 0.15 }}
            >
              {content}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
