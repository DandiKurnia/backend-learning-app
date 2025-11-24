// Global test setup
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test_secret_key";
process.env.REFRESH_TOKEN_SECRET = "test_refresh_secret_key";

// Suppress console logs during tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(), // Also suppress error to avoid cluttering test output
};
