const auth = require("../../../src/middlewares/auth");
const { UnauthenticatedError } = require("../../../src/errors");
const {
  generateToken,
  generateExpiredToken,
  mockRequest,
  mockResponse,
  mockNext,
} = require("../../setup/test-helpers");

describe("Auth Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    next = mockNext();
  });

  describe("Valid Authentication", () => {
    test("should authenticate with valid JWT token", async () => {
      const token = generateToken();
      req.headers.authorization = `Bearer ${token}`;

      await auth(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.user).toBeDefined();
      expect(req.user.userId).toBe(1);
      expect(req.user.email).toBe("test@example.com");
      expect(req.user.displayName).toBe("Test User");
    });

    test("should set correct user data in request object", async () => {
      const customPayload = {
        userId: 99,
        email: "custom@test.com",
        displayName: "Custom User",
      };
      const token = generateToken(customPayload);
      req.headers.authorization = `Bearer ${token}`;

      await auth(req, res, next);

      expect(req.user).toEqual(customPayload);
    });
  });

  describe("Invalid Authentication", () => {
    test("should throw error when authorization header is missing", async () => {
      await expect(auth(req, res, next)).rejects.toThrow(UnauthenticatedError);
      await expect(auth(req, res, next)).rejects.toThrow(
        "Authentication invalid"
      );
    });

    test("should throw error when not Bearer token", async () => {
      req.headers.authorization = "Basic sometoken";

      await expect(auth(req, res, next)).rejects.toThrow(UnauthenticatedError);
      await expect(auth(req, res, next)).rejects.toThrow(
        "Authentication invalid"
      );
    });

    test("should throw error when token is malformed", async () => {
      req.headers.authorization = "Bearer";

      await expect(auth(req, res, next)).rejects.toThrow(UnauthenticatedError);
    });

    test("should throw error when token is expired", async () => {
      const expiredToken = generateExpiredToken();
      req.headers.authorization = `Bearer ${expiredToken}`;

      await expect(auth(req, res, next)).rejects.toThrow(UnauthenticatedError);
      await expect(auth(req, res, next)).rejects.toThrow(
        "Access token expired"
      );
    });

    test("should throw error for invalid JWT token", async () => {
      req.headers.authorization = "Bearer invalid.token.here";

      await expect(auth(req, res, next)).rejects.toThrow(UnauthenticatedError);
      await expect(auth(req, res, next)).rejects.toThrow("Invalid token");
    });

    test("should throw error for token with wrong signature", async () => {
      const tokenWithWrongSecret = require("jsonwebtoken").sign(
        { userId: 1, email: "test@test.com" },
        "wrong_secret",
        { expiresIn: "1h" }
      );
      req.headers.authorization = `Bearer ${tokenWithWrongSecret}`;

      await expect(auth(req, res, next)).rejects.toThrow(UnauthenticatedError);
      await expect(auth(req, res, next)).rejects.toThrow("Invalid token");
    });
  });

  describe("Edge Cases", () => {
    test("should reject token with extra spaces after Bearer", async () => {
      const token = generateToken();
      req.headers.authorization = `Bearer  ${token}`;

      // Extra space after Bearer results in empty or different token
      await expect(auth(req, res, next)).rejects.toThrow(UnauthenticatedError);
    });

    test("should throw error when authorization is undefined", async () => {
      req.headers.authorization = undefined;

      await expect(auth(req, res, next)).rejects.toThrow(UnauthenticatedError);
    });

    test("should not call next when authentication fails", async () => {
      req.headers.authorization = undefined;

      try {
        await auth(req, res, next);
      } catch (error) {
        // Expected to throw
      }

      expect(next).not.toHaveBeenCalled();
    });
  });
});
