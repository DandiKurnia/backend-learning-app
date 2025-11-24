// Mock Prisma for integration tests
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

const request = require("supertest");
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = require("../../../src/api/developer_journey_tutorial_questions/router");
const handleErrorMiddleware = require("../../../src/middlewares/handle-errors");
const { generateToken, fixtures } = require("../../setup/test-helpers");

// Create a test app
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api", router);
  app.use(handleErrorMiddleware);
  return app;
};

const prisma = new PrismaClient();

describe("Developer Journey Tutorial Questions API Integration Tests", () => {
  let app;
  let token;

  beforeAll(() => {
    app = createTestApp();
    token = generateToken();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/tutorials/:tutorialId/questions", () => {
    test("should return 401 without authentication", async () => {
      const response = await request(app).get("/api/tutorials/1/questions");

      expect(response.status).toBe(401);
    });

    test("should return all questions with valid authentication", async () => {
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

      const response = await request(app)
        .get("/api/tutorials/1/questions")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockQuestions);
      expect(response.body.status).toBe(200);
      expect(response.body.message).toBe("Data retrieved successfully");
    });

    test("should return 404 when tutorial not found", async () => {
      prisma.developerJourneyTutorial.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .get("/api/tutorials/999/questions")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
    });

    test("should return empty array when no questions exist", async () => {
      prisma.developerJourneyTutorial.findUnique.mockResolvedValue(
        fixtures.tutorial
      );
      prisma.developerJourneyTutorialQuestion.findMany.mockResolvedValue([]);

      const response = await request(app)
        .get("/api/tutorials/1/questions")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
    });
  });

  describe("POST /api/tutorials/:tutorialId/questions", () => {
    test("should return 401 without authentication", async () => {
      const response = await request(app)
        .post("/api/tutorials/1/questions")
        .send({
          question_text: "New question",
          position: 1,
        });

      expect(response.status).toBe(401);
    });

    test("should create question with valid data and authentication", async () => {
      const newQuestion = {
        question_text: "What is JavaScript?",
        position: 1,
      };

      const createdQuestion = {
        id: 1,
        ...newQuestion,
        tutorial_id: 1,
      };

      prisma.developerJourneyTutorial.findUnique.mockResolvedValue(
        fixtures.tutorial
      );
      prisma.developerJourneyTutorialQuestion.findFirst.mockResolvedValue(null);
      prisma.developerJourneyTutorialQuestion.create.mockResolvedValue(
        createdQuestion
      );

      const response = await request(app)
        .post("/api/tutorials/1/questions")
        .set("Authorization", `Bearer ${token}`)
        .send(newQuestion);

      expect(response.status).toBe(201);
      expect(response.body.data).toEqual(createdQuestion);
      expect(response.body.message).toBe("Data created successfully");
    });

    test("should return 400 with invalid data", async () => {
      const invalidData = {
        question_text: "Test",
        // Missing position
      };

      const response = await request(app)
        .post("/api/tutorials/1/questions")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidData);

      expect(response.status).toBe(400);
    });

    test("should return 400 when creating duplicate question", async () => {
      const duplicateQuestion = {
        question_text: "Existing question",
        position: 1,
      };

      prisma.developerJourneyTutorial.findUnique.mockResolvedValue(
        fixtures.tutorial
      );
      prisma.developerJourneyTutorialQuestion.findFirst.mockResolvedValue(
        fixtures.tutorialQuestion
      );

      const response = await request(app)
        .post("/api/tutorials/1/questions")
        .set("Authorization", `Bearer ${token}`)
        .send(duplicateQuestion);

      expect(response.status).toBe(400);
    });

    test("should return 404 when tutorial not found", async () => {
      prisma.developerJourneyTutorial.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post("/api/tutorials/999/questions")
        .set("Authorization", `Bearer ${token}`)
        .send({
          question_text: "Test question",
          position: 1,
        });

      expect(response.status).toBe(404);
    });
  });

  describe("GET /api/tutorials/:tutorialId/questions/:questionId", () => {
    test("should return 401 without authentication", async () => {
      const response = await request(app).get("/api/tutorials/1/questions/1");

      expect(response.status).toBe(401);
    });

    test("should return question with options", async () => {
      prisma.developerJourneyTutorial.findUnique.mockResolvedValue(
        fixtures.tutorial
      );
      prisma.developerJourneyTutorialQuestion.findUnique.mockResolvedValue(
        fixtures.tutorialQuestionWithOptions
      );

      const response = await request(app)
        .get("/api/tutorials/1/questions/1")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(fixtures.tutorialQuestionWithOptions);
      expect(response.body.data.options).toBeDefined();
    });

    test("should return 404 when question not found", async () => {
      prisma.developerJourneyTutorial.findUnique.mockResolvedValue(
        fixtures.tutorial
      );
      prisma.developerJourneyTutorialQuestion.findUnique.mockResolvedValue(
        null
      );

      const response = await request(app)
        .get("/api/tutorials/1/questions/999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe("PUT /api/tutorials/:tutorialId/questions/:questionId", () => {
    test("should return 401 without authentication", async () => {
      const response = await request(app)
        .put("/api/tutorials/1/questions/1")
        .send({
          question_text: "Updated question",
          position: 2,
        });

      expect(response.status).toBe(401);
    });

    test("should update question with valid data", async () => {
      const updateData = {
        question_text: "Updated question",
        position: 2,
      };

      const updatedQuestion = {
        id: 1,
        ...updateData,
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

      const response = await request(app)
        .put("/api/tutorials/1/questions/1")
        .set("Authorization", `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(updatedQuestion);
      expect(response.body.message).toBe("Data updated successfully");
    });

    test("should return 400 with invalid data", async () => {
      const invalidData = {
        question_text: "Test",
        // Missing position
      };

      const response = await request(app)
        .put("/api/tutorials/1/questions/1")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidData);

      expect(response.status).toBe(400);
    });

    test("should return 404 when question not found", async () => {
      prisma.developerJourneyTutorial.findUnique.mockResolvedValue(
        fixtures.tutorial
      );
      prisma.developerJourneyTutorialQuestion.findUnique.mockResolvedValue(
        null
      );

      const response = await request(app)
        .put("/api/tutorials/1/questions/999")
        .set("Authorization", `Bearer ${token}`)
        .send({
          question_text: "Test",
          position: 1,
        });

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /api/tutorials/:tutorialId/questions/:questionId", () => {
    test("should return 401 without authentication", async () => {
      const response = await request(app).delete(
        "/api/tutorials/1/questions/1"
      );

      expect(response.status).toBe(401);
    });

    test("should delete question successfully", async () => {
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

      const response = await request(app)
        .delete("/api/tutorials/1/questions/1")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(fixtures.tutorialQuestion);
      expect(response.body.message).toBe("Data deleted successfully");
    });

    test("should return 404 when question not found", async () => {
      prisma.developerJourneyTutorial.findUnique.mockResolvedValue(
        fixtures.tutorial
      );
      prisma.developerJourneyTutorialQuestion.findUnique.mockResolvedValue(
        null
      );

      const response = await request(app)
        .delete("/api/tutorials/1/questions/999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe("Authentication Edge Cases", () => {
    test("should reject request with malformed token", async () => {
      const response = await request(app)
        .get("/api/tutorials/1/questions")
        .set("Authorization", "Bearer invalid.token");

      expect(response.status).toBe(401);
    });

    test("should reject request without Bearer prefix", async () => {
      const response = await request(app)
        .get("/api/tutorials/1/questions")
        .set("Authorization", token);

      expect(response.status).toBe(401);
    });
  });
});
