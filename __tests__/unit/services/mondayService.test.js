const MondayService = require("../../../services/mondayService");
const fetch = require("node-fetch");

jest.mock("node-fetch");

describe("MondayService", () => {
  let mondayService;

  beforeEach(() => {
    mondayService = new MondayService();
    jest.clearAllMocks();
  });

  describe("executeQuery", () => {
    it("should execute GraphQL query successfully", async () => {
      const mockResponse = {
        data: { boards: [] },
      };

      fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await mondayService.executeQuery("query { boards { id } }");

      expect(fetch).toHaveBeenCalledWith(
        "https://api.monday.com/v2",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: "test_monday_api_key",
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw error on API errors", async () => {
      fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          errors: [{ message: "Invalid query" }],
        }),
      });

      await expect(mondayService.executeQuery("invalid query")).rejects.toThrow("Monday.com API Error");
    });
  });

  describe("parseColumnValues", () => {
    it("should parse column values correctly", () => {
      const columnValues = [
        { id: "text", text: "Test", value: null },
        { id: "email", text: "test@example.com", value: '{"email":"test@example.com"}' },
      ];

      const result = mondayService.parseColumnValues(columnValues);

      expect(result.text).toEqual({
        text: "Test",
        value: null,
      });
      expect(result.email).toEqual({
        text: "test@example.com",
        value: { email: "test@example.com" },
      });
    });
  });

  describe("extractValue", () => {
    it("should extract text value", () => {
      const columnData = {
        field: { text: "Test Value", value: null },
      };

      const result = mondayService.extractValue(columnData, "field");
      expect(result).toBe("Test Value");
    });

    it("should extract label from value", () => {
      const columnData = {
        field: { text: "", value: { label: "Migration" } },
      };

      const result = mondayService.extractValue(columnData, "field");
      expect(result).toBe("Migration");
    });

    it("should return null for missing field", () => {
      const columnData = {};
      const result = mondayService.extractValue(columnData, "field");
      expect(result).toBeNull();
    });
  });
});
