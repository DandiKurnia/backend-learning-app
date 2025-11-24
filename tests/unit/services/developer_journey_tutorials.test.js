// Mock Prisma
const mockPrisma = {
  developerJourney: {
    findUnique: jest.fn(),
  },
  developerJourneyTutorial: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  developerJourneyTutorialQuestion: {
    deleteMany: jest.fn(),
  },
};

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn(() => mockPrisma),
}));

const {
  getAllDeveloperJourneyTutorials,
  getOneDeveloperJourneyTutorial,
  createDeveloperJourneyTutorial,
  updateDeveloperJourneyTutorial,
  deleteDeveloperJourneyTutorial,
} = require("../../../src/services/prisma/developer_journey_tutorials");
const { BadRequestError, NotFoundError } = require("../../../src/errors");

describe("Developer Journey Tutorials Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllDeveloperJourneyTutorials", () => {
    test("should return all tutorials for a journey", async () => {
      mockPrisma.developerJourney.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.developerJourneyTutorial.findMany.mockResolvedValue([
        { id: 1, title: "Tutorial 1" },
      ]);

      const result = await getAllDeveloperJourneyTutorials("1");

      expect(result).toHaveLength(1);
    });

    test("should throw error if journey not found", async () => {
      mockPrisma.developerJourney.findUnique.mockResolvedValue(null);

      await expect(getAllDeveloperJourneyTutorials("999")).rejects.toThrow(
        BadRequestError
      );
    });
  });

  describe("getOneDeveloperJourneyTutorial", () => {
    test("should return tutorial with details", async () => {
      mockPrisma.developerJourney.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.developerJourneyTutorial.findUnique.mockResolvedValue({
        id: 1,
        title: "Tutorial 1",
      });

      const result = await getOneDeveloperJourneyTutorial("1", "1");

      expect(result).toHaveProperty("title");
    });

    test("should throw error if tutorial not found", async () => {
      mockPrisma.developerJourney.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.developerJourneyTutorial.findUnique.mockResolvedValue(null);

      await expect(getOneDeveloperJourneyTutorial("1", "999")).rejects.toThrow(
        NotFoundError
      );
    });
  });

  describe("createDeveloperJourneyTutorial", () => {
    const mockReq = {
      params: { developerJourneyId: "1" },
      body: { title: "New Tutorial", position: 1, status: "active" },
      user: { userId: 1 },
    };

    test("should create tutorial successfully", async () => {
      mockPrisma.developerJourney.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.developerJourneyTutorial.findFirst.mockResolvedValue(null);
      mockPrisma.developerJourneyTutorial.create.mockResolvedValue({
        id: 1,
        ...mockReq.body,
      });

      const result = await createDeveloperJourneyTutorial(mockReq);

      expect(result).toHaveProperty("title", "New Tutorial");
    });

    test("should throw error if journey not found", async () => {
      mockPrisma.developerJourney.findUnique.mockResolvedValue(null);

      await expect(createDeveloperJourneyTutorial(mockReq)).rejects.toThrow(
        NotFoundError
      );
    });

    test("should throw error if tutorial already exists", async () => {
      mockPrisma.developerJourney.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.developerJourneyTutorial.findFirst.mockResolvedValue({
        id: 1,
      });

      await expect(createDeveloperJourneyTutorial(mockReq)).rejects.toThrow(
        BadRequestError
      );
    });
  });

  describe("deleteDeveloperJourneyTutorial", () => {
    test("should delete tutorial and its questions", async () => {
      mockPrisma.developerJourney.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.developerJourneyTutorial.findUnique.mockResolvedValue({
        id: 1,
      });
      mockPrisma.developerJourneyTutorialQuestion.deleteMany.mockResolvedValue({
        count: 2,
      });
      mockPrisma.developerJourneyTutorial.delete.mockResolvedValue({ id: 1 });

      const result = await deleteDeveloperJourneyTutorial("1", "1");

      expect(
        mockPrisma.developerJourneyTutorialQuestion.deleteMany
      ).toHaveBeenCalled();
      expect(mockPrisma.developerJourneyTutorial.delete).toHaveBeenCalled();
      expect(result).toHaveProperty("id", 1);
    });
  });
});
