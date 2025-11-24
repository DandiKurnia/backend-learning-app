// Mock Prisma
const mockPrisma = {
  developerJourneyTutorialQuestion: {
    findUnique: jest.fn(),
  },
  tutorialOption: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn(() => mockPrisma),
}));

const {
  getAllTutorialQuestionsOptions,
  createTutorialQuestionOption,
  updateTutorialQuestionOption,
  deleteTutorialQuestionOption,
} = require("../../../src/services/prisma/tutorial_questions_options");
const { NotFoundError, BadRequestError } = require("../../../src/errors");

describe("Tutorial Questions Options Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllTutorialQuestionsOptions", () => {
    test("should return all options for a question", async () => {
      const mockReq = { params: { questionId: "1" } };
      const mockOptions = [
        { id: 1, option_label: "A", option_text: "Option A" },
        { id: 2, option_label: "B", option_text: "Option B" },
      ];

      mockPrisma.developerJourneyTutorialQuestion.findUnique.mockResolvedValue({
        id: 1,
      });
      mockPrisma.tutorialOption.findMany.mockResolvedValue(mockOptions);

      const result = await getAllTutorialQuestionsOptions(mockReq);

      expect(result).toEqual(mockOptions);
    });

    test("should throw NotFoundError if question not found", async () => {
      const mockReq = { params: { questionId: "999" } };
      mockPrisma.developerJourneyTutorialQuestion.findUnique.mockResolvedValue(
        null
      );

      await expect(getAllTutorialQuestionsOptions(mockReq)).rejects.toThrow(
        NotFoundError
      );
    });
  });

  describe("createTutorialQuestionOption", () => {
    const mockReq = {
      params: { questionId: "1" },
      body: { option_label: "A", option_text: "Option A" },
    };

    test("should create option successfully", async () => {
      mockPrisma.developerJourneyTutorialQuestion.findUnique.mockResolvedValue({
        id: 1,
      });
      mockPrisma.tutorialOption.findFirst.mockResolvedValue(null);
      mockPrisma.tutorialOption.create.mockResolvedValue({
        id: 1,
        ...mockReq.body,
        question_id: 1,
      });

      const result = await createTutorialQuestionOption(mockReq);

      expect(result).toHaveProperty("option_label", "A");
    });

    test("should throw NotFoundError if question not found", async () => {
      mockPrisma.developerJourneyTutorialQuestion.findUnique.mockResolvedValue(
        null
      );

      await expect(createTutorialQuestionOption(mockReq)).rejects.toThrow(
        NotFoundError
      );
    });

    test("should throw BadRequestError if option already exists", async () => {
      mockPrisma.developerJourneyTutorialQuestion.findUnique.mockResolvedValue({
        id: 1,
      });
      mockPrisma.tutorialOption.findFirst.mockResolvedValue({ id: 1 });

      await expect(createTutorialQuestionOption(mockReq)).rejects.toThrow(
        BadRequestError
      );
    });
  });

  describe("updateTutorialQuestionOption", () => {
    const mockReq = {
      params: { questionId: "1", optionId: "1" },
      body: { option_text: "Updated text" },
    };

    test("should update option successfully", async () => {
      mockPrisma.tutorialOption.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.tutorialOption.findFirst.mockResolvedValue(null);
      mockPrisma.tutorialOption.update.mockResolvedValue({
        id: 1,
        option_text: "Updated text",
      });

      const result = await updateTutorialQuestionOption(mockReq);

      expect(result.option_text).toBe("Updated text");
    });

    test("should throw NotFoundError if option not found", async () => {
      mockPrisma.tutorialOption.findUnique.mockResolvedValue(null);

      await expect(updateTutorialQuestionOption(mockReq)).rejects.toThrow(
        NotFoundError
      );
    });

    test("should throw BadRequestError if duplicate", async () => {
      mockPrisma.tutorialOption.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.tutorialOption.findFirst.mockResolvedValue({ id: 2 });

      await expect(updateTutorialQuestionOption(mockReq)).rejects.toThrow(
        BadRequestError
      );
    });
  });

  describe("deleteTutorialQuestionOption", () => {
    test("should delete option successfully", async () => {
      const mockReq = { params: { optionId: "1" } };
      mockPrisma.tutorialOption.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.tutorialOption.delete.mockResolvedValue({ id: 1 });

      const result = await deleteTutorialQuestionOption(mockReq);

      expect(result).toEqual({ id: 1 });
    });

    test("should throw NotFoundError if option not found", async () => {
      const mockReq = { params: { optionId: "999" } };
      mockPrisma.tutorialOption.findUnique.mockResolvedValue(null);

      await expect(deleteTutorialQuestionOption(mockReq)).rejects.toThrow(
        NotFoundError
      );
    });
  });
});
