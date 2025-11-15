const AuthService = require("../../../services/authService");
const { google } = require("googleapis");

jest.mock("googleapis");

describe("AuthService", () => {
  describe("getAuthClient", () => {
    it("should create OAuth2 client with correct credentials", () => {
      const mockOAuth2 = jest.fn();
      const mockSetCredentials = jest.fn();

      mockOAuth2.prototype.setCredentials = mockSetCredentials;
      google.auth.OAuth2 = mockOAuth2;

      const client = AuthService.getAuthClient("account1@agency.com");

      expect(mockOAuth2).toHaveBeenCalledWith(
        "test_client_id_1",
        "test_client_secret_1",
        "http://localhost:3001/oauth2callback"
      );
      expect(mockSetCredentials).toHaveBeenCalledWith({
        refresh_token: "test_refresh_token_1",
      });
    });

    it("should throw error for invalid email", () => {
      expect(() => {
        AuthService.getAuthClient("invalid@agency.com");
      }).toThrow("No credentials found for email: invalid@agency.com");
    });
  });

  describe("findAccountWithAccess", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should find account with GTM access", async () => {
      const mockGet = jest.fn().mockResolvedValue({ data: {} });
      const mockTagManager = {
        accounts: { get: mockGet },
      };

      google.tagmanager = jest.fn().mockReturnValue(mockTagManager);
      google.auth.OAuth2 = jest.fn().mockImplementation(() => ({
        setCredentials: jest.fn(),
      }));

      const result = await AuthService.findAccountWithAccess("123456", null);

      expect(result).toBe("account1@agency.com");
      expect(mockGet).toHaveBeenCalled();
    });

    it("should throw error when no account has access", async () => {
      const mockGet = jest.fn().mockRejectedValue(new Error("Access denied"));
      const mockTagManager = {
        accounts: { get: mockGet },
      };

      google.tagmanager = jest.fn().mockReturnValue(mockTagManager);
      google.auth.OAuth2 = jest.fn().mockImplementation(() => ({
        setCredentials: jest.fn(),
      }));

      await expect(AuthService.findAccountWithAccess("999999", null)).rejects.toThrow(
        "No account found with access to the specified resources"
      );
    });
  });

  describe("getAllAccountEmails", () => {
    it("should return array of all account emails", () => {
      const emails = AuthService.getAllAccountEmails();

      expect(Array.isArray(emails)).toBe(true);
      expect(emails.length).toBeGreaterThan(0);
      expect(emails).toContain("account1@agency.com");
    });
  });
});
