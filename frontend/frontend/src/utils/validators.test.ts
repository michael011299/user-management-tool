import { validateEmail, validateRequired, validateAccountId, validateForm } from "./validators";

describe("validators", () => {
  describe("validateEmail", () => {
    it("validates correct emails", () => {
      expect(validateEmail("test@example.com")).toBe(true);
      expect(validateEmail("user.name+tag@example.co.uk")).toBe(true);
    });

    it("rejects invalid emails", () => {
      expect(validateEmail("invalid")).toBe(false);
      expect(validateEmail("@example.com")).toBe(false);
      expect(validateEmail("test@")).toBe(false);
      expect(validateEmail("test@.com")).toBe(false);
    });
  });

  describe("validateRequired", () => {
    it("validates non-empty strings", () => {
      expect(validateRequired("test")).toBe(true);
      expect(validateRequired("  test  ")).toBe(true);
    });

    it("rejects empty strings", () => {
      expect(validateRequired("")).toBe(false);
      expect(validateRequired("   ")).toBe(false);
    });
  });

  describe("validateAccountId", () => {
    it("validates numeric IDs", () => {
      expect(validateAccountId("123456")).toBe(true);
      expect(validateAccountId("0")).toBe(true);
    });

    it("rejects non-numeric IDs", () => {
      expect(validateAccountId("abc123")).toBe(false);
      expect(validateAccountId("12.34")).toBe(false);
      expect(validateAccountId("")).toBe(false);
    });
  });

  describe("validateForm", () => {
    it("validates migration form correctly", () => {
      const data = {
        clientName: "Test Client",
        moveType: "migration",
        newEmail: "test@example.com",
        gaAccountId: "123456",
        gtmAccountId: "789012",
      };

      const errors = validateForm(data);
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it("returns errors for invalid migration form", () => {
      const data = {
        clientName: "",
        moveType: "migration",
        newEmail: "invalid-email",
        gaAccountId: "",
        gtmAccountId: "",
      };

      const errors = validateForm(data);
      expect(errors.clientName).toBeDefined();
      expect(errors.newEmail).toBeDefined();
      expect(errors.gaAccountId).toBeDefined();
    });

    it("validates offboard form correctly", () => {
      const data = {
        clientName: "Test Client",
        moveType: "offboard",
        offboardEmail: "offboard@example.com",
        gaAccountId: "123456",
      };

      const errors = validateForm(data);
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it("requires at least one account ID", () => {
      const data = {
        clientName: "Test",
        moveType: "migration",
        newEmail: "test@example.com",
        gaAccountId: "",
        gtmAccountId: "",
      };

      const errors = validateForm(data);
      expect(errors.gaAccountId).toBeDefined();
      expect(errors.gtmAccountId).toBeDefined();
    });
  });
});
