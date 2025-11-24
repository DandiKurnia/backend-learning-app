const {
  index,
  create,
  update,
  destroy,
} = require("../../../src/api/tutorial_questions_options/controller");
const OptionsService = require("../../../src/services/prisma/tutorial_questions_options");
const {
  mockRequest,
  mockResponse,
  mockNext,
} = require("../../setup/test-helpers");
const { StatusCodes } = require("http-status-codes");

jest.mock("../../../src/services/prisma/tutorial_questions_options");

describe("Tutorial Questions Options Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    next = mockNext();
    jest.clearAllMocks();
  });

  describe("index", () => {
    test("should return all options", async () => {
      const mockOptions = [
        { id: 1, option_label: "A", option_text: "Option A" },
      ];
      OptionsService.getAllTutorialQuestionsOptions.mockResolvedValue(
        mockOptions
      );

      await index(req, res, next);

      expect(
        OptionsService.getAllTutorialQuestionsOptions
      ).toHaveBeenCalledWith(req);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        data: mockOptions,
        status: StatusCodes.OK,
        message: "Retrieved successfully",
      });
    });

    test("should handle errors", async () => {
      const error = new Error("Database error");
      OptionsService.getAllTutorialQuestionsOptions.mockRejectedValue(error);

      await index(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("create", () => {
    test("should create option", async () => {
      const mockOption = {
        id: 1,
        option_label: "A",
        option_text: "New Option",
      };
      OptionsService.createTutorialQuestionOption.mockResolvedValue(mockOption);

      await create(req, res, next);

      expect(OptionsService.createTutorialQuestionOption).toHaveBeenCalledWith(
        req
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        data: mockOption,
        status: StatusCodes.CREATED,
        message: "Created successfully",
      });
    });

    test("should handle errors", async () => {
      const error = new Error("Create failed");
      OptionsService.createTutorialQuestionOption.mockRejectedValue(error);

      await create(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("update", () => {
    test("should update option", async () => {
      const mockOption = { id: 1, option_label: "A", option_text: "Updated" };
      OptionsService.updateTutorialQuestionOption.mockResolvedValue(mockOption);

      await update(req, res, next);

      expect(OptionsService.updateTutorialQuestionOption).toHaveBeenCalledWith(
        req
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        data: mockOption,
        status: StatusCodes.OK,
        message: "Updated successfully",
      });
    });

    test("should handle errors", async () => {
      const error = new Error("Update failed");
      OptionsService.updateTutorialQuestionOption.mockRejectedValue(error);

      await update(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("destroy", () => {
    test("should delete option", async () => {
      const mockResult = { message: "Deleted" };
      OptionsService.deleteTutorialQuestionOption.mockResolvedValue(mockResult);

      await destroy(req, res, next);

      expect(OptionsService.deleteTutorialQuestionOption).toHaveBeenCalledWith(
        req
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        data: mockResult,
        status: StatusCodes.OK,
        message: "Deleted successfully",
      });
    });

    test("should handle errors", async () => {
      const error = new Error("Delete failed");
      OptionsService.deleteTutorialQuestionOption.mockRejectedValue(error);

      await destroy(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
