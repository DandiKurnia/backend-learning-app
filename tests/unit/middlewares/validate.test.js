const validate = require("../../../src/middlewares/validate");
const BadRequestError = require("../../../src/errors/bad-request");
const {
  mockRequest,
  mockResponse,
  mockNext,
} = require("../../setup/test-helpers");
const Joi = require("joi");

describe("Validate Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    next = mockNext();
  });

  describe("Valid Data", () => {
    test("should pass validation with valid data", () => {
      const schema = Joi.object({
        name: Joi.string().required(),
        age: Joi.number().required(),
      });

      req.body = {
        name: "John Doe",
        age: 25,
      };

      const middleware = validate(schema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(next).toHaveBeenCalledTimes(1);
    });

    test("should pass validation with optional fields", () => {
      const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().optional(),
      });

      req.body = {
        name: "John Doe",
      };

      const middleware = validate(schema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    test("should allow extra fields if schema allows", () => {
      const schema = Joi.object({
        name: Joi.string().required(),
      }).unknown(true);

      req.body = {
        name: "John Doe",
        extraField: "extra",
      };

      const middleware = validate(schema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });
  });

  describe("Invalid Data", () => {
    test("should throw BadRequestError when validation fails", () => {
      const schema = Joi.object({
        name: Joi.string().required(),
        age: Joi.number().required(),
      });

      req.body = {
        name: "John Doe",
        // Missing age
      };

      const middleware = validate(schema);

      expect(() => {
        middleware(req, res, next);
      }).toThrow(BadRequestError);

      expect(() => {
        middleware(req, res, next);
      }).toThrow("Invalid request payload");
    });

    test("should throw BadRequestError when data type is wrong", () => {
      const schema = Joi.object({
        name: Joi.string().required(),
        age: Joi.number().required(),
      });

      req.body = {
        name: "John Doe",
        age: "not a number",
      };

      const middleware = validate(schema);

      expect(() => {
        middleware(req, res, next);
      }).toThrow(BadRequestError);
    });

    test("should throw BadRequestError with empty body", () => {
      const schema = Joi.object({
        name: Joi.string().required(),
      });

      req.body = {};

      const middleware = validate(schema);

      expect(() => {
        middleware(req, res, next);
      }).toThrow(BadRequestError);
    });

    test("should handle nested object validation", () => {
      const schema = Joi.object({
        user: Joi.object({
          name: Joi.string().required(),
          email: Joi.string().email().required(),
        }).required(),
      });

      req.body = {
        user: {
          name: "John Doe",
          // Missing email
        },
      };

      const middleware = validate(schema);

      expect(() => {
        middleware(req, res, next);
      }).toThrow(BadRequestError);
    });
  });

  describe("Edge Cases", () => {
    test("should handle null body", () => {
      const schema = Joi.object({
        name: Joi.string().required(),
      });

      req.body = null;

      const middleware = validate(schema);

      expect(() => {
        middleware(req, res, next);
      }).toThrow(BadRequestError);
    });

    test("should work with complex validation rules", () => {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        age: Joi.number().min(18).max(100).required(),
      });

      req.body = {
        email: "test@example.com",
        password: "password123",
        age: 25,
      };

      const middleware = validate(schema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });
  });
});
