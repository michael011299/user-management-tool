import { CapacityService } from "./capacity.service";
import { apiClient } from "./api";
import { mockCapacityStats } from "../mocks/data/capacity.mock";

jest.mock("./api");

describe("CapacityService", () => {
  let service: CapacityService;
  const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

  beforeEach(() => {
    service = new CapacityService();
    jest.clearAllMocks();
  });

  describe("getStats", () => {
    it("fetches capacity statistics", async () => {
      mockedApiClient.get.mockResolvedValue(mockCapacityStats);

      const result = await service.getStats();

      expect(mockedApiClient.get).toHaveBeenCalledWith("/accounts/stats");
      expect(result).toEqual(mockCapacityStats);
    });

    it("handles API errors", async () => {
      mockedApiClient.get.mockRejectedValue(new Error("API Error"));

      await expect(service.getStats()).rejects.toThrow("API Error");
    });
  });

  describe("getCapacityStatus", () => {
    it("returns critical status for >=90%", () => {
      const result = service.getCapacityStatus(92);
      expect(result.status).toBe("critical");
      expect(result.color).toBe("red");
      expect(result.label).toBe("Critical");
    });

    it("returns high status for 75-89%", () => {
      const result = service.getCapacityStatus(80);
      expect(result.status).toBe("high");
      expect(result.color).toBe("orange");
    });

    it("returns medium status for 50-74%", () => {
      const result = service.getCapacityStatus(60);
      expect(result.status).toBe("medium");
      expect(result.color).toBe("yellow");
    });

    it("returns good status for <50%", () => {
      const result = service.getCapacityStatus(30);
      expect(result.status).toBe("good");
      expect(result.color).toBe("green");
    });

    it("handles edge cases", () => {
      expect(service.getCapacityStatus(90).status).toBe("critical");
      expect(service.getCapacityStatus(75).status).toBe("high");
      expect(service.getCapacityStatus(50).status).toBe("medium");
      expect(service.getCapacityStatus(49).status).toBe("good");
    });
  });

  describe("calculatePercentage", () => {
    it("calculates percentage correctly", () => {
      expect(service.calculatePercentage(50, 100)).toBe(50);
      expect(service.calculatePercentage(75, 100)).toBe(75);
      expect(service.calculatePercentage(25, 100)).toBe(25);
    });

    it("caps percentage at 100", () => {
      expect(service.calculatePercentage(150, 100)).toBe(100);
      expect(service.calculatePercentage(200, 100)).toBe(100);
    });

    it("handles zero and decimals", () => {
      expect(service.calculatePercentage(0, 100)).toBe(0);
      expect(service.calculatePercentage(33, 100)).toBe(33);
    });
  });
});
