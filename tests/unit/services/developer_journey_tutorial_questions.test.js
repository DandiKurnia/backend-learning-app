// Mock Prisma before importing the service
const mockPrisma = {
  developerJourneyTutorial: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
  developerJourneyTutorialQuestion: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  tutorialOption: {
    deleteMany: jest.fn(),
  },
};

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn(() => mockPrisma),
}));

const { PrismaClient } = require("@prisma/client");
const {
  getAllTutorialQuestions,
  createTutorialQuestion,
  getTutorialQuestionById,
  updateTutorialQuestion,
  destroyTutorialQuestion,
} = require("../../../src/services/prisma/developer_journey_tutorial_questions");
const { BadRequestError, NotFoundError } = require("../../../src/errors");
const { fixtures } = require("../../setup/test-helpers");

// Get the mocked prisma instance
const prisma = new PrismaClient();

describe("Developer Journey Tutorial Questions Service", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe("getAllTutorialQuestions", () => {
    test("should return all questions for a valid tutorial", async () => {
      const tutorialId = "1";
      const mockQuestions = [
        { ...fixtures.tutorialQuestion, id: 1 },
        { ...fixtures.tutorialQuestion, id: 2, position: 2 },
      ];

      prisma.developerJourneyTutorial.findUnique.mockResolvedValue(
        fixtures.tutorial
      );
      prisma.developerJourneyTutorialQuestion.findMany.mockResolvedValue(
        mockQuestions
      );

      const result = await getAllTutorialQuestions(tutorialId);

      expect(prisma.developerJourneyTutorial.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(
        prisma.developerJourneyTutorialQuestion.findMany
      ).toHaveBeenCalledWith({
        where: { tutorial_id: 1 },
      });
      expect(result).toEqual(mockQuestions);
    });

    test("should throw NotFoundError when tutorial does not exist", async () => {
      const tutorialId = "999";

      prisma.developerJourneyTutorial.findUnique.mockResolvedValue(null);

      await expect(getAllTutorialQuestions(tutorialId)).rejects.toThrow(
        NotFoundError
      );
      await expect(getAllTutorialQuestions(tutorialId)).rejects.toThrow(
        "Tutorial not found"
      );
    });

    test("should return empty array when tutorial has no questions", async () => {
      const tutorialId = "1";

      prisma.developerJourneyTutorial.findUnique.mockResolvedValue(
        fixtures.tutorial
      );
      prisma.developerJourneyTutorialQuestion.findMany.mockResolvedValue([]);

      const result = await getAllTutorialQuestions(tutorialId);

      expect(result).toEqual([]);
    });
  });

  describe("createTutorialQuestion", () => {
    test("should create a new tutorial question successfully", async () => {
      const mockReq = {
        body: {
          question_text: "New question",
          position: 1,
        },
        params: {
          tutorialId: "1",
        },
      };

      const createdQuestion = {
        id: 1,
        question_text: "New question",
        position: 1,
        tutorial_id: 1,
      };

      prisma.developerJourneyTutorial.findUnique.mockResolvedValue(
        fixtures.tutorial
      );
      prisma.developerJourneyTutorialQuestion.findFirst.mockResolvedValue(null);
      prisma.developerJourneyTutorialQuestion.create.mockResolvedValue(
        createdQuestion
      );

      const result = await createTutorialQuestion(mockReq);

      expect(prisma.developerJourneyTutorial.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(
        prisma.developerJourneyTutorialQuestion.findFirst
      ).toHaveBeenCalledWith({
        where: {
          question_text: "New question",
          position: 1,
          tutorial_id: 1,
        },
      });
      expect(
        prisma.developerJourneyTutorialQuestion.create
      ).toHaveBeenCalledWith({
        data: {
          question_text: "New question",
          position: 1,
          tutorial_id: 1,
        },
      });
      expect(result).toEqual(createdQuestion);
    });

    test("should throw NotFoundError when tutorial does not exist", async () => {
      const mockReq = {
        body: {
          question_text: "New question",
          position: 1,
        },
        params: {
          tutorialId: "999",
        },
      };

      prisma.developerJourneyTutorial.findUnique.mockResolvedValue(null);

      await expect(createTutorialQuestion(mockReq)).rejects.toThrow(
        NotFoundError
      );
      await expect(createTutorialQuestion(mockReq)).rejects.toThrow(
        "Tutorial not found"
      );
    });

    test("should throw BadRequestError when duplicate question exists", async () => {
      const mockReq = {
        body: {
          question_text: "Existing question",
          position: 1,
        },
        params: {
          tutorialId: "1",
        },
      };

      prisma.developerJourneyTutorial.findUnique.mockResolvedValue(
        fixtures.tutorial
      );
      prisma.developerJourneyTutorialQuestion.findFirst.mockResolvedValue(
        fixtures.tutorialQuestion
      );

      await expect(createTutorialQuestion(mockReq)).rejects.toThrow(
        BadRequestError
      );
      await expect(createTutorialQuestion(mockReq)).rejects.toThrow(
        "Tutorial question already exists"
      );
    });

    test("should handle database errors gracefully", async () => {
      const mockReq = {
        body: {
          question_text: "New question",
          position: 1,
        },
        params: {
          tutorialId: "1",
        },
      };

      const dbError = new Error("Database connection failed");
      prisma.developerJourneyTutorial.findUnique.mockRejectedValue(dbError);

      await expect(createTutorialQuestion(mockReq)).rejects.toThrow(dbError);
    });
  });

  describe("getTutorialQuestionById", () => {
    test("should return a tutorial question with options", async () => {
      const tutorialId = "1";
      const questionId = "1";

      prisma.developerJourneyTutorial.findUnique.mockResolvedValue(
        fixtures.tutorial
      );
      prisma.developerJourneyTutorialQuestion.findUnique.mockResolvedValue(
        fixtures.tutorialQuestionWithOptions
      );

      const result = await getTutorialQuestionById(tutorialId, questionId);

      expect(prisma.developerJourneyTutorial.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(
        prisma.developerJourneyTutorialQuestion.findUnique
      ).toHaveBeenCalledWith({
        where: {
          id: 1,
          tutorial_id: 1,
        },
        include: {
          options: {
            select: {
              option_label: true,
              option_text: true,
            },
          },
        },
      });
      expect(result).toEqual(fixtures.tutorialQuestionWithOptions);
    });

    test("should throw NotFoundError when tutorial does not exist", async () => {
      const tutorialId = "999";
      const questionId = "1";

      prisma.developerJourneyTutorial.findUnique.mockResolvedValue(null);

      await expect(
        getTutorialQuestionById(tutorialId, questionId)
      ).rejects.toThrow(NotFoundError);
      await expect(
        getTutorialQuestionById(tutorialId, questionId)
      ).rejects.toThrow("Tutorial not found");
    });

    test("should throw NotFoundError when question does not exist", async () => {
      const tutorialId = "1";
      const questionId = "999";

      prisma.developerJourneyTutorial.findUnique.mockResolvedValue(
        fixtures.tutorial
      );
      prisma.developerJourneyTutorialQuestion.findUnique.mockResolvedValue(
        null
      );

      await expect(
        getTutorialQuestionById(tutorialId, questionId)
      ).rejects.toThrow(NotFoundError);
      await expect(
        getTutorialQuestionById(tutorialId, questionId)
      ).rejects.toThrow("Question not found");
    });
  });

  describe("updateTutorialQuestion", () => {
    test("should update tutorial question successfully", async () => {
      const mockReq = {
        body: {
          question_text: "Updated question",
          position: 2,
        },
        params: {
          tutorialId: "1",
          questionId: "1",
        },
      };

      const updatedQuestion = {
        id: 1,
        question_text: "Updated question",
        position: 2,
        tutorial_id: 1,
      };

      prisma.developerJourneyTutorial.findUnique.mockResolvedValue(
        fixtures.tutorial
      );
      prisma.developerJourneyTutorialQuestion.findUnique.mockResolvedValue(
        fixtures.tutorialQuestion
      );
      prisma.developerJourneyTutorialQuestion.findFirst.mockResolvedValue(null);
      prisma.developerJourneyTutorialQuestion.update.mockResolvedValue(
        updatedQuestion
      );

      const result = await updateTutorialQuestion(mockReq);

      expect(
        prisma.developerJourneyTutorialQuestion.update
      ).toHaveBeenCalledWith({
        where: {
          id: 1,
          tutorial_id: 1,
        },
        data: {
          question_text: "Updated question",
          position: 2,
        },
      });
      expect(result).toEqual(updatedQuestion);
    });

    test("should throw NotFoundError when tutorial does not exist", async () => {
      const mockReq = {
        body: {
          question_text: "Updated question",
          position: 2,
        },
        params: {
          tutorialId: "999",
          questionId: "1",
        },
      };

      prisma.developerJourneyTutorial.findUnique.mockResolvedValue(null);

      await expect(updateTutorialQuestion(mockReq)).rejects.toThrow(
        NotFoundError
      );
      await expect(updateTutorialQuestion(mockReq)).rejects.toThrow(
        "Tutorial not found"
      );
    });

    test("should throw NotFoundError when question does not exist", async () => {
      const mockReq = {
        body: {
          question_text: "Updated question",
          position: 2,
        },
        params: {
          tutorialId: "1",
          questionId: "999",
        },
      };

      prisma.developerJourneyTutorial.findUnique.mockResolvedValue(
        fixtures.tutorial
      );
      prisma.developerJourneyTutorialQuestion.findUnique.mockResolvedValue(
        null
      );

      await expect(updateTutorialQuestion(mockReq)).rejects.toThrow(
        NotFoundError
      );
      await expect(updateTutorialQuestion(mockReq)).rejects.toThrow(
        "Tutorial question not found"
      );
    });

    test("should throw BadRequestError when updating to duplicate", async () => {
      const mockReq = {
        body: {
          question_text: "Duplicate question",
          position: 2,
        },
        params: {
          tutorialId: "1",
          questionId: "1",
        },
      };

      const duplicateQuestion = {
        id: 2,
        question_text: "Duplicate question",
        position: 2,
        tutorial_id: 1,
      };

      prisma.developerJourneyTutorial.findUnique.mockResolvedValue(
        fixtures.tutorial
      );
      prisma.developerJourneyTutorialQuestion.findUnique.mockResolvedValue(
        fixtures.tutorialQuestion
      );
      prisma.developerJourneyTutorialQuestion.findFirst.mockResolvedValue(
        duplicateQuestion
      );

      await expect(updateTutorialQuestion(mockReq)).rejects.toThrow(
        BadRequestError
      );
      await expect(updateTutorialQuestion(mockReq)).rejects.toThrow(
        "Tutorial question with this text and position already exists"
      );
    });

    test("should update only provided fields", async () => {
      const mockReq = {
        body: {
          position: 3,
        },
        params: {
          tutorialId: "1",
          questionId: "1",
        },
      };

      const updatedQuestion = {
        ...fixtures.tutorialQuestion,
        position: 3,
      };

      prisma.developerJourneyTutorial.findUnique.mockResolvedValue(
        fixtures.tutorial
      );
      prisma.developerJourneyTutorialQuestion.findUnique.mockResolvedValue(
        fixtures.tutorialQuestion
      );
      prisma.developerJourneyTutorialQuestion.findFirst.mockResolvedValue(null);
      prisma.developerJourneyTutorialQuestion.update.mockResolvedValue(
        updatedQuestion
      );

      const result = await updateTutorialQuestion(mockReq);

      expect(
        prisma.developerJourneyTutorialQuestion.update
      ).toHaveBeenCalledWith({
        where: {
          id: 1,
          tutorial_id: 1,
        },
        data: {
          position: 3,
        },
      });
      expect(result).toEqual(updatedQuestion);
    });
  });

  describe("destroyTutorialQuestion", () => {
    test("should delete tutorial question and its options", async () => {
      const mockReq = {
        params: {
          tutorialId: "1",
          questionId: "1",
        },
      };

      prisma.developerJourneyTutorial.findUnique.mockResolvedValue(
        fixtures.tutorial
      );
      prisma.developerJourneyTutorialQuestion.findUnique.mockResolvedValue(
        fixtures.tutorialQuestion
      );
      prisma.tutorialOption.deleteMany.mockResolvedValue({ count: 2 });
      prisma.developerJourneyTutorialQuestion.delete.mockResolvedValue(
        fixtures.tutorialQuestion
      );

      const result = await destroyTutorialQuestion(mockReq);

      expect(prisma.tutorialOption.deleteMany).toHaveBeenCalledWith({
        where: {
          question_id: 1,
        },
      });
      expect(
        prisma.developerJourneyTutorialQuestion.delete
      ).toHaveBeenCalledWith({
        where: {
          id: 1,
          tutorial_id: 1,
        },
      });
      expect(result).toEqual(fixtures.tutorialQuestion);
    });

    test("should throw NotFoundError when tutorial does not exist", async () => {
      const mockReq = {
        params: {
          tutorialId: "999",
          questionId: "1",
        },
      };

      prisma.developerJourneyTutorial.findUnique.mockResolvedValue(null);

      await expect(destroyTutorialQuestion(mockReq)).rejects.toThrow(
        NotFoundError
      );
      await expect(destroyTutorialQuestion(mockReq)).rejects.toThrow(
        "Tutorial not found"
      );
    });

    test("should throw NotFoundError when question does not exist", async () => {
      const mockReq = {
        params: {
          tutorialId: "1",
          questionId: "999",
        },
      };

      prisma.developerJourneyTutorial.findUnique.mockResolvedValue(
        fixtures.tutorial
      );
      prisma.developerJourneyTutorialQuestion.findUnique.mockResolvedValue(
        null
      );

      await expect(destroyTutorialQuestion(mockReq)).rejects.toThrow(
        NotFoundError
      );
      await expect(destroyTutorialQuestion(mockReq)).rejects.toThrow(
        "Question not found"
      );
    });

    test("should delete question even when it has no options", async () => {
      const mockReq = {
        params: {
          tutorialId: "1",
          questionId: "1",
        },
      };

      prisma.developerJourneyTutorial.findUnique.mockResolvedValue(
        fixtures.tutorial
      );
      prisma.developerJourneyTutorialQuestion.findUnique.mockResolvedValue(
        fixtures.tutorialQuestion
      );
      prisma.tutorialOption.deleteMany.mockResolvedValue({ count: 0 });
      prisma.developerJourneyTutorialQuestion.delete.mockResolvedValue(
        fixtures.tutorialQuestion
      );

      const result = await destroyTutorialQuestion(mockReq);

      expect(result).toEqual(fixtures.tutorialQuestion);
    });
  });
});
