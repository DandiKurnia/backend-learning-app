const {
  createJourneySchema,
  updateJourneySchema,
} = require("../../../src/validations/developer_journey");

describe("Developer Journey Validation Schemas", () => {
  describe("createJourneySchema", () => {
    describe("Valid Input", () => {
      test("should validate with all required fields", () => {
        const validData = {
          name: "JavaScript Fundamentals",
          summary: "Learn the basics of JavaScript",
          dead_line: new Date("2024-12-31"),
        };

        const { error } = createJourneySchema.validate(validData);
        expect(error).toBeUndefined();
      });

      test("should apply default values for optional fields", () => {
        const validData = {
          name: "React Journey",
          summary: "Master React",
          dead_line: new Date(),
        };

        const { error, value } = createJourneySchema.validate(validData);
        expect(error).toBeUndefined();
        expect(value.point).toBe(0);
        expect(value.required_point).toBe(0);
        expect(value.xp).toBe(0);
        expect(value.status).toBe(0);
      });
    });

    describe("Invalid Input", () => {
      test("should fail when name is missing", () => {
        const invalidData = {
          summary: "Summary",
          dead_line: new Date(),
        };

        const { error } = createJourneySchema.validate(invalidData);
        expect(error).toBeDefined();
        expect(error.details[0].message).toContain("name");
      });

      test("should fail when summary is missing", () => {
        const invalidData = {
          name: "Journey Name",
          dead_line: new Date(),
        };

        const { error } = createJourneySchema.validate(invalidData);
        expect(error).toBeDefined();
        expect(error.details[0].message).toContain("summary");
      });

      test("should fail when dead_line is missing", () => {
        const invalidData = {
          name: "Journey Name",
          summary: "Summary",
        };

        const { error } = createJourneySchema.validate(invalidData);
        expect(error).toBeDefined();
        expect(error.details[0].message).toContain("dead_line");
      });

      test("should fail when dead_line is not a valid date", () => {
        const invalidData = {
          name: "Journey Name",
          summary: "Summary",
          dead_line: "not-a-date",
        };

        const { error } = createJourneySchema.validate(invalidData);
        expect(error).toBeDefined();
      });
    });
  });

  describe("updateJourneySchema", () => {
    describe("Valid Input", () => {
      test("should validate with any field", () => {
        const validData = {
          name: "Updated Name",
        };

        const { error } = updateJourneySchema.validate(validData);
        expect(error).toBeUndefined();
      });

      test("should validate with multiple fields", () => {
        const validData = {
          name: "Updated Name",
          summary: "Updated Summary",
          point: 100,
        };

        const { error } = updateJourneySchema.validate(validData);
        expect(error).toBeUndefined();
      });
    });

    describe("Invalid Input", () => {
      test("should fail when no fields provided", () => {
        const invalidData = {};

        const { error } = updateJourneySchema.validate(invalidData);
        expect(error).toBeDefined();
      });

      test("should fail when field type is wrong", () => {
        const invalidData = {
          point: "not-a-number",
        };

        const { error } = updateJourneySchema.validate(invalidData);
        expect(error).toBeDefined();
      });
    });
  });
});
