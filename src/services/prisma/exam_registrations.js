const { PrismaClient } = require("@prisma/client");
const { NotFoundError } = require("../../errors");

const prisma = new PrismaClient();

const getAllExamRegistrationsService = async (req) => {
  const journeyTutorial = await prisma.developerJourneyTutorial.findUnique({
    where: { id: parseInt(req.params.tutorialId) },
  });

  if (!journeyTutorial) throw new NotFoundError("Journey Tutorial not found");

  const result = await prisma.examRegistration.findMany({
    where: { tutorial_id: journeyTutorial.id },
  });

  return result;
};

const registerExamService = async (tutorialId, userId) => {
  const tutorial = await prisma.developerJourneyTutorial.findUnique({
    where: { id: tutorialId },
  });

  if (!tutorial) throw new NotFoundError("Tutorial not found");

  // Check if there's an existing registration for this user and tutorial
  const existingRegistration = await prisma.examRegistration.findFirst({
    where: {
      tutorial_id: tutorialId,
      examinees_id: userId,
      deleted_at: null, // Only consider active registrations
    },
  });

  // If there's an existing registration, update its deleted_at column
  if (existingRegistration) {
    await prisma.examRegistration.update({
      where: { id: existingRegistration.id },
      data: {
        deleted_at: new Date(),
      },
    });
  }

  // Create a new exam registration
  const result = await prisma.examRegistration.create({
    data: {
      tutorial_id: tutorialId,
      examinees_id: userId,
      status: "ongoing",
      deadline_at: new Date(Date.now() + 30 * 60 * 1000), // 30 menit
    },
  });

  return result;
};

const submitBulkAnswersService = async (examId, answers) => {
  try {
    const results = [];

    const processAnswer = async (ans) => {
      const option = await prisma.tutorialOption.findUnique({
        where: { id: ans.option_id },
      });

      if (!option) {
        throw new NotFoundError(`Option with ID ${ans.option_id} not found`);
      }

      const existing = await prisma.examAnswer.findFirst({
        where: {
          exam_registration_id: examId,
          question_id: ans.question_id,
        },
      });

      if (existing) {
        return await prisma.examAnswer.update({
          where: { id: existing.id },
          data: {
            option_id: ans.option_id,
            is_correct: option.is_correct,
            updated_at: new Date(),
          },
        });
      } else {
        return await prisma.examAnswer.create({
          data: {
            exam_registration_id: examId,
            question_id: ans.question_id,
            option_id: ans.option_id,
            is_correct: option.is_correct,
          },
        });
      }
    };

    // Execute all updates
    for (const ans of answers) {
      const result = await processAnswer(ans);
      results.push(result);
    }

    return results;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const finishExamService = async (examId) => {
  const answers = await prisma.examAnswer.findMany({
    where: { exam_registration_id: examId },
  });

  const total = answers.length;
  const correct = answers.filter((a) => a.is_correct).length;
  const score = Math.round((correct / total) * 100);

  await prisma.examRegistration.update({
    where: { id: examId },
    data: {
      status: "finished",
      exam_finished_at: new Date(),
    },
  });

  return prisma.examResult.create({
    data: {
      exam_registration_id: examId,
      total_questions: total,
      score,
      is_passed: score >= 70,
    },
  });
};

module.exports = {
  getAllExamRegistrationsService,
  registerExamService,
  submitBulkAnswersService,
  finishExamService,
};
