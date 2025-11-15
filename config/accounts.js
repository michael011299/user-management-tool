const AGENCY_ACCOUNTS = {
  "account1@agency.com": {
    clientId: process.env.ACCOUNT1_CLIENT_ID,
    clientSecret: process.env.ACCOUNT1_CLIENT_SECRET,
    refreshToken: process.env.ACCOUNT1_REFRESH_TOKEN,
  },
  "account2@agency.com": {
    clientId: process.env.ACCOUNT2_CLIENT_ID,
    clientSecret: process.env.ACCOUNT2_CLIENT_SECRET,
    refreshToken: process.env.ACCOUNT2_REFRESH_TOKEN,
  },
  "account3@agency.com": {
    clientId: process.env.ACCOUNT3_CLIENT_ID,
    clientSecret: process.env.ACCOUNT3_CLIENT_SECRET,
    refreshToken: process.env.ACCOUNT3_REFRESH_TOKEN,
  },
  "account4@agency.com": {
    clientId: process.env.ACCOUNT4_CLIENT_ID,
    clientSecret: process.env.ACCOUNT4_CLIENT_SECRET,
    refreshToken: process.env.ACCOUNT4_REFRESH_TOKEN,
  },
  "account5@agency.com": {
    clientId: process.env.ACCOUNT5_CLIENT_ID,
    clientSecret: process.env.ACCOUNT5_CLIENT_SECRET,
    refreshToken: process.env.ACCOUNT5_REFRESH_TOKEN,
  },
  "account6@agency.com": {
    clientId: process.env.ACCOUNT6_CLIENT_ID,
    clientSecret: process.env.ACCOUNT6_CLIENT_SECRET,
    refreshToken: process.env.ACCOUNT6_REFRESH_TOKEN,
  },
  "account7@agency.com": {
    clientId: process.env.ACCOUNT7_CLIENT_ID,
    clientSecret: process.env.ACCOUNT7_CLIENT_SECRET,
    refreshToken: process.env.ACCOUNT7_REFRESH_TOKEN,
  },
  "account8@agency.com": {
    clientId: process.env.ACCOUNT8_CLIENT_ID,
    clientSecret: process.env.ACCOUNT8_CLIENT_SECRET,
    refreshToken: process.env.ACCOUNT8_REFRESH_TOKEN,
  },
  "account9@agency.com": {
    clientId: process.env.ACCOUNT9_CLIENT_ID,
    clientSecret: process.env.ACCOUNT9_CLIENT_SECRET,
    refreshToken: process.env.ACCOUNT9_REFRESH_TOKEN,
  },
  "account10@agency.com": {
    clientId: process.env.ACCOUNT10_CLIENT_ID,
    clientSecret: process.env.ACCOUNT10_CLIENT_SECRET,
    refreshToken: process.env.ACCOUNT10_REFRESH_TOKEN,
  },
  "account11@agency.com": {
    clientId: process.env.ACCOUNT11_CLIENT_ID,
    clientSecret: process.env.ACCOUNT11_CLIENT_SECRET,
    refreshToken: process.env.ACCOUNT11_REFRESH_TOKEN,
  },
  "account12@agency.com": {
    clientId: process.env.ACCOUNT12_CLIENT_ID,
    clientSecret: process.env.ACCOUNT12_CLIENT_SECRET,
    refreshToken: process.env.ACCOUNT12_REFRESH_TOKEN,
  },
  "account13@agency.com": {
    clientId: process.env.ACCOUNT13_CLIENT_ID,
    clientSecret: process.env.ACCOUNT13_CLIENT_SECRET,
    refreshToken: process.env.ACCOUNT13_REFRESH_TOKEN,
  },
};

// Offboard account credentials
const OFFBOARD_ACCOUNT = {
  email: process.env.OFFBOARD_EMAIL || "offboard@agency.com",
  clientId: process.env.OFFBOARD_CLIENT_ID,
  clientSecret: process.env.OFFBOARD_CLIENT_SECRET,
  refreshToken: process.env.OFFBOARD_REFRESH_TOKEN,
};

module.exports = { AGENCY_ACCOUNTS, OFFBOARD_ACCOUNT };
