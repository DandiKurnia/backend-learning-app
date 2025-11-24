const jwt = require("jsonwebtoken");

/**
 * Generate a valid JWT token for testing
 */
const generateToken = (payload = {}) => {
  const defaultPayload = {
    userId: 1,
    email: "test@example.com",
    displayName: "Test User",
    ...payload,
  };

  return jwt.sign(defaultPayload, process.env.JWT_SECRET || "test_secret_key", {
    expiresIn: "1h",
  });
};

/**
 * Generate an expired JWT token for testing
 */
const generateExpiredToken = (payload = {}) => {
  const defaultPayload = {
    userId: 1,
    email: "test@example.com",
    displayName: "Test User",
    ...payload,
  };

  return jwt.sign(defaultPayload, process.env.JWT_SECRET || "test_secret_key", {
    expiresIn: "-1h", // Expired 1 hour ago
  });
};

/**
 * Create a mock Express request object
 */
const mockRequest = (overrides = {}) => {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    user: null,
    ...overrides,
  };
};

/**
 * Create a mock Express response object
 */
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

/**
 * Create a mock Express next function
 */
const mockNext = () => jest.fn();

/**
 * Test data fixtures
 */
const fixtures = {
  tutorial: {
    id: 1,
    title: "Test Tutorial",
    description: "Test tutorial description",
    journey_id: 1,
  },

  tutorialQuestion: {
    id: 1,
    question_text: "What is JavaScript?",
    position: 1,
    tutorial_id: 1,
  },

  tutorialQuestionWithOptions: {
    id: 1,
    question_text: "What is JavaScript?",
    position: 1,
    tutorial_id: 1,
    options: [
      { option_label: "A", option_text: "A programming language" },
      { option_label: "B", option_text: "A markup language" },
    ],
  },

  user: {
    userId: 1,
    email: "test@example.com",
    displayName: "Test User",
  },
};

module.exports = {
  generateToken,
  generateExpiredToken,
  mockRequest,
  mockResponse,
  mockNext,
  fixtures,
};
