const { PrismaClient } = require('@prisma/client');
const { BadRequestError, NotFoundError } = require('../../errors');

const prisma = new PrismaClient();

const getAllTutorialQuestions = async (tutorialId) => {
  const tutorial = await prisma.developerJourneyTutorial.findUnique({
    where: {
      id: parseInt(tutorialId)
    }
  });

  if (!tutorial) {
    throw new NotFoundError('Tutorial not found');
  }

  return await prisma.developerJourneyTutorialQuestion.findMany({
    where: {
      tutorial_id: parseInt(tutorialId)
    }
  });
};

const createTutorialQuestion = async (req) => {
  try {
    const { question_text, position } = req.body;
    const { tutorialId } = req.params;

    // Check if tutorial exists
    const tutorial = await prisma.developerJourneyTutorial.findUnique({
      where: {
        id: parseInt(tutorialId)
      }
    });

    if (!tutorial) {
      throw new NotFoundError('Tutorial not found');
    }

    // Check for duplicate question
    const existingQuestion = await prisma.developerJourneyTutorialQuestion.findFirst({
      where: {
        question_text,
        position,
        tutorial_id: parseInt(tutorialId)
      }
    });

    if (existingQuestion) {
      throw new BadRequestError('Tutorial question already exists');
    }

    const result = await prisma.developerJourneyTutorialQuestion.create({
      data: {
        question_text,
        position,
        tutorial_id: parseInt(tutorialId)
      }
    });

    return result;
  } catch (err) {
    console.log('Error creating developer journey tutorial question:', err);
    throw err;
  }
};

const getTutorialQuestionById = async (tutorialId, questionId) => {
  // Check if tutorial exists
  const tutorial = await prisma.developerJourneyTutorial.findUnique({
    where: {
      id: parseInt(tutorialId)
    }
  });

  if (!tutorial) {
    throw new NotFoundError('Tutorial not found');
  }

  // Get the question
  const question = await prisma.developerJourneyTutorialQuestion.findUnique({
    where: {
      id: parseInt(questionId),
      tutorial_id: parseInt(tutorialId)
    }
  });

  if (!question) {
    throw new NotFoundError('Question not found');
  }

  return question;
};

const updateTutorialQuestion = async (req) => {
  try {
    const { question_text, position } = req.body;
    const { tutorialId, questionId } = req.params;
    const tutorial = await prisma.developerJourneyTutorial.findUnique({
      where: {
        id: parseInt(tutorialId)
      }
    });
    if (!tutorial) {
      throw new NotFoundError('Tutorial not found');
    }

    const exist = await prisma.developerJourneyTutorialQuestion.findUnique({
      where: {
        id: parseInt(questionId),
        tutorial_id: parseInt(tutorialId)
      }
    });

    if (!exist) {
      throw new NotFoundError('Tutorial question not found');
    }

    if (question_text || position) {
      const existingDuplicate = await prisma.developerJourneyTutorialQuestion.findFirst({
        where: {
          question_text,
          position,
        }

      });

      if (existingDuplicate) {
        throw new BadRequestError('Tutorial question already exists');
      }
    }

    const result = await prisma.developerJourneyTutorialQuestion.update({
      where: {
        id: parseInt(questionId),
        tutorial_id: parseInt(tutorialId)
      },
      data: {
        question_text,
        position
      }
    });

    return {
      ...result,
      developer_journey_tutorial: tutorial.title
    }
  } catch (err) {
    console.log('Error updating developer journey tutorial question:', err);
    throw err;
  }
};

const destroyTutorialQuestion = async (req) => {
  const { tutorialId, questionId } = req.params;
  const tutorial = await prisma.developerJourneyTutorial.findUnique({
    where: {
      id: parseInt(tutorialId)
    }
  });
  if (!tutorial) {
    throw new NotFoundError('Tutorial not found');
  }
  const question = await prisma.developerJourneyTutorialQuestion.findUnique({
    where: {
      id: parseInt(questionId),
      tutorial_id: parseInt(tutorialId)
    }
  });
  if (!question) {
    throw new NotFoundError('Question not found');
  }
  const result = await prisma.developerJourneyTutorialQuestion.delete({
    where: {
      id: parseInt(questionId),
      tutorial_id: parseInt(tutorialId)
    }
  });
  return result;
};

module.exports = { getAllTutorialQuestions, createTutorialQuestion, getTutorialQuestionById, updateTutorialQuestion, destroyTutorialQuestion };
