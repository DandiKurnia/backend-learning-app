const { PrismaClient } = require('@prisma/client');
const { BadRequestError, NotFoundError } = require('../../errors');

const prisma = new PrismaClient();

const getAllDeveloperJourneyTutorials = async (developerJourneyId) => {
  const developerJourneyTutorials = await prisma.developerJourneyTutorial.findMany({
    where: {
      developerJourneyId,
    },
  });

  return developerJourneyTutorials;
};


const createDeveloperJourneyTutorial = async (req) => {
    try {
        const {
            developerJourneyId,
            title,
            position,
            status,
            authorId,
        } = req.body;

        const exists = await prisma.developerJourneyTutorial.findFirst({
            where: {
                developerJourneyId,
                title,
                positio
            },
        });
        if (exists) throw new BadRequestError('Tutorial already exists');

        const result = await prisma.developerJourneyTutorial.create({
            data: {
                developerJourneyId,
                title,
                position,
                status,
                authorId,
            },
        })
        return result;
    } catch (error) {
        console.log('Error creating developer journey tutorial:', error)
        throw error
    }
};

module.exports = {
  getAllDeveloperJourneyTutorials,
  createDeveloperJourneyTutorial,
}