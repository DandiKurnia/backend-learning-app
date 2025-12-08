const { PrismaClient } = require("@prisma/client");
const { BadRequestError } = require("../../errors");

const prisma = new PrismaClient();

const createStudyDuration = async (req) => {
  try {
    const journeyId = parseInt(req.params.journeyId);
    const userId = req.user.userId;
    const { duration } = req.body;

    // Convert duration from seconds to minutes
    const durationInMinutes = Math.round(duration / 60);

    if (!durationInMinutes || durationInMinutes <= 0) {
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
          study_duration: durationInMinutes
        }
      });
    } else {
      return await prisma.developerJourneyCompletion.update({
        where: { id: record.id },
        data: {
          study_duration: record.study_duration + durationInMinutes,
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