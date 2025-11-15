// Based on official Google Analytics Management API v3
// Reference: https://developers.google.com/analytics/devguides/config/mgmt/v3/mgmtReference

export const mockGAAccountsList = {
  kind: "analytics#accounts",
  username: "account1@agency.com",
  totalResults: 3,
  startIndex: 1,
  itemsPerPage: 1000,
  items: [
    {
      id: "123456789",
      kind: "analytics#account",
      selfLink: "https://www.googleapis.com/analytics/v3/management/accounts/123456789",
      name: "Acme Corporation",
      permissions: {
        effective: ["COLLABORATE", "EDIT", "MANAGE_USERS", "READ_AND_ANALYZE"],
      },
      created: "2020-01-15T10:30:00.000Z",
      updated: "2024-11-15T14:22:00.000Z",
      starred: false,
    },
    {
      id: "987654321",
      kind: "analytics#account",
      selfLink: "https://www.googleapis.com/analytics/v3/management/accounts/987654321",
      name: "Beta Industries",
      permissions: {
        effective: ["READ_AND_ANALYZE"],
      },
      created: "2021-03-20T09:15:00.000Z",
      updated: "2024-10-10T11:45:00.000Z",
      starred: false,
    },
    {
      id: "456789123",
      kind: "analytics#account",
      selfLink: "https://www.googleapis.com/analytics/v3/management/accounts/456789123",
      name: "Gamma Services",
      permissions: {
        effective: ["EDIT", "READ_AND_ANALYZE"],
      },
      created: "2022-06-10T13:00:00.000Z",
      updated: "2024-11-01T16:30:00.000Z",
      starred: true,
    },
  ],
};

export const mockGAUserLinks = {
  kind: "analytics#entityUserLinks",
  totalResults: 5,
  startIndex: 1,
  itemsPerPage: 1000,
  items: [
    {
      kind: "analytics#entityUserLink",
      id: "123456789:1001",
      selfLink: "https://www.googleapis.com/analytics/v3/management/accounts/123456789/entityUserLinks/123456789:1001",
      entity: {
        accountRef: {
          href: "https://www.googleapis.com/analytics/v3/management/accounts/123456789",
          id: "123456789",
          kind: "analytics#accountRef",
          name: "Acme Corporation",
        },
      },
      permissions: {
        local: ["MANAGE_USERS", "EDIT", "COLLABORATE", "READ_AND_ANALYZE"],
        effective: ["MANAGE_USERS", "EDIT", "COLLABORATE", "READ_AND_ANALYZE"],
      },
      userRef: {
        kind: "analytics#userRef",
        email: "admin@acme.com",
        id: "1001",
      },
    },
    {
      kind: "analytics#entityUserLink",
      id: "123456789:1002",
      selfLink: "https://www.googleapis.com/analytics/v3/management/accounts/123456789/entityUserLinks/123456789:1002",
      entity: {
        accountRef: {
          href: "https://www.googleapis.com/analytics/v3/management/accounts/123456789",
          id: "123456789",
          kind: "analytics#accountRef",
          name: "Acme Corporation",
        },
      },
      permissions: {
        local: ["READ_AND_ANALYZE"],
        effective: ["READ_AND_ANALYZE"],
      },
      userRef: {
        kind: "analytics#userRef",
        email: "analyst@acme.com",
        id: "1002",
      },
    },
    {
      kind: "analytics#entityUserLink",
      id: "123456789:1003",
      selfLink: "https://www.googleapis.com/analytics/v3/management/accounts/123456789/entityUserLinks/123456789:1003",
      entity: {
        accountRef: {
          href: "https://www.googleapis.com/analytics/v3/management/accounts/123456789",
          id: "123456789",
          kind: "analytics#accountRef",
          name: "Acme Corporation",
        },
      },
      permissions: {
        local: ["EDIT", "COLLABORATE", "READ_AND_ANALYZE"],
        effective: ["EDIT", "COLLABORATE", "READ_AND_ANALYZE"],
      },
      userRef: {
        kind: "analytics#userRef",
        email: "account1@agency.com",
        id: "1003",
      },
    },
  ],
};
