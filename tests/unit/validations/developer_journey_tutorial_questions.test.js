const {
  createTutorialQuestionSchema,
  updateTutorialQuestionSchema,
} = require("../../../src/validations/developer_journey_tutorial_questions");

describe("Developer Journey Tutorial Questions Validation", () => {
  describe("createTutorialQuestionSchema", () => {
    describe("Valid Input", () => {
      test("should validate with all required fields", () => {
        const validData = {
          question_text: "What is JavaScript?",
          position: 1,
        };

        const { error, value } =
          createTutorialQuestionSchema.validate(validData);

        expect(error).toBeUndefined();
        expect(value).toEqual(validData);
      });

      test("should validate with string question and positive position", () => {
        const validData = {
          question_text: "How do you declare a variable in JavaScript?",
          position: 5,
        };

        const { error } = createTutorialQuestionSchema.validate(validData);

        expect(error).toBeUndefined();
      });

      test("should validate position as zero", () => {
        const validData = {
          question_text: "What is a function?",
          position: 0,
        };

        const { error } = createTutorialQuestionSchema.validate(validData);

        expect(error).toBeUndefined();
      });
    });

    describe("Invalid Input", () => {
      test("should fail validation when question_text is missing", () => {
        const invalidData = {
          position: 1,
        };

        const { error } = createTutorialQuestionSchema.validate(invalidData);

        expect(error).toBeDefined();
        expect(error.details[0].message).toContain("question_text");
      });

      test("should fail validation when position is missing", () => {
        const invalidData = {
          question_text: "What is JavaScript?",
        };

        const { error } = createTutorialQuestionSchema.validate(invalidData);

        expect(error).toBeDefined();
        expect(error.details[0].message).toContain("position");
      });

      test("should fail validation when question_text is not a string", () => {
        const invalidData = {
          question_text: 123,
          position: 1,
        };

        const { error } = createTutorialQuestionSchema.validate(invalidData);

        expect(error).toBeDefined();
      });

      test("should fail validation when position is not a number", () => {
        const invalidData = {
          question_text: "What is JavaScript?",
          position: "one",
        };

        const { error } = createTutorialQuestionSchema.validate(invalidData);

        expect(error).toBeDefined();
      });

      test("should fail validation when position is a float", () => {
        const invalidData = {
          question_text: "What is JavaScript?",
          position: 1.5,
        };

        const { error } = createTutorialQuestionSchema.validate(invalidData);

        expect(error).toBeDefined();
      });

      test("should fail validation with empty string question_text", () => {
        const invalidData = {
          question_text: "",
          position: 1,
        };

        const { error } = createTutorialQuestionSchema.validate(invalidData);

        expect(error).toBeDefined();
      });

      test("should fail validation when both fields are missing", () => {
        const invalidData = {};

        const { error } = createTutorialQuestionSchema.validate(invalidData);

        expect(error).toBeDefined();
      });
    });
  });

  describe("updateTutorialQuestionSchema", () => {
    describe("Valid Input", () => {
      test("should validate with all fields", () => {
        const validData = {
          question_text: "Updated question text",
          position: 2,
        };

        const { error, value } =
          updateTutorialQuestionSchema.validate(validData);

        expect(error).toBeUndefined();
        expect(value).toEqual(validData);
      });

      test("should validate with updated question_text", () => {
        const validData = {
          question_text: "What is TypeScript?",
          position: 3,
        };

        const { error } = updateTutorialQuestionSchema.validate(validData);

        expect(error).toBeUndefined();
      });
    });

    describe("Invalid Input", () => {
      test("should fail validation when question_text is missing", () => {
        const invalidData = {
          position: 1,
        };

        const { error } = updateTutorialQuestionSchema.validate(invalidData);

        expect(error).toBeDefined();
      });

      test("should fail validation when position is missing", () => {
        const invalidData = {
          question_text: "Updated text",
        };

        const { error } = updateTutorialQuestionSchema.validate(invalidData);

        expect(error).toBeDefined();
      });

      test("should fail validation with invalid data types", () => {
        const invalidData = {
          question_text: 123,
          position: "invalid",
        };

        const { error } = updateTutorialQuestionSchema.validate(invalidData);

        expect(error).toBeDefined();
      });
    });
  });

  describe("Schema Comparison", () => {
    test("createTutorialQuestionSchema and updateTutorialQuestionSchema should have same structure", () => {
      const createData = {
        question_text: "Test question",
        position: 1,
      };

      const createResult = createTutorialQuestionSchema.validate(createData);
      const updateResult = updateTutorialQuestionSchema.validate(createData);

      expect(createResult.error).toBeUndefined();
      expect(updateResult.error).toBeUndefined();
    });
  });
});
