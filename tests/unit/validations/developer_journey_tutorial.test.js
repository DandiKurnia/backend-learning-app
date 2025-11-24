const {
  createTutorialSchema,
  updateTutorialSchema,
} = require("../../../src/validations/developer_journey_tutorial");

describe("Developer Journey Tutorial Validation Schemas", () => {
  describe("createTutorialSchema", () => {
    describe("Valid Input", () => {
      test("should validate with all required fields", () => {
        const validData = {
          title: "JavaScript Basics",
          position: 1,
          status: "active",
        };

        const { error } = createTutorialSchema.validate(validData);
        expect(error).toBeUndefined();
      });
    });

    describe("Invalid Input", () => {
      test("should fail when title is missing", () => {
        const invalidData = {
          position: 1,
          status: "active",
        };

        const { error } = createTutorialSchema.validate(invalidData);
        expect(error).toBeDefined();
        expect(error.details[0].message).toContain("title");
      });

      test("should fail when position is missing", () => {
        const invalidData = {
          title: "JavaScript Basics",
          status: "active",
        };

        const { error } = createTutorialSchema.validate(invalidData);
        expect(error).toBeDefined();
        expect(error.details[0].message).toContain("position");
      });

      test("should fail when status is missing", () => {
        const invalidData = {
          title: "JavaScript Basics",
          position: 1,
        };

        const { error } = createTutorialSchema.validate(invalidData);
        expect(error).toBeDefined();
        expect(error.details[0].message).toContain("status");
      });
    });
  });

  describe("updateTutorialSchema", () => {
    describe("Valid Input", () => {
      test("should validate with any field", () => {
        const validData = {
          title: "Updated Title",
        };

        const { error } = updateTutorialSchema.validate(validData);
        expect(error).toBeUndefined();
      });

      test("should validate with multiple fields", () => {
        const validData = {
          title: "Updated Title",
          position: 2,
          status: "inactive",
        };

        const { error } = updateTutorialSchema.validate(validData);
        expect(error).toBeUndefined();
      });
    });
  });
});
