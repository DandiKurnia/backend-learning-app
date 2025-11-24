const { StatusCodes } = require("http-status-codes");

const {
  getAllExamRegistrationsService,
  registerExamService,
  submitBulkAnswersService,
  finishExamService,
} = require("../../services/prisma/exam_registrations");

const index = async (req, res, next) => {
  try {
    const result = await getAllExamRegistrationsService(req);
    res.status(StatusCodes.OK).json({
      data: result,
      status: StatusCodes.OK,
      message: "Retrieved successfully",
    });
  } catch (err) {
    next(err);
  }
};

const register = async (req, res, next) => {
  try {
    const result = await registerExamService(
      parseInt(req.params.tutorialId),
      req.user.userId
    );

    res.status(StatusCodes.CREATED).json({
      data: result,
      status: StatusCodes.CREATED,
      message: "Exam Started",
    });
  } catch (err) {
    next(err);
  }
};

const submitBulkAnswers = async (req, res, next) => {
  try {
    const result = await submitBulkAnswersService(
      parseInt(req.params.examId),
      req.body.answers
    );
    res.status(StatusCodes.CREATED).json({
      data: result,
      status: StatusCodes.CREATED,
      message: "Bulk Answers Saved",
    });
  } catch (err) {
    next(err);
  }
};

const finishExam = async (req, res, next) => {
  try {
    const result = await finishExamService(parseInt(req.params.examId));
    res.status(StatusCodes.OK).json({
      data: result,
      status: StatusCodes.OK,
      message: "Exam Finished",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  index,
  register,
  submitBulkAnswers,
  finishExam,
};
