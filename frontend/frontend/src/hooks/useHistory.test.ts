import { renderHook, waitFor } from "@testing-library/react";
import { useHistory } from "./useHistory";
import { migrationService } from "../services/migration.service";

jest.mock("../services/migration.service");

describe("useHistory", () => {
  const mockMigrationService = migrationService as jest.Mocked<typeof migrationService>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches history on mount", async () => {
    const mockData = [{ move_id: 1, client_name: "Test", status: "completed" as const }];
    mockMigrationService.getHistory.mockResolvedValue(mockData as any);

    const { result } = renderHook(() => useHistory());

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData);
      expect(result.current.loading).toBe(false);
    });
  });

  it("handles errors", async () => {
    mockMigrationService.getHistory.mockRejectedValue(new Error("Failed"));

    const { result } = renderHook(() => useHistory());

    await waitFor(() => {
      expect(result.current.error).toBe("Failed");
      expect(result.current.loading).toBe(false);
    });
  });
});
