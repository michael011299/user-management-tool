export const API_ENDPOINTS = {
  MIGRATE: "/migrate",
  FIND: "/find",
  MIGRATIONS: "/migrations",
  CAPACITY: "/accounts/stats",
} as const;

export const MOVE_TYPES = {
  FIND: "find",
  MIGRATION: "migration",
  OFFBOARD: "offboard",
} as const;

export const STATUS_TYPES = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

export const CAPACITY_THRESHOLDS = {
  CRITICAL: 90,
  HIGH: 75,
  MEDIUM: 50,
  LOW: 0,
} as const;

export const USER_LIMITS = {
  GTM: 100,
  GA: 100,
} as const;

export const REFRESH_INTERVALS = {
  CAPACITY: 300000, // 5 minutes
  HISTORY: 60000, // 1 minute
} as const;
