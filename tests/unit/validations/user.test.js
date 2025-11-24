const {
  registerUserSchema,
  loginUserSchema,
} = require("../../../src/validations/user");

describe("User Validation Schemas", () => {
  describe("registerUserSchema", () => {
    describe("Valid Input", () => {
      test("should validate with all required fields", () => {
        const validData = {
          display_name: "John Doe",
          name: "John",
          email: "john@example.com",
          password: "password123",
          phone: "08123456789",
          user_role: 1,
        };

        const { error, value } = registerUserSchema.validate(validData);

        expect(error).toBeUndefined();
        expect(value).toEqual(validData);
      });
    });

    describe("Invalid Input", () => {
      test("should fail when required fields are missing", () => {
        const invalidData = {
          name: "John",
        };

        const { error } = registerUserSchema.validate(invalidData);

        expect(error).toBeDefined();
        expect(error.details[0].message).toContain("display_name");
      });

      test("should fail when email is invalid", () => {
        const invalidData = {
          display_name: "John Doe",
          name: "John",
          email: "not-an-email",
          password: "password123",
          phone: "08123456789",
          user_role: 1,
        };

        const { error } = registerUserSchema.validate(invalidData);

        expect(error).toBeDefined();
        expect(error.details[0].message).toContain("email");
      });

      test("should fail when password is too short", () => {
        const invalidData = {
          display_name: "John Doe",
          name: "John",
          email: "john@example.com",
          password: "123",
          phone: "08123456789",
          user_role: 1,
        };

        const { error } = registerUserSchema.validate(invalidData);

        expect(error).toBeDefined();
        expect(error.details[0].message).toContain("password");
      });
    });
  });

  describe("loginUserSchema", () => {
    describe("Valid Input", () => {
      test("should validate with valid credentials", () => {
        const validData = {
          email: "john@example.com",
          password: "password123",
        };

        const { error, value } = loginUserSchema.validate(validData);

        expect(error).toBeUndefined();
        expect(value).toEqual(validData);
      });
    });

    describe("Invalid Input", () => {
      test("should fail when email is missing", () => {
        const invalidData = {
          password: "password123",
        };

        const { error } = loginUserSchema.validate(invalidData);

        expect(error).toBeDefined();
        expect(error.details[0].message).toContain("email");
      });

      test("should fail when email is invalid", () => {
        const invalidData = {
          email: "invalid-email",
          password: "password123",
        };

        const { error } = loginUserSchema.validate(invalidData);

        expect(error).toBeDefined();
        expect(error.details[0].message).toContain("email");
      });

      test("should fail when password is too short", () => {
        const invalidData = {
          email: "john@example.com",
          password: "123",
        };

        const { error } = loginUserSchema.validate(invalidData);

        expect(error).toBeDefined();
        expect(error.details[0].message).toContain("password");
      });
    });
  });
});
