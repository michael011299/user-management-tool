const fetch = require("node-fetch");

class MondayService {
  constructor() {
    this.apiUrl = "https://api.monday.com/v2";
    this.apiKey = process.env.MONDAY_API_KEY;
  }

  async executeQuery(query, variables = {}) {
    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: this.apiKey,
          "API-Version": "2024-01",
        },
        body: JSON.stringify({ query, variables }),
      });

      const data = await response.json();

      if (data.errors) {
        throw new Error(`Monday.com API Error: ${JSON.stringify(data.errors)}`);
      }

      return data;
    } catch (error) {
      console.error("Monday.com API Error:", error);
      throw error;
    }
  }

  async getItemData(boardId, itemId) {
    const query = `
      query ($boardId: ID!, $itemId: ID!) {
        boards(ids: [$boardId]) {
          items(ids: [$itemId]) {
            id
            name
            column_values {
              id
              text
              value
            }
          }
        }
      }
    `;

    const variables = {
      boardId: boardId.toString(),
      itemId: itemId.toString(),
    };

    const result = await this.executeQuery(query, variables);
    return result.data.boards[0].items[0];
  }

  async updateColumnValues(boardId, itemId, columnValues) {
    const query = `
      mutation ($boardId: ID!, $itemId: ID!, $columnValues: JSON!) {
        change_multiple_column_values(
          board_id: $boardId,
          item_id: $itemId,
          column_values: $columnValues
        ) {
          id
        }
      }
    `;

    const variables = {
      boardId: boardId.toString(),
      itemId: itemId.toString(),
      columnValues: JSON.stringify(columnValues),
    };

    return await this.executeQuery(query, variables);
  }

  async updateStatus(boardId, itemId, statusColumnId, statusLabel, additionalColumns = {}) {
    const columnValues = {
      [statusColumnId]: { label: statusLabel },
      ...additionalColumns,
    };

    return await this.updateColumnValues(boardId, itemId, columnValues);
  }

  parseColumnValues(columnValues) {
    const data = {};

    columnValues.forEach((col) => {
      // Store both the text and parsed value
      data[col.id] = {
        text: col.text,
        value: col.value ? JSON.parse(col.value) : null,
      };
    });

    return data;
  }

  extractValue(columnData, key) {
    if (!columnData) return null;

    const column = columnData[key];
    if (!column) return null;

    // Return text if available, otherwise try to extract from value
    if (column.text && column.text.trim()) {
      return column.text.trim();
    }

    // Handle different column types
    if (column.value) {
      if (column.value.label) return column.value.label;
      if (column.value.text) return column.value.text;
      if (column.value.email) return column.value.email;
    }

    return null;
  }
}

module.exports = MondayService;
