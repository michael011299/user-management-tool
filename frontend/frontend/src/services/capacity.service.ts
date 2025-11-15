import { apiClient } from "./api";
import { AccountStats, AccountStatsSummary } from "../types";

export interface CapacityResponse {
  success: boolean;
  data: {
    accounts: AccountStats[];
    summary: AccountStatsSummary;
    lastUpdated: string;
  };
}

export class CapacityService {
  public async getStats(): Promise<CapacityResponse> {
    return apiClient.get<CapacityResponse>("/accounts/stats");
  }

  public getCapacityStatus(percentage: number): {
    status: "good" | "medium" | "high" | "critical";
    color: string;
    label: string;
  } {
    if (percentage >= 90) {
      return { status: "critical", color: "red", label: "Critical" };
    }
    if (percentage >= 75) {
      return { status: "high", color: "orange", label: "High" };
    }
    if (percentage >= 50) {
      return { status: "medium", color: "yellow", label: "Medium" };
    }
    return { status: "good", color: "green", label: "Good" };
  }

  public calculatePercentage(count: number, limit: number): number {
    return Math.min((count / limit) * 100, 100);
  }
}

export const capacityService = new CapacityService();
