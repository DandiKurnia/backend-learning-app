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
    }, include: {
      options: {
        select: {
          option_label: true,
          option_text: true
        }
      }
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

    // Check if updating to a duplicate question (excluding current question)
    if (question_text || position) {
      const whereClause = {
        tutorial_id: parseInt(tutorialId),
        id: {
          not: parseInt(questionId)
        }
      };

      if (question_text) whereClause.question_text = question_text;
      if (position !== undefined) whereClause.position = position;

      const existingDuplicate = await prisma.developerJourneyTutorialQuestion.findFirst({
        where: whereClause
      });

      if (existingDuplicate) {
        throw new BadRequestError('Tutorial question with this text and position already exists');
      }
    }

    const updateData = {};
    if (question_text !== undefined) updateData.question_text = question_text;
    if (position !== undefined) updateData.position = position;

    const result = await prisma.developerJourneyTutorialQuestion.update({
      where: {
        id: parseInt(questionId),
        tutorial_id: parseInt(tutorialId)
      },
      data: updateData
    });

    return result;
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

  await prisma.tutorialOption.deleteMany({
    where: {
      question_id: parseInt(questionId)
    }
  });

  const result = await prisma.developerJourneyTutorialQuestion.delete({
    where: {
      id: parseInt(questionId),
      tutorial_id: parseInt(tutorialId)
    }
  });
  return result;
};

module.exports = { getAllTutorialQuestions, createTutorialQuestion, getTutorialQuestionById, updateTutorialQuestion, destroyTutorialQuestion };
