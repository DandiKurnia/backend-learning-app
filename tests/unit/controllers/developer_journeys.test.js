const {
  index,
  create,
  find,
  update,
  destroy,
} = require("../../../src/api/developer_journeys/controller");
const JourneyService = require("../../../src/services/prisma/developer_journeys");
const {
  mockRequest,
  mockResponse,
  mockNext,
} = require("../../setup/test-helpers");
const { StatusCodes } = require("http-status-codes");

jest.mock("../../../src/services/prisma/developer_journeys");

describe("Developer Journeys Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    next = mockNext();
    jest.clearAllMocks();
  });

  describe("index", () => {
    test("should return all journeys", async () => {
      const mockJourneys = [{ id: 1, name: "Journey 1" }];
      JourneyService.getAllJourneys.mockResolvedValue(mockJourneys);

      await index(req, res, next);

      expect(JourneyService.getAllJourneys).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        data: mockJourneys,
        status: StatusCodes.OK,
        message: "Retrieved successfully",
      });
    });

    test("should handle errors", async () => {
      const error = new Error("Database error");
      JourneyService.getAllJourneys.mockRejectedValue(error);

      await index(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("create", () => {
    test("should create journey", async () => {
      const mockJourney = { id: 1, name: "New Journey" };
      JourneyService.createJourney.mockResolvedValue(mockJourney);

      await create(req, res, next);

      expect(JourneyService.createJourney).toHaveBeenCalledWith(req);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        data: mockJourney,
        status: StatusCodes.CREATED,
        message: "Created successfully",
      });
    });

    test("should handle errors", async () => {
      const error = new Error("Create failed");
      JourneyService.createJourney.mockRejectedValue(error);

      await create(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("find", () => {
    test("should return journey by id", async () => {
      const mockJourney = { id: 1, name: "Journey 1" };
      JourneyService.getOneJourney.mockResolvedValue(mockJourney);

      await find(req, res, next);

      expect(JourneyService.getOneJourney).toHaveBeenCalledWith(req);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        data: mockJourney,
        status: StatusCodes.OK,
        message: "Retrieved successfully",
      });
    });

    test("should handle errors", async () => {
      const error = new Error("Not found");
      JourneyService.getOneJourney.mockRejectedValue(error);

      await find(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("update", () => {
    test("should update journey", async () => {
      const mockJourney = { id: 1, name: "Updated Journey" };
      JourneyService.updateJourney.mockResolvedValue(mockJourney);

      await update(req, res, next);

      expect(JourneyService.updateJourney).toHaveBeenCalledWith(req);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        data: mockJourney,
        status: StatusCodes.OK,
        message: "Updated successfully",
      });
    });

    test("should handle errors", async () => {
      const error = new Error("Update failed");
      JourneyService.updateJourney.mockRejectedValue(error);

      await update(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("destroy", () => {
    test("should delete journey", async () => {
      const mockResult = { message: "Deleted" };
      JourneyService.deleteJourney.mockResolvedValue(mockResult);

      await destroy(req, res, next);

      expect(JourneyService.deleteJourney).toHaveBeenCalledWith(req);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        data: mockResult,
        status: StatusCodes.OK,
        message: "Deleted successfully",
      });
    });

    test("should handle errors", async () => {
      const error = new Error("Delete failed");
      JourneyService.deleteJourney.mockRejectedValue(error);

      await destroy(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
