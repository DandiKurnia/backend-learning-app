const request = require("supertest");
const { StatusCodes } = require("http-status-codes");
const { generateToken } = require("../../setup/test-helpers");

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

// Setup Express app
const express = require("express");
const app = express();
app.use(express.json());

const tutorialsRouter = require("../../../src/api/developer_journey_tutorials/router");
const auth = require("../../../src/middlewares/auth");
const errorHandlerMiddleware = require("../../../src/middlewares/handle-errors");
const notFoundMiddleware = require("../../../src/middlewares/not-found");

app.use("/api/journeys", tutorialsRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

describe("Developer Journey Tutorials API Integration Tests", () => {
  let token;

  beforeAll(() => {
    token = generateToken({ userId: 1, email: "test@test.com" });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/journeys/:developerJourneyId/tutorials", () => {
    test("should return 401 without authentication", async () => {
      const response = await request(app).get("/api/journeys/1/tutorials");

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    test("should return all tutorials with valid authentication", async () => {
      const mockTutorials = [
        { id: 1, title: "Tutorial 1", position: 1 },
        { id: 2, title: "Tutorial 2", position: 2 },
      ];

      mockPrisma.developerJourney.findUnique.mockResolvedValue({
        id: 1,
        name: "Journey 1",
      });
      mockPrisma.developerJourneyTutorial.findMany.mockResolvedValue(
        mockTutorials
      );

      const response = await request(app)
        .get("/api/journeys/1/tutorials")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.data).toEqual(mockTutorials);
    });

    test("should return 400 when journey not found", async () => {
      mockPrisma.developerJourney.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .get("/api/journeys/999/tutorials")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });

  describe("POST /api/journeys/:developerJourneyId/tutorials", () => {
    test("should return 401 without authentication", async () => {
      const response = await request(app)
        .post("/api/journeys/1/tutorials")
        .send({ title: "New Tutorial", position: 1, status: "active" });

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    test("should create tutorial with valid data and authentication", async () => {
      const tutorialData = {
        title: "New Tutorial",
        position: 1,
        status: "active",
      };

      mockPrisma.developerJourney.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.developerJourneyTutorial.findFirst.mockResolvedValue(null);
      mockPrisma.developerJourneyTutorial.create.mockResolvedValue({
        id: 1,
        ...tutorialData,
        developer_journey_id: 1,
      });

      const response = await request(app)
        .post("/api/journeys/1/tutorials")
        .set("Authorization", `Bearer ${token}`)
        .send(tutorialData);

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body.data).toHaveProperty("title", "New Tutorial");
    });

    test("should return 400 with invalid data", async () => {
      const response = await request(app)
        .post("/api/journeys/1/tutorials")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Test" }); // Missing position and status

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });

  describe("GET /api/journeys/:developerJourneyId/tutorials/:tutorialId", () => {
    test("should return 401 without authentication", async () => {
      const response = await request(app).get("/api/journeys/1/tutorials/1");

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    test("should return tutorial with details", async () => {
      const mockTutorial = {
        id: 1,
        title: "Tutorial 1",
        developerJourney: { name: "Journey", summary: "Summary" },
        questions: [],
      };

      mockPrisma.developerJourney.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.developerJourneyTutorial.findUnique.mockResolvedValue(
        mockTutorial
      );

      const response = await request(app)
        .get("/api/journeys/1/tutorials/1")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.data).toHaveProperty("title", "Tutorial 1");
    });

    test("should return 404 when tutorial not found", async () => {
      mockPrisma.developerJourney.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.developerJourneyTutorial.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .get("/api/journeys/1/tutorials/999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe("PUT /api/journeys/:developerJourneyId/tutorials/:tutorialId", () => {
    test("should return 401 without authentication", async () => {
      const response = await request(app)
        .put("/api/journeys/1/tutorials/1")
        .send({ title: "Updated" });

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    test("should update tutorial with valid data", async () => {
      const existingTutorial = {
        id: 1,
        title: "Old Title",
        position: 1,
        status: "active",
      };

      const updatedTutorial = {
        id: 1,
        title: "Updated Title",
        position: 1,
        status: "active",
        developerJourney: { name: "Journey", summary: "Summary" },
        questions: [],
      };

      mockPrisma.developerJourney.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.developerJourneyTutorial.findUnique
        .mockResolvedValueOnce(existingTutorial)
        .mockResolvedValueOnce(updatedTutorial);
      mockPrisma.developerJourneyTutorial.findFirst.mockResolvedValue(null);
      mockPrisma.developerJourneyTutorial.update.mockResolvedValue(
        updatedTutorial
      );

      const response = await request(app)
        .put("/api/journeys/1/tutorials/1")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Updated Title" });

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.data).toHaveProperty("title", "Updated Title");
    });

    test("should return 404 when tutorial not found", async () => {
      mockPrisma.developerJourney.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.developerJourneyTutorial.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .put("/api/journeys/1/tutorials/999")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Updated" });

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe("DELETE /api/journeys/:developerJourneyId/tutorials/:tutorialId", () => {
    test("should return 401 without authentication", async () => {
      const response = await request(app).delete("/api/journeys/1/tutorials/1");

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    test("should delete tutorial successfully", async () => {
      mockPrisma.developerJourney.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.developerJourneyTutorial.findUnique.mockResolvedValue({
        id: 1,
      });
      mockPrisma.developerJourneyTutorialQuestion.deleteMany.mockResolvedValue({
        count: 0,
      });
      mockPrisma.developerJourneyTutorial.delete.mockResolvedValue({ id: 1 });

      const response = await request(app)
        .delete("/api/journeys/1/tutorials/1")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(StatusCodes.OK);
    });

    test("should return 404 when tutorial not found", async () => {
      mockPrisma.developerJourney.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.developerJourneyTutorial.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .delete("/api/journeys/1/tutorials/999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });
});
