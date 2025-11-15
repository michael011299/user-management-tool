import { formatDate, formatRelativeTime, formatPercentage, formatNumber, truncateEmail } from "./formatters";

describe("formatters", () => {
  describe("formatDate", () => {
    it("formats ISO date correctly", () => {
      const result = formatDate("2024-11-15T10:30:00Z");
      expect(result).toMatch(/15\/11\/2024/);
    });

    it("handles invalid date", () => {
      expect(formatDate("invalid")).toBe("Invalid date");
    });
  });

  describe("formatRelativeTime", () => {
    it("formats relative time", () => {
      const recentDate = new Date().toISOString();
      const result = formatRelativeTime(recentDate);
      expect(result).toContain("ago");
    });

    it("handles invalid date", () => {
      expect(formatRelativeTime("invalid")).toBe("Unknown");
    });
  });

  describe("formatPercentage", () => {
    it("formats percentage without decimals", () => {
      expect(formatPercentage(45.7)).toBe("46%");
    });

    it("formats percentage with decimals", () => {
      expect(formatPercentage(45.123, 2)).toBe("45.12%");
    });

    it("handles zero", () => {
      expect(formatPercentage(0)).toBe("0%");
    });
  });

  describe("formatNumber", () => {
    it("formats numbers with commas", () => {
      expect(formatNumber(1000)).toBe("1,000");
      expect(formatNumber(1234567)).toBe("1,234,567");
    });

    it("handles small numbers", () => {
      expect(formatNumber(42)).toBe("42");
    });
  });

  describe("truncateEmail", () => {
    it("does not truncate short emails", () => {
      const email = "test@example.com";
      expect(truncateEmail(email)).toBe(email);
    });

    it("truncates long emails", () => {
      const email = "verylongemailaddress@example.com";
      const result = truncateEmail(email, 20);
      expect(result.length).toBeLessThanOrEqual(30);
      expect(result).toContain("...");
      expect(result).toContain("@");
    });

    it("preserves domain", () => {
      const email = "verylongemailaddress@example.com";
      const result = truncateEmail(email, 20);
      expect(result).toContain("@example.com");
    });
  });
});
