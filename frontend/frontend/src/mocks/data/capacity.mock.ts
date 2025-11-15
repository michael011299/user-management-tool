export const mockCapacityStats = {
  success: true,
  data: {
    accounts: [
      {
        email: "account1@agency.com",
        gtm: {
          count: 45,
          limit: 100,
          percentage: "45.0",
        },
        ga: {
          count: 67,
          limit: 100,
          percentage: "67.0",
        },
        lastChecked: "2024-11-15T10:30:00Z",
      },
      {
        email: "account2@agency.com",
        gtm: {
          count: 88,
          limit: 100,
          percentage: "88.0",
        },
        ga: {
          count: 92,
          limit: 100,
          percentage: "92.0",
        },
        lastChecked: "2024-11-15T10:30:00Z",
      },
      {
        email: "account3@agency.com",
        gtm: {
          count: 23,
          limit: 100,
          percentage: "23.0",
        },
        ga: {
          count: 34,
          limit: 100,
          percentage: "34.0",
        },
        lastChecked: "2024-11-15T10:30:00Z",
      },
    ],
    summary: {
      totalGTMUsers: 523,
      totalGAUsers: 734,
      highCapacity: 2,
      critical: 1,
      totalAccounts: 13,
    },
    lastUpdated: "2024-11-15T10:30:00Z",
  },
};
