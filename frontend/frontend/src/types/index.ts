export type MoveType = "find" | "migration" | "offboard";

export interface FormData {
  clientName: string;
  moveType: MoveType;
  newEmail: string;
  offboardEmail: string;
  gaAccountId: string;
  gtmAccountId: string;
  gtmContainerId: string;
}

export interface MigrationResult {
  success: boolean;
  results?: {
    moveId: number;
    agencyAccount: string;
    gtm: {
      add?: ServiceResult;
      remove?: ServiceResult;
      addOffboard?: ServiceResult;
    };
    ga: {
      add?: ServiceResult;
      remove?: ServiceResult;
      addOffboard?: ServiceResult;
    };
  };
  warnings?: string[];
  error?: string;
}

export interface ServiceResult {
  success: boolean;
  message: string;
}

export interface AccountStats {
  email: string;
  gtm: CapacityInfo;
  ga: CapacityInfo;
  lastChecked: string;
}

export interface CapacityInfo {
  count: number;
  limit: number;
  percentage: string;
  error?: boolean;
}

export interface AccountStatsSummary {
  totalGTMUsers: number;
  totalGAUsers: number;
  highCapacity: number;
  critical: number;
  totalAccounts: number;
}

export interface MigrationRecord {
  move_id: number;
  client_name: string;
  move_type: string;
  old_email?: string;
  new_email: string;
  offboard_email?: string;
  ga_account_id?: string;
  gtm_account_id?: string;
  status: "pending" | "completed" | "failed";
  agency_account_used?: string;
  created_at: string;
  completed_at?: string;
}

export interface FindResult {
  success: boolean;
  agencyAccount: string;
  matchedBy: string;
  users: {
    gtm?: GTMUser[];
    ga?: GAUser[];
  };
}

export interface GTMUser {
  email: string;
  permission: string;
}

export interface GAUser {
  email: string;
  permissions: string[];
}

export type CapacityStatus = "good" | "medium" | "high" | "critical";

export interface CapacityStatusInfo {
  color: string;
  label: string;
  bg: string;
  border: string;
  text: string;
}
