const {
  createTutorialQuestionsOptionsSchema,
  updateTutorialQuestionsOptionsSchema,
} = require("../../../src/validations/tutorial_questions_options");

describe("Tutorial Questions Options Validation Schemas", () => {
  describe("createTutorialQuestionsOptionsSchema", () => {
    describe("Valid Input", () => {
      test("should validate with all required fields", () => {
        const validData = {
          option_label: "A",
          option_text: "Option A text",
        };

        const { error } =
          createTutorialQuestionsOptionsSchema.validate(validData);
        expect(error).toBeUndefined();
      });
    });

    describe("Invalid Input", () => {
      test("should fail when option_label is missing", () => {
        const invalidData = {
          option_text: "Option text",
        };

        const { error } =
          createTutorialQuestionsOptionsSchema.validate(invalidData);
        expect(error).toBeDefined();
        expect(error.details[0].message).toContain("option_label");
      });

      test("should fail when option_text is missing", () => {
        const invalidData = {
          option_label: "A",
        };

        const { error } =
          createTutorialQuestionsOptionsSchema.validate(invalidData);
        expect(error).toBeDefined();
        expect(error.details[0].message).toContain("option_text");
      });
    });
  });

  describe("updateTutorialQuestionsOptionsSchema", () => {
    describe("Valid Input", () => {
      test("should validate with option_text", () => {
        const validData = {
          option_text: "Updated option text",
        };

        const { error } =
          updateTutorialQuestionsOptionsSchema.validate(validData);
        expect(error).toBeUndefined();
      });

      test("should validate with empty object", () => {
        const validData = {};

        const { error } =
          updateTutorialQuestionsOptionsSchema.validate(validData);
        expect(error).toBeUndefined();
      });
    });
  });
});
