import { apiClient } from "./api";
import { MigrationResult, FindResult, MigrationRecord, FormData } from "../types";

export class MigrationService {
  public async migrate(data: FormData): Promise<MigrationResult> {
    const payload = {
      clientName: data.clientName,
      moveType: data.moveType === "find" ? "migration" : data.moveType,
      newEmail: data.newEmail || undefined,
      offboardEmail: data.offboardEmail || undefined,
      gaAccountId: data.gaAccountId || undefined,
      gtmAccountId: data.gtmAccountId || undefined,
      gtmContainerId: data.gtmContainerId || undefined,
    };

    return apiClient.post<MigrationResult>("/migrate", payload);
  }

  public async find(data: Partial<FormData>): Promise<FindResult> {
    const payload = {
      clientName: data.clientName || undefined,
      gaAccountId: data.gaAccountId || undefined,
      gtmAccountId: data.gtmAccountId || undefined,
    };

    return apiClient.post<FindResult>("/find", payload);
  }

  public async getHistory(limit: number = 50): Promise<MigrationRecord[]> {
    const response = await apiClient.get<{ success: boolean; data: MigrationRecord[] }>(`/migrations?limit=${limit}`);
    return response.data;
  }

  public async getMigrationById(id: number): Promise<MigrationRecord> {
    const response = await apiClient.get<{ success: boolean; data: MigrationRecord }>(`/migrations/${id}`);
    return response.data;
  }
}

export const migrationService = new MigrationService();
