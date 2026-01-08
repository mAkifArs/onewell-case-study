// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATION CONSTANTS
// Shared animation configurations for Framer Motion
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Expand/collapse animation for accordions and expandable content
 */
export const expandAnimation = {
  initial: { height: 0, opacity: 0 },
  animate: { height: "auto", opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: 0.2, ease: "easeInOut" },
} as const;

/**
 * Fade in/out animation
 */
export const fadeAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.15 },
} as const;

/**
 * Slide up animation for modals and panels
 */
export const slideUpAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.2, ease: "easeOut" },
} as const;

