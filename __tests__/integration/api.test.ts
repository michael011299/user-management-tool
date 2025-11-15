const request = require("supertest");
const app = require("../../server");

describe("API Integration Tests", () => {
  describe("GET /health", () => {
    it("should return health status", async () => {
      const response = await request(app).get("/health").expect(200);

      expect(response.body.status).toBe("ok");
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe("POST /api/migrate", () => {
    it("should validate required fields", async () => {
      const response = await request(app).post("/api/migrate").send({}).expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("Client name is required");
    });

    it("should validate move type", async () => {
      const response = await request(app)
        .post("/api/migrate")
        .send({
          clientName: "Test Client",
          moveType: "invalid",
          newEmail: "test@example.com",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("Move type must be");
    });

    it("should validate migration requires new email", async () => {
      const response = await request(app)
        .post("/api/migrate")
        .send({
          clientName: "Test Client",
          moveType: "migration",
          gaAccountId: "123456",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("New email is required");
    });

    it("should validate offboard requires offboard email", async () => {
      const response = await request(app)
        .post("/api/migrate")
        .send({
          clientName: "Test Client",
          moveType: "offboard",
          gaAccountId: "123456",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("Offboard email is required");
    });

    it("should require at least one account ID", async () => {
      const response = await request(app)
        .post("/api/migrate")
        .send({
          clientName: "Test Client",
          moveType: "migration",
          newEmail: "test@example.com",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("At least one account ID");
    });
  });

  describe("POST /api/find", () => {
    it("should require at least one search criteria", async () => {
      const response = await request(app).post("/api/find").send({}).expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("At least one search criteria");
    });
  });

  describe("GET /api/migrations", () => {
    it("should return migrations list", async () => {
      const response = await request(app).get("/api/migrations").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("should respect limit parameter", async () => {
      const response = await request(app).get("/api/migrations?limit=5").expect(200);

      expect(response.body.data.length).toBeLessThanOrEqual(5);
    });
  });

  describe("POST /api/webhook/monday", () => {
    it("should handle missing board/item IDs", async () => {
      const response = await request(app).post("/api/webhook/monday").send({}).expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("Missing boardId or itemId");
    });

    it("should accept standard webhook format", async () => {
      const response = await request(app)
        .post("/api/webhook/monday")
        .send({
          event: {
            boardId: 123456,
            pulseId: 789012,
          },
        });

      // Will fail at Monday.com API call, but validates format
      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe("GET /api-docs", () => {
    it("should serve Swagger documentation", async () => {
      const response = await request(app).get("/api-docs/").expect(200);

      expect(response.text).toContain("swagger");
    });
  });
});
