const { PrismaClient } = require("@prisma/client");
const { NotFoundError, BadRequestError } = require("../../errors");

const prisma = new PrismaClient();

const getAllTutorialQuestionsOptions = async (req) => {
  const TutorialQuestions =
    await prisma.developerJourneyTutorialQuestion.findUnique({
      where: {
        id: parseInt(req.params.questionId),
      },
    });

  if (!TutorialQuestions) {
    throw new NotFoundError("Tutorial Questions not Found");
  }

  return await prisma.tutorialOption.findMany({
    where: {
      question_id: parseInt(req.params.questionId),
    },
  });
};

const createTutorialQuestionOption = async (req) => {
  try {
    const { option_label, option_text, is_correct } = req.body;

    const TutorialQuestions =
      await prisma.developerJourneyTutorialQuestion.findUnique({
        where: {
          id: parseInt(req.params.questionId),
        },
      });

    if (!TutorialQuestions) {
      throw new NotFoundError("Tutorial Questions not Found");
    }

    const exits = await prisma.tutorialOption.findFirst({
      where: {
        option_label,
        option_text,
        question_id: parseInt(req.params.questionId),
      },
    });

    if (exits) {
      throw new BadRequestError("Option already exists");
    }

    const result = await prisma.tutorialOption.create({
      data: {
        option_label,
        option_text,
        is_correct,
        question_id: parseInt(req.params.questionId),
      },
    });

    return result;
  } catch (error) {
    console.log("Error creating tutorial question option:", error);
    throw error;
  }
};

const updateTutorialQuestionOption = async (req) => {
  try {
    const { option_text, is_correct } = req.body;
    const TutorialQuestionsOption = await prisma.tutorialOption.findUnique({
      where: {
        id: parseInt(req.params.optionId),
      },
    });

    if (!TutorialQuestionsOption) {
      throw new NotFoundError("Tutorial Question Option not Found");
    }

    const exits = await prisma.tutorialOption.findFirst({
      where: {
        option_text,
        question_id: parseInt(req.params.questionId),
      },
    });

    if (exits) {
      throw new BadRequestError("Option already exists");
    }

    const result = await prisma.tutorialOption.update({
      where: {
        id: parseInt(req.params.optionId),
      },
      data: {
        option_text,
        is_correct,
      },
    });
    return result;
  } catch (error) {
    console.log("Error updating tutorial question option:", error);
    throw error;
  }
};

const deleteTutorialQuestionOption = async (req) => {
  try {
    const TutorialQuestionsOption = await prisma.tutorialOption.findUnique({
      where: {
        id: parseInt(req.params.optionId),
      },
    });
    if (!TutorialQuestionsOption) {
      throw new NotFoundError("Tutorial Question Option not Found");
    }
    const result = await prisma.tutorialOption.delete({
      where: {
        id: parseInt(req.params.optionId),
      },
    });
    return result;
  } catch (error) {
    console.log("Error deleting tutorial question option:", error);
    throw error;
  }
};

const getTutorialQuestionOption = async (req) => {
  const option = await prisma.tutorialOption.findUnique({
    where: {
      id: parseInt(req.params.optionId),
    },
  });

  if (!option) {
    throw new NotFoundError("Tutorial Question Option not Found");
  }

  return option;
};

module.exports = {
  getAllTutorialQuestionsOptions,
  getTutorialQuestionOption,
  createTutorialQuestionOption,
  updateTutorialQuestionOption,
  deleteTutorialQuestionOption,
};
