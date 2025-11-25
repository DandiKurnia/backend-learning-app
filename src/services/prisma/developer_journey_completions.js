const { PrismaClient } = require("@prisma/client");
const {BadRequestError } = require("../../errors");

const prisma = new PrismaClient();

const createStudyDuration = async (req) => {
  try {
      const journeyId = parseInt(req.params.journeyId);
  const userId = req.user.userId;
  const { duration } = req.body;

  if (!duration || duration <= 0) {
    throw new BadRequestError("Invalid duration");
  }

  // Check if user is enrolled in this journey
  const journey = await prisma.developerJourney.findUnique({
    where: { id: journeyId }
  });

  if (!journey) {
    throw new BadRequestError("Journey not found");
  }

  let record = await prisma.developerJourneyCompletion.findFirst({
    where: { journey_id: journeyId, user_id: userId }
  });

  if (!record) {
    return await prisma.developerJourneyCompletion.create({
      data: {
        journey_id: journeyId,
        user_id: userId,
        enrolling_times: 1,
        enrollments_at: new Date(),
        last_enrolled_at: new Date(),
        study_duration: duration
      }
    });
  } else {
    return await prisma.developerJourneyCompletion.update({
      where: { id: record.id },
      data: {
        study_duration: record.study_duration + duration,
        last_enrolled_at: new Date()
      }
    });
  }
  } catch (error) {
    console.error('Error creating study duration:', error);
    throw error;
  }

};

module.exports = { createStudyDuration };