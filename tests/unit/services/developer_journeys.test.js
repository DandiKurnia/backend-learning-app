// Mock Prisma
const mockPrisma = {
  developerJourney: {
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
  getAllJourneys,
  createJourney,
  getOneJourney,
  updateJourney,
  deleteJourney,
} = require("../../../src/services/prisma/developer_journeys");
const { BadRequestError, NotFoundError } = require("../../../src/errors");

describe("Developer Journeys Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllJourneys", () => {
    test("should return all journeys", async () => {
      const mockJourneys = [
        { id: 1, name: "Journey 1" },
        { id: 2, name: "Journey 2" },
      ];

      mockPrisma.developerJourney.findMany.mockResolvedValue(mockJourneys);

      const result = await getAllJourneys();

      expect(mockPrisma.developerJourney.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockJourneys);
    });
  });

  describe("createJourney", () => {
    const requestData = {
      body: {
        name: "New Journey",
        summary: "Journey summary",
        point: 0,
        required_point: 100,
        xp: 0,
        required_xp: 500,
        status: 1,
        listed: 1,
        dead_line: new Date("2024-12-31"),
      },
    };

    test("should create new journey successfully", async () => {
      mockPrisma.developerJourney.findFirst.mockResolvedValue(null);
      mockPrisma.developerJourney.create.mockResolvedValue({
        id: 1,
        ...requestData.body,
      });

      const result = await createJourney(requestData);

      expect(mockPrisma.developerJourney.findFirst).toHaveBeenCalledWith({
        where: { name: requestData.body.name },
      });
      expect(mockPrisma.developerJourney.create).toHaveBeenCalled();
      expect(result.name).toBe(requestData.body.name);
    });

    test("should throw BadRequestError if journey already exists", async () => {
      mockPrisma.developerJourney.findFirst.mockResolvedValue({
        id: 1,
        name: "New Journey",
      });

      await expect(createJourney(requestData)).rejects.toThrow(BadRequestError);
      await expect(createJourney(requestData)).rejects.toThrow(
        "Journey already exists"
      );
    });
  });

  describe("getOneJourney", () => {
    test("should return journey with tutorials", async () => {
      const mockReq = { params: { id: "1" } };
      const mockJourney = {
        id: 1,
        name: "Journey 1",
        tutorials: [{ id: 1, title: "Tutorial 1" }],
      };

      mockPrisma.developerJourney.findUnique.mockResolvedValue(mockJourney);

      const result = await getOneJourney(mockReq);

      expect(mockPrisma.developerJourney.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          tutorials: {
            select: { id: true, title: true },
          },
        },
      });
      expect(result).toEqual(mockJourney);
    });

    test("should throw NotFoundError if journey not found", async () => {
      const mockReq = { params: { id: "999" } };
      mockPrisma.developerJourney.findUnique.mockResolvedValue(null);

      await expect(getOneJourney(mockReq)).rejects.toThrow(NotFoundError);
      await expect(getOneJourney(mockReq)).rejects.toThrow("Journey not found");
    });
  });

  describe("updateJourney", () => {
    const mockReq = {
      params: { id: "1" },
      body: { name: "Updated Journey" },
    };

    test("should update journey successfully", async () => {
      mockPrisma.developerJourney.findUnique.mockResolvedValue({
        id: 1,
        name: "Old Name",
      });
      mockPrisma.developerJourney.findFirst.mockResolvedValue(null);
      mockPrisma.developerJourney.update.mockResolvedValue({
        id: 1,
        name: "Updated Journey",
      });

      const result = await updateJourney(mockReq);

      expect(mockPrisma.developerJourney.update).toHaveBeenCalled();
      expect(result.name).toBe("Updated Journey");
    });

    test("should throw NotFoundError if journey does not exist", async () => {
      mockPrisma.developerJourney.findUnique.mockResolvedValue(null);

      await expect(updateJourney(mockReq)).rejects.toThrow(NotFoundError);
    });

    test("should throw BadRequestError if name already exists", async () => {
      mockPrisma.developerJourney.findUnique.mockResolvedValue({
        id: 1,
        name: "Old Name",
      });
      mockPrisma.developerJourney.findFirst.mockResolvedValue({
        id: 2,
        name: "Updated Journey",
      });

      await expect(updateJourney(mockReq)).rejects.toThrow(BadRequestError);
      await expect(updateJourney(mockReq)).rejects.toThrow(
        "Journey with this name already exists"
      );
    });
  });

  describe("deleteJourney", () => {
    test("should delete journey successfully", async () => {
      const mockReq = { params: { id: "1" } };
      mockPrisma.developerJourney.findUnique.mockResolvedValue({
        id: 1,
        name: "Journey",
      });
      mockPrisma.developerJourney.delete.mockResolvedValue({ id: 1 });

      const result = await deleteJourney(mockReq);

      expect(mockPrisma.developerJourney.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual({ id: 1 });
    });

    test("should throw NotFoundError if journey not found", async () => {
      const mockReq = { params: { id: "999" } };
      mockPrisma.developerJourney.findUnique.mockResolvedValue(null);

      await expect(deleteJourney(mockReq)).rejects.toThrow(NotFoundError);
    });
  });
});
