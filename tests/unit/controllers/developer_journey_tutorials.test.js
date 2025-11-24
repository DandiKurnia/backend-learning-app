const {
  index,
  create,
  find,
  update,
  destroy,
} = require("../../../src/api/developer_journey_tutorials/controller");
const TutorialService = require("../../../src/services/prisma/developer_journey_tutorials");
const {
  mockRequest,
  mockResponse,
  mockNext,
} = require("../../setup/test-helpers");
const { StatusCodes } = require("http-status-codes");

jest.mock("../../../src/services/prisma/developer_journey_tutorials");

describe("Developer Journey Tutorials Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    next = mockNext();
    jest.clearAllMocks();
  });

  describe("index", () => {
    test("should return all tutorials", async () => {
      req.params = { developerJourneyId: "1" };
      const mockTutorials = [{ id: 1, title: "Tutorial 1" }];
      TutorialService.getAllDeveloperJourneyTutorials.mockResolvedValue(
        mockTutorials
      );

      await index(req, res, next);

      expect(
        TutorialService.getAllDeveloperJourneyTutorials
      ).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    });

    test("should handle errors", async () => {
      req.params = { developerJourneyId: "1" };
      const error = new Error("Database error");
      TutorialService.getAllDeveloperJourneyTutorials.mockRejectedValue(error);

      await index(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("create", () => {
    test("should create tutorial", async () => {
      const mockTutorial = { id: 1, title: "New Tutorial" };
      TutorialService.createDeveloperJourneyTutorial.mockResolvedValue(
        mockTutorial
      );

      await create(req, res, next);

      expect(
        TutorialService.createDeveloperJourneyTutorial
      ).toHaveBeenCalledWith(req);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
    });

    test("should handle errors", async () => {
      const error = new Error("Create failed");
      TutorialService.createDeveloperJourneyTutorial.mockRejectedValue(error);

      await create(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("find", () => {
    test("should return tutorial by id", async () => {
      req.params = { developerJourneyId: "1", tutorialId: "1" };
      const mockTutorial = { id: 1, title: "Tutorial 1" };
      TutorialService.getOneDeveloperJourneyTutorial.mockResolvedValue(
        mockTutorial
      );

      await find(req, res, next);

      expect(
        TutorialService.getOneDeveloperJourneyTutorial
      ).toHaveBeenCalledWith("1", "1");
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    });

    test("should handle errors", async () => {
      req.params = { developerJourneyId: "1", tutorialId: "1" };
      const error = new Error("Not found");
      TutorialService.getOneDeveloperJourneyTutorial.mockRejectedValue(error);

      await find(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("update", () => {
    test("should update tutorial", async () => {
      const mockTutorial = { id: 1, title: "Updated Tutorial" };
      TutorialService.updateDeveloperJourneyTutorial.mockResolvedValue(
        mockTutorial
      );

      await update(req, res, next);

      expect(
        TutorialService.updateDeveloperJourneyTutorial
      ).toHaveBeenCalledWith(req);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    });

    test("should handle errors", async () => {
      const error = new Error("Update failed");
      TutorialService.updateDeveloperJourneyTutorial.mockRejectedValue(error);

      await update(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("destroy", () => {
    test("should delete tutorial", async () => {
      req.params = { developerJourneyId: "1", tutorialId: "1" };
      const mockResult = { message: "Deleted" };
      TutorialService.deleteDeveloperJourneyTutorial.mockResolvedValue(
        mockResult
      );

      await destroy(req, res, next);

      expect(
        TutorialService.deleteDeveloperJourneyTutorial
      ).toHaveBeenCalledWith("1", "1");
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    });

    test("should handle errors", async () => {
      req.params = { developerJourneyId: "1", tutorialId: "1" };
      const error = new Error("Delete failed");
      TutorialService.deleteDeveloperJourneyTutorial.mockRejectedValue(error);

      await destroy(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
