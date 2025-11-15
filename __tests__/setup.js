// Global test setup
process.env.NODE_ENV = "test";
process.env.PORT = "3001";
process.env.REDIRECT_URI = "http://localhost:3001/oauth2callback";

// Mock environment variables for testing
process.env.ACCOUNT1_CLIENT_ID = "test_client_id_1";
process.env.ACCOUNT1_CLIENT_SECRET = "test_client_secret_1";
process.env.ACCOUNT1_REFRESH_TOKEN = "test_refresh_token_1";

process.env.OFFBOARD_EMAIL = "offboard@test.com";
process.env.OFFBOARD_CLIENT_ID = "test_offboard_client_id";
process.env.OFFBOARD_CLIENT_SECRET = "test_offboard_client_secret";
process.env.OFFBOARD_REFRESH_TOKEN = "test_offboard_refresh_token";

process.env.MONDAY_API_KEY = "test_monday_api_key";
process.env.MONDAY_WEBHOOK_SECRET = "test_webhook_secret";

// Set test timeout
jest.setTimeout(10000);
