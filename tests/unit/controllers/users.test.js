const {
  register,
  login,
  refresh,
  logout,
} = require("../../../src/api/users/controller");
const UserService = require("../../../src/services/prisma/users");
const {
  mockRequest,
  mockResponse,
  mockNext,
} = require("../../setup/test-helpers");
const { StatusCodes } = require("http-status-codes");

// Mock the service layer
jest.mock("../../../src/services/prisma/users");

describe("User Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    next = mockNext();
    jest.clearAllMocks();
  });

  describe("register", () => {
    test("should register user and return 201", async () => {
      const mockResult = { id: 1, email: "test@test.com" };
      UserService.registerUser.mockResolvedValue(mockResult);

      await register(req, res, next);

      expect(UserService.registerUser).toHaveBeenCalledWith(req);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        data: mockResult,
        status: StatusCodes.CREATED,
      });
    });

    test("should handle errors", async () => {
      const error = new Error("Registration failed");
      UserService.registerUser.mockRejectedValue(error);

      await register(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("login", () => {
    test("should login user and return 201 (Created) based on code", async () => {
      // Note: Usually login returns 200 OK, but controller code uses CREATED
      const mockResult = { accessToken: "token" };
      UserService.loginUser.mockResolvedValue(mockResult);

      await login(req, res, next);

      expect(UserService.loginUser).toHaveBeenCalledWith(req);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        data: mockResult,
        status: StatusCodes.CREATED,
      });
    });

    test("should handle errors", async () => {
      const error = new Error("Login failed");
      UserService.loginUser.mockRejectedValue(error);

      await login(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("refresh", () => {
    test("should refresh token and return 200", async () => {
      const mockResult = { accessToken: "new_token" };
      UserService.refreshAccessToken.mockResolvedValue(mockResult);

      await refresh(req, res, next);

      expect(UserService.refreshAccessToken).toHaveBeenCalledWith(req);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        data: mockResult,
        status: StatusCodes.OK,
      });
    });

    test("should handle errors", async () => {
      const error = new Error("Refresh failed");
      UserService.refreshAccessToken.mockRejectedValue(error);

      await refresh(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("logout", () => {
    test("should logout user and return 200", async () => {
      const mockResult = { message: "Logged out" };
      UserService.deleteRefreshToken.mockResolvedValue(mockResult);

      await logout(req, res, next);

      expect(UserService.deleteRefreshToken).toHaveBeenCalledWith(req);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        data: mockResult,
        status: StatusCodes.OK,
      });
    });

    test("should handle errors", async () => {
      const error = new Error("Logout failed");
      UserService.deleteRefreshToken.mockRejectedValue(error);

      await logout(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
