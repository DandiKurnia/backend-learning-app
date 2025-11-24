// Mock the service layer
jest.mock("../../../src/services/prisma/developer_journey_tutorial_questions");

const { StatusCodes } = require("http-status-codes");
const {
  index,
  create,
  find,
  update,
  destroy,
} = require("../../../src/api/developer_journey_tutorial_questions/controller");
const {
  getAllTutorialQuestions,
  createTutorialQuestion,
  getTutorialQuestionById,
  updateTutorialQuestion,
  destroyTutorialQuestion,
} = require("../../../src/services/prisma/developer_journey_tutorial_questions");
const {
  mockRequest,
  mockResponse,
  mockNext,
  fixtures,
} = require("../../setup/test-helpers");
const { NotFoundError, BadRequestError } = require("../../../src/errors");

describe("Developer Journey Tutorial Questions Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    next = mockNext();
    jest.clearAllMocks();
  });

  describe("index - Get All Tutorial Questions", () => {
    test("should return all tutorial questions successfully", async () => {
      const tutorialId = "1";
      const mockQuestions = [
        { ...fixtures.tutorialQuestion, id: 1 },
        { ...fixtures.tutorialQuestion, id: 2 },
      ];

      req.params = { tutorialId };
      getAllTutorialQuestions.mockResolvedValue(mockQuestions);

      await index(req, res, next);

      expect(getAllTutorialQuestions).toHaveBeenCalledWith(tutorialId);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        data: mockQuestions,
        status: StatusCodes.OK,
        message: "Data retrieved successfully",
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("should handle errors by calling next", async () => {
      const tutorialId = "999";
      const error = new NotFoundError("Tutorial not found");

      req.params = { tutorialId };
      getAllTutorialQuestions.mockRejectedValue(error);

      await index(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    test("should return empty array when no questions exist", async () => {
      const tutorialId = "1";

      req.params = { tutorialId };
      getAllTutorialQuestions.mockResolvedValue([]);

      await index(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        data: [],
        status: StatusCodes.OK,
        message: "Data retrieved successfully",
      });
    });
  });

  describe("create - Create Tutorial Question", () => {
    test("should create a new tutorial question successfully", async () => {
      const newQuestion = {
        question_text: "New question",
        position: 1,
      };
      const createdQuestion = {
        id: 1,
        ...newQuestion,
        tutorial_id: 1,
      };

      req.params = { tutorialId: "1" };
      req.body = newQuestion;
      createTutorialQuestion.mockResolvedValue(createdQuestion);

      await create(req, res, next);

      expect(createTutorialQuestion).toHaveBeenCalledWith(req);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        data: createdQuestion,
        status: StatusCodes.CREATED,
        message: "Data created successfully",
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("should handle NotFoundError when tutorial does not exist", async () => {
      const error = new NotFoundError("Tutorial not found");

      req.params = { tutorialId: "999" };
      req.body = { question_text: "Test", position: 1 };
      createTutorialQuestion.mockRejectedValue(error);

      await create(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
    });

    test("should handle BadRequestError for duplicate question", async () => {
      const error = new BadRequestError("Tutorial question already exists");

      req.params = { tutorialId: "1" };
      req.body = { question_text: "Duplicate", position: 1 };
      createTutorialQuestion.mockRejectedValue(error);

      await create(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe("find - Get Tutorial Question By ID", () => {
    test("should return a single tutorial question successfully", async () => {
      const tutorialId = "1";
      const questionId = "1";

      req.params = { tutorialId, questionId };
      getTutorialQuestionById.mockResolvedValue(
        fixtures.tutorialQuestionWithOptions
      );

      await find(req, res, next);

      expect(getTutorialQuestionById).toHaveBeenCalledWith(
        tutorialId,
        questionId
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        data: fixtures.tutorialQuestionWithOptions,
        status: StatusCodes.OK,
        message: "Data retrieved successfully",
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("should handle NotFoundError when question does not exist", async () => {
      const error = new NotFoundError("Question not found");

      req.params = { tutorialId: "1", questionId: "999" };
      getTutorialQuestionById.mockRejectedValue(error);

      await find(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
    });

    test("should handle NotFoundError when tutorial does not exist", async () => {
      const error = new NotFoundError("Tutorial not found");

      req.params = { tutorialId: "999", questionId: "1" };
      getTutorialQuestionById.mockRejectedValue(error);

      await find(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("update - Update Tutorial Question", () => {
    test("should update tutorial question successfully", async () => {
      const updateData = {
        question_text: "Updated question",
        position: 2,
      };
      const updatedQuestion = {
        id: 1,
        ...updateData,
        tutorial_id: 1,
      };

      req.params = { tutorialId: "1", questionId: "1" };
      req.body = updateData;
      updateTutorialQuestion.mockResolvedValue(updatedQuestion);

      await update(req, res, next);

      expect(updateTutorialQuestion).toHaveBeenCalledWith(req);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        data: updatedQuestion,
        status: StatusCodes.OK,
        message: "Data updated successfully",
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("should handle NotFoundError when question does not exist", async () => {
      const error = new NotFoundError("Tutorial question not found");

      req.params = { tutorialId: "1", questionId: "999" };
      req.body = { question_text: "Updated", position: 2 };
      updateTutorialQuestion.mockRejectedValue(error);

      await update(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
    });

    test("should handle BadRequestError for duplicate update", async () => {
      const error = new BadRequestError(
        "Tutorial question with this text and position already exists"
      );

      req.params = { tutorialId: "1", questionId: "1" };
      req.body = { question_text: "Duplicate", position: 1 };
      updateTutorialQuestion.mockRejectedValue(error);

      await update(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    test("should update with partial data", async () => {
      const partialUpdate = { position: 3 };
      const updatedQuestion = {
        ...fixtures.tutorialQuestion,
        position: 3,
      };

      req.params = { tutorialId: "1", questionId: "1" };
      req.body = partialUpdate;
      updateTutorialQuestion.mockResolvedValue(updatedQuestion);

      await update(req, res, next);

      expect(updateTutorialQuestion).toHaveBeenCalledWith(req);
      expect(res.json).toHaveBeenCalledWith({
        data: updatedQuestion,
        status: StatusCodes.OK,
        message: "Data updated successfully",
      });
    });
  });

  describe("destroy - Delete Tutorial Question", () => {
    test("should delete tutorial question successfully", async () => {
      req.params = { tutorialId: "1", questionId: "1" };
      destroyTutorialQuestion.mockResolvedValue(fixtures.tutorialQuestion);

      await destroy(req, res, next);

      expect(destroyTutorialQuestion).toHaveBeenCalledWith(req);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        data: fixtures.tutorialQuestion,
        status: StatusCodes.OK,
        message: "Data deleted successfully",
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("should handle NotFoundError when question does not exist", async () => {
      const error = new NotFoundError("Question not found");

      req.params = { tutorialId: "1", questionId: "999" };
      destroyTutorialQuestion.mockRejectedValue(error);

      await destroy(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
    });

    test("should handle NotFoundError when tutorial does not exist", async () => {
      const error = new NotFoundError("Tutorial not found");

      req.params = { tutorialId: "999", questionId: "1" };
      destroyTutorialQuestion.mockRejectedValue(error);

      await destroy(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    test("should handle database errors", async () => {
      const error = new Error("Database error");

      req.params = { tutorialId: "1", questionId: "1" };
      destroyTutorialQuestion.mockRejectedValue(error);

      await destroy(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("Error Handling", () => {
    test("all controller methods should pass errors to next middleware", async () => {
      const error = new Error("Unexpected error");
      req.params = { tutorialId: "1" };

      // Test index
      getAllTutorialQuestions.mockRejectedValue(error);
      await index(req, res, next);
      expect(next).toHaveBeenCalledWith(error);

      jest.clearAllMocks();

      // Test create
      req.body = { question_text: "Test", position: 1 };
      createTutorialQuestion.mockRejectedValue(error);
      await create(req, res, next);
      expect(next).toHaveBeenCalledWith(error);

      jest.clearAllMocks();

      // Test find
      req.params.questionId = "1";
      getTutorialQuestionById.mockRejectedValue(error);
      await find(req, res, next);
      expect(next).toHaveBeenCalledWith(error);

      jest.clearAllMocks();

      // Test update
      updateTutorialQuestion.mockRejectedValue(error);
      await update(req, res, next);
      expect(next).toHaveBeenCalledWith(error);

      jest.clearAllMocks();

      // Test destroy
      destroyTutorialQuestion.mockRejectedValue(error);
      await destroy(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
