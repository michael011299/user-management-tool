import { MigrationService } from "./migration.service";
import { apiClient } from "./api";
import { mockMigrations } from "../mocks/data/migrations.mock";

jest.mock("./api");

describe("MigrationService", () => {
  let service: MigrationService;
  const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

  beforeEach(() => {
    service = new MigrationService();
    jest.clearAllMocks();
  });

  describe("migrate", () => {
    it("sends migration request with correct data", async () => {
      const formData = {
        clientName: "Test Client",
        moveType: "migration" as const,
        newEmail: "new@test.com",
        offboardEmail: "",
        gaAccountId: "123",
        gtmAccountId: "456",
        gtmContainerId: "789",
      };

      const mockResponse = {
        success: true,
        results: {
          moveId: 1,
          agencyAccount: "account1@agency.com",
          gtm: {},
          ga: {},
        },
      };

      mockedApiClient.post.mockResolvedValue(mockResponse);

      const result = await service.migrate(formData);

      expect(mockedApiClient.post).toHaveBeenCalledWith(
        "/migrate",
        expect.objectContaining({
          clientName: "Test Client",
          moveType: "migration",
          newEmail: "new@test.com",
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it("handles offboard migration type", async () => {
      const formData = {
        clientName: "Test Client",
        moveType: "offboard" as const,
        newEmail: "",
        offboardEmail: "offboard@agency.com",
        gaAccountId: "123",
        gtmAccountId: "",
        gtmContainerId: "",
      };

      mockedApiClient.post.mockResolvedValue({ success: true });

      await service.migrate(formData);

      expect(mockedApiClient.post).toHaveBeenCalledWith(
        "/migrate",
        expect.objectContaining({
          moveType: "offboard",
          offboardEmail: "offboard@agency.com",
        })
      );
    });
  });

  describe("find", () => {
    it("sends find request with search criteria", async () => {
      const searchData = {
        clientName: "Acme",
        gaAccountId: "123",
        gtmAccountId: "456",
      };

      const mockResponse = {
        success: true,
        agencyAccount: "account1@agency.com",
        matchedBy: "Account ID",
        users: {
          gtm: [],
          ga: [],
        },
      };

      mockedApiClient.post.mockResolvedValue(mockResponse);

      const result = await service.find(searchData);

      expect(mockedApiClient.post).toHaveBeenCalledWith("/find", searchData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getHistory", () => {
    it("fetches migration history with default limit", async () => {
      mockedApiClient.get.mockResolvedValue({
        success: true,
        data: mockMigrations,
      });

      const result = await service.getHistory();

      expect(mockedApiClient.get).toHaveBeenCalledWith("/migrations?limit=50");
      expect(result).toEqual(mockMigrations);
    });

    it("fetches migration history with custom limit", async () => {
      mockedApiClient.get.mockResolvedValue({
        success: true,
        data: mockMigrations.slice(0, 10),
      });

      await service.getHistory(10);

      expect(mockedApiClient.get).toHaveBeenCalledWith("/migrations?limit=10");
    });
  });

  describe("getMigrationById", () => {
    it("fetches specific migration by ID", async () => {
      const mockMigration = mockMigrations[0];
      mockedApiClient.get.mockResolvedValue({
        success: true,
        data: mockMigration,
      });

      const result = await service.getMigrationById(1);

      expect(mockedApiClient.get).toHaveBeenCalledWith("/migrations/1");
      expect(result).toEqual(mockMigration);
    });
  });
});
