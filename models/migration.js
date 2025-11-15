const { getDatabase } = require("./database");

class Migration {
  static create(data) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      const sql = `
        INSERT INTO account_migrations 
        (client_name, move_type, old_email, new_email, offboard_email, 
         ga_account_id, gtm_account_id, gtm_container_id, 
         agency_account_used, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.run(
        sql,
        [
          data.clientName,
          data.moveType,
          data.oldEmail || null,
          data.newEmail,
          data.offboardEmail || null,
          data.gaAccountId || null,
          data.gtmAccountId || null,
          data.gtmContainerId || null,
          data.agencyAccountUsed || null,
          "pending",
        ],
        function (err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  static updateStatus(moveId, status, data = {}) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      const sql = `
        UPDATE account_migrations 
        SET status = ?,
            old_location = ?,
            new_location = ?,
            offboard_location = ?,
            error_message = ?,
            completed_at = CURRENT_TIMESTAMP
        WHERE move_id = ?
      `;

      db.run(
        sql,
        [
          status,
          data.oldLocation || null,
          data.newLocation || null,
          data.offboardLocation || null,
          data.errorMessage || null,
          moveId,
        ],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  static getById(moveId) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      const sql = "SELECT * FROM account_migrations WHERE move_id = ?";

      db.get(sql, [moveId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static getAll(limit = 100) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      const sql = `
        SELECT * FROM account_migrations 
        ORDER BY created_at DESC 
        LIMIT ?
      `;

      db.all(sql, [limit], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static getByClient(clientName) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      const sql = `
        SELECT * FROM account_migrations 
        WHERE client_name = ? 
        ORDER BY created_at DESC
      `;

      db.all(sql, [clientName], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
}

module.exports = Migration;
