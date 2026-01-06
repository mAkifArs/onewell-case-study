// ═══════════════════════════════════════════════════════════════════════════════
// COMMON TYPES
// Shared types used across the application
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * User entity - represents a person in the system
 * Used for owners, approvers, stakeholders, and executors
 */
export interface User {
  user_id: string;
  name: string;
  title?: string;
  role?: string; // Used in stakeholders/approvers context
}

/**
 * Department entity - organizational unit
 */
export interface Department {
  department_id: string;
  name: string;
}
