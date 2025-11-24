// Mock dependencies
const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  authentication: {
    create: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  },
};

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn(() => mockPrisma),
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  registerUser,
  loginUser,
  refreshAccessToken,
  deleteRefreshToken,
} = require("../../../src/services/prisma/users");
const {
  BadRequestError,
  UnauthenticatedError,
} = require("../../../src/errors");

describe("User Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("registerUser", () => {
    const userData = {
      display_name: "John Doe",
      name: "John",
      email: "john@example.com",
      password: "password123",
      phone: "08123456789",
      user_role: 1,
    };

    test("should register a new user successfully", async () => {
      const mockReq = { body: userData };
      const hashedPassword = "hashedPassword123";
      const createdUser = { ...userData, id: 1, password: hashedPassword };

      mockPrisma.user.findUnique.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue(hashedPassword);
      mockPrisma.user.create.mockResolvedValue(createdUser);

      const result = await registerUser(mockReq);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: userData.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(mockPrisma.user.create).toHaveBeenCalled();
      expect(result.email).toBe(userData.email);
      expect(result).not.toHaveProperty("password"); // Should not return password
    });

    test("should throw BadRequestError if email already exists", async () => {
      const mockReq = { body: userData };
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: userData.email,
      });

      await expect(registerUser(mockReq)).rejects.toThrow(BadRequestError);
      await expect(registerUser(mockReq)).rejects.toThrow(
        "User with this email already exists"
      );
    });
  });

  describe("loginUser", () => {
    const loginData = {
      email: "john@example.com",
      password: "password123",
    };
    const userInDb = {
      id: 1,
      email: "john@example.com",
      password: "hashedPassword123",
      display_name: "John Doe",
    };

    test("should login successfully and return tokens", async () => {
      const mockReq = { body: loginData };
      const accessToken = "access_token";
      const refreshToken = "refresh_token";

      mockPrisma.user.findUnique.mockResolvedValue(userInDb);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign
        .mockReturnValueOnce(accessToken) // First call for access token
        .mockReturnValueOnce(refreshToken); // Second call for refresh token
      mockPrisma.authentication.create.mockResolvedValue({});

      const result = await loginUser(mockReq);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginData.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginData.password,
        userInDb.password
      );
      expect(mockPrisma.authentication.create).toHaveBeenCalledWith({
        data: { token: refreshToken },
      });
      expect(result).toHaveProperty("accessToken", accessToken);
      expect(result).toHaveProperty("refreshToken", refreshToken);
    });

    test("should throw UnauthenticatedError if user not found", async () => {
      const mockReq = { body: loginData };
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(loginUser(mockReq)).rejects.toThrow(UnauthenticatedError);
      await expect(loginUser(mockReq)).rejects.toThrow("Invalid credentials");
    });

    test("should throw UnauthenticatedError if password invalid", async () => {
      const mockReq = { body: loginData };
      mockPrisma.user.findUnique.mockResolvedValue(userInDb);
      bcrypt.compare.mockResolvedValue(false);

      await expect(loginUser(mockReq)).rejects.toThrow(UnauthenticatedError);
      await expect(loginUser(mockReq)).rejects.toThrow("Invalid credentials");
    });
  });

  describe("refreshAccessToken", () => {
    test("should generate new access token", async () => {
      const refreshToken = "valid_refresh_token";
      const mockReq = { body: { refreshToken } };
      const decoded = { userId: 1 };
      const user = { id: 1, email: "john@example.com" };
      const newAccessToken = "new_access_token";

      mockPrisma.authentication.findUnique.mockResolvedValue({
        token: refreshToken,
      });
      jwt.verify.mockReturnValue(decoded);
      mockPrisma.user.findUnique.mockResolvedValue(user);
      jwt.sign.mockReturnValue(newAccessToken);

      const result = await refreshAccessToken(mockReq);

      expect(result).toEqual({ accessToken: newAccessToken });
    });

    test("should throw BadRequestError if refresh token missing", async () => {
      const mockReq = { body: {} };
      await expect(refreshAccessToken(mockReq)).rejects.toThrow(
        BadRequestError
      );
    });

    test("should throw BadRequestError if refresh token not in db", async () => {
      const mockReq = { body: { refreshToken: "invalid" } };
      mockPrisma.authentication.findUnique.mockResolvedValue(null);
      await expect(refreshAccessToken(mockReq)).rejects.toThrow(
        BadRequestError
      );
    });
  });

  describe("deleteRefreshToken", () => {
    test("should delete refresh token successfully", async () => {
      const refreshToken = "valid_token";
      const mockReq = { body: { refreshToken } };

      mockPrisma.authentication.findUnique.mockResolvedValue({
        token: refreshToken,
      });
      mockPrisma.authentication.delete.mockResolvedValue({});

      const result = await deleteRefreshToken(mockReq);

      expect(mockPrisma.authentication.delete).toHaveBeenCalledWith({
        where: { token: refreshToken },
      });
      expect(result).toEqual({ message: "Refresh token deleted successfully" });
    });

    test("should throw BadRequestError if token not found", async () => {
      const mockReq = { body: { refreshToken: "invalid" } };
      mockPrisma.authentication.findUnique.mockResolvedValue(null);

      await expect(deleteRefreshToken(mockReq)).rejects.toThrow(
        BadRequestError
      );
    });
  });
});
