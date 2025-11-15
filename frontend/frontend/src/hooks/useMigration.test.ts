import { renderHook, act, waitFor } from "@testing-library/react";
import { useMigration } from "./useMigration";
import { migrationService } from "../services/migration.service";

jest.mock("../services/migration.service");

describe("useMigration", () => {
  const mockMigrationService = migrationService as jest.Mocked<typeof migrationService>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initializes with default values", () => {
    const { result } = renderHook(() => useMigration());

    expect(result.current.loading).toBe(false);
    expect(result.current.result).toBeNull();
    expect(result.current.findResult).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("handles successful migration", async () => {
    const mockResponse = {
      success: true,
      results: {
        moveId: 1,
        agencyAccount: "test@agency.com",
        gtm: {},
        ga: {},
      },
    };

    mockMigrationService.migrate.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useMigration());

    const formData = {
      clientName: "Test",
      moveType: "migration" as const,
      newEmail: "new@test.com",
      offboardEmail: "",
      gaAccountId: "123",
      gtmAccountId: "",
      gtmContainerId: "",
    };

    await act(async () => {
      await result.current.migrate(formData);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.result).toEqual(mockResponse);
      expect(result.current.error).toBeNull();
    });
  });

  it("handles migration error", async () => {
    mockMigrationService.migrate.mockRejectedValue(new Error("Migration failed"));

    const { result } = renderHook(() => useMigration());

    const formData = {
      clientName: "Test",
      moveType: "migration" as const,
      newEmail: "new@test.com",
      offboardEmail: "",
      gaAccountId: "123",
      gtmAccountId: "",
      gtmContainerId: "",
    };

    await act(async () => {
      try {
        await result.current.migrate(formData);
      } catch (err) {
        // Expected
      }
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe("Migration failed");
      expect(result.current.result).toBeNull();
    });
  });

  it("handles successful find", async () => {
    const mockResponse = {
      success: true,
      agencyAccount: "test@agency.com",
      matchedBy: "Account ID",
      users: { gtm: [], ga: [] },
    };

    mockMigrationService.find.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useMigration());

    await act(async () => {
      await result.current.find({ gaAccountId: "123" });
    });

    await waitFor(() => {
      expect(result.current.findResult).toEqual(mockResponse);
      expect(result.current.error).toBeNull();
    });
  });

  it("resets state", () => {
    const { result } = renderHook(() => useMigration());

    act(() => {
      result.current.reset();
    });

    expect(result.current.result).toBeNull();
    expect(result.current.findResult).toBeNull();
    expect(result.current.error).toBeNull();
  });
});
