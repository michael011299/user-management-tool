import { ApiClient } from "./api";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("ApiClient", () => {
  let client: ApiClient;

  beforeEach(() => {
    client = new ApiClient("http://test-api.com");
    mockedAxios.create.mockReturnThis();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("get", () => {
    it("makes GET request and returns data", async () => {
      const mockData = { success: true, data: "test" };
      mockedAxios.get = jest.fn().mockResolvedValue({ data: mockData });

      const result = await client.get("/test");
      expect(result).toEqual(mockData);
    });

    it("handles GET request errors", async () => {
      mockedAxios.get = jest.fn().mockRejectedValue({
        response: { data: { error: "Not found" } },
      });

      await expect(client.get("/test")).rejects.toThrow("Not found");
    });
  });

  describe("post", () => {
    it("makes POST request with data", async () => {
      const mockData = { success: true };
      const postData = { name: "test" };
      mockedAxios.post = jest.fn().mockResolvedValue({ data: mockData });

      const result = await client.post("/test", postData);
      expect(result).toEqual(mockData);
    });

    it("handles network errors", async () => {
      mockedAxios.post = jest.fn().mockRejectedValue({
        request: {},
      });

      await expect(client.post("/test")).rejects.toThrow("No response from server");
    });
  });

  describe("error handling", () => {
    it("extracts error message from response", async () => {
      mockedAxios.get = jest.fn().mockRejectedValue({
        response: { data: { error: "Custom error" } },
      });

      await expect(client.get("/test")).rejects.toThrow("Custom error");
    });

    it("handles generic errors", async () => {
      mockedAxios.get = jest.fn().mockRejectedValue(new Error("Generic error"));

      await expect(client.get("/test")).rejects.toThrow("Generic error");
    });
  });
});
