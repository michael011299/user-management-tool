const Migration = require("../../../models/migration");
const { initDatabase, getDatabase } = require("../../../models/database");

describe("Migration Model", () => {
  beforeAll(() => {
    initDatabase();
  });

  describe("create", () => {
    it("should create a new migration record", async () => {
      const data = {
        clientName: "Test Client",
        moveType: "migration",
        newEmail: "new@test.com",
        gaAccountId: "123456",
      };

      const moveId = await Migration.create(data);

      expect(moveId).toBeGreaterThan(0);
    });

    it("should handle missing optional fields", async () => {
      const data = {
        clientName: "Test Client 2",
        moveType: "offboard",
        newEmail: "new2@test.com",
      };

      const moveId = await Migration.create(data);
      expect(moveId).toBeGreaterThan(0);
    });
  });

  describe("getById", () => {
    it("should retrieve migration by ID", async () => {
      const createData = {
        clientName: "Test Client 3",
        moveType: "migration",
        newEmail: "new3@test.com",
      };

      const moveId = await Migration.create(createData);
      const migration = await Migration.getById(moveId);

      expect(migration).toBeDefined();
      expect(migration.client_name).toBe("Test Client 3");
      expect(migration.move_type).toBe("migration");
    });

    it("should return undefined for non-existent ID", async () => {
      const migration = await Migration.getById(999999);
      expect(migration).toBeUndefined();
    });
  });

  describe("updateStatus", () => {
    it("should update migration status", async () => {
      const createData = {
        clientName: "Test Client 4",
        moveType: "migration",
        newEmail: "new4@test.com",
      };

      const moveId = await Migration.create(createData);

      await Migration.updateStatus(moveId, "completed", {
        oldLocation: "old@test.com",
        newLocation: "new4@test.com",
      });

      const migration = await Migration.getById(moveId);

      expect(migration.status).toBe("completed");
      expect(migration.old_location).toBe("old@test.com");
      expect(migration.completed_at).toBeTruthy();
    });
  });

  describe("getAll", () => {
    it("should return array of migrations", async () => {
      const migrations = await Migration.getAll(10);

      expect(Array.isArray(migrations)).toBe(true);
      expect(migrations.length).toBeGreaterThan(0);
    });
  });

  describe("getByClient", () => {
    it("should return migrations for specific client", async () => {
      const clientName = "Unique Test Client";

      await Migration.create({
        clientName,
        moveType: "migration",
        newEmail: "test@unique.com",
      });

      const migrations = await Migration.getByClient(clientName);

      expect(migrations.length).toBeGreaterThan(0);
      expect(migrations[0].client_name).toBe(clientName);
    });
  });
});
