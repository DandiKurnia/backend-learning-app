const { PrismaClient } = require('@prisma/client');
const { BadRequestError, NotFoundError } = require('../../errors');

const prisma = new PrismaClient();

const getAllDeveloperJourneyTutorials = async (developerJourneyId) => {
  // Check if the developer journey exists
  const developerJourney = await prisma.developerJourney.findUnique({
    where: {
      id: parseInt(developerJourneyId)
    }
  });

  if (!developerJourney) {
    throw new BadRequestError('Developer journey not found');
  }

  const result = await prisma.developerJourneyTutorial.findMany({
    where: {
      developer_journey_id: parseInt(developerJourneyId),
    },
    include: {
      developerJourney: {
        select: {
          name: true,
          summary: true
        }
      }
    }
  });

  return result
};

const getOneDeveloperJourneyTutorial = async (developerJourneyId, tutorialId) => {

  const developerJourney = await prisma.developerJourney.findUnique({
    where: {
      id: parseInt(developerJourneyId)
    }
  });

  if (!developerJourney) {
    throw new NotFoundError('Developer journey not found');
  }

  const result = await prisma.developerJourneyTutorial.findUnique({
    where: {
      id: parseInt(tutorialId),
      developer_journey_id: parseInt(developerJourneyId)
    },
    include: {
      developerJourney: {
        select: {
          name: true,
          summary: true
        }
      },
      questions: {
        select: {
          id: true,
          question_text: true,
          position: true
        }
      }
    }
  });

  if (!result) {
    throw new NotFoundError('Tutorial not found');
  }

  return result
};

const createDeveloperJourneyTutorial = async (req) => {
    try {
        const { title, position, status } = req.body;
        const { developerJourneyId } = req.params;

        const userId = req.user.userId;

        // Check if the developer journey exists
        const developerJourney = await prisma.developerJourney.findUnique({
            where: {
                id: parseInt(developerJourneyId)
            }
        });

        if (!developerJourney) {
            throw new NotFoundError('Developer journey not found');
        }

        const exists = await prisma.developerJourneyTutorial.findFirst({
            where: {
                developer_journey_id: parseInt(developerJourneyId),
                title,
                position
            },
        });
        if (exists) throw new BadRequestError('Tutorial already exists');

        const result = await prisma.developerJourneyTutorial.create({
            data: {
                developer_journey_id: parseInt(developerJourneyId),
                title,
                position: parseInt(position),
                status,
                author_id: userId
            },
        })
        return result;
    } catch (error) {
        console.log('Error creating developer journey tutorial:', error)
        throw error
    }
};

const updateDeveloperJourneyTutorial = async (req) => {
    try {
        const { title, position, status } = req.body;
        const { developerJourneyId, tutorialId } = req.params;

        // Check if the developer journey exists
        const developerJourney = await prisma.developerJourney.findUnique({
            where: {
                id: parseInt(developerJourneyId)
            }
        });

        if (!developerJourney) {
            throw new BadRequestError('Developer journey not found');
        }

        // Check if the tutorial exists and belongs to the developer journey
        const existingTutorial = await prisma.developerJourneyTutorial.findUnique({
            where: {
                id: parseInt(tutorialId),
                developer_journey_id: parseInt(developerJourneyId)
            }
        });

        if (!existingTutorial) {
            throw new NotFoundError('Tutorial not found');
        }

        // Check if updating to a duplicate tutorial
        if (title || position) {
            const existingDuplicate = await prisma.developerJourneyTutorial.findFirst({
                where: {
                    developer_journey_id: parseInt(developerJourneyId),
                    title: title || existingTutorial.title,
                    position: position !== undefined ? parseInt(position) : existingTutorial.position,
                    id: {
                        not: parseInt(tutorialId)
                    }
                },
            });
            
            if (existingDuplicate) {
                throw new BadRequestError('Tutorial with this title and position already exists');
            }
        }

        const tutorialWithJourney = await prisma.developerJourneyTutorial.update({
            where: {
                id: parseInt(tutorialId)
            },
            data: {
                title: title || existingTutorial.title,
                position: position !== undefined ? parseInt(position) : existingTutorial.position,
                status: status || existingTutorial.status
            },
        });

        // Include developer journey information
        const result = await prisma.developerJourneyTutorial.findUnique({
            where: {
                id: tutorialWithJourney.id
            },
            include: {
                developerJourney: {
                    select: {
                        name: true,
                        summary: true
                    }
                },
                questions: {
                    select: {
                        id: true,
                        question_text: true,
                        position: true
                    }
                }
            }
        });

        return result
    } catch (error) {
        console.log('Error updating developer journey tutorial:', error);
        throw error;
    }
};

const deleteDeveloperJourneyTutorial = async (developerJourneyId, tutorialId) => {
  try {
      const developerJourney = await prisma.developerJourney.findUnique({
    where: {
      id: parseInt(developerJourneyId)
    }
  });

  if (!developerJourney) {
    throw new BadRequestError('Developer journey not found');
  }

  const tutorial = await prisma.developerJourneyTutorial.findUnique({
    where: {
      id: parseInt(tutorialId),
      developer_journey_id: parseInt(developerJourneyId)
    }
  });

  if (!tutorial) {
    throw new NotFoundError('Tutorial not found');
  }

  await prisma.developerJourneyTutorialQuestion.deleteMany({
    where: {
      tutorial_id: parseInt(tutorialId)
    }
  });

  await prisma.developerJourneyTutorial.delete({
    where: {
      id: parseInt(tutorialId)
    }
  });

  return tutorial;
  } catch (error) {
    console.log('Error deleting developer journey tutorial:', error);
    throw error;
  }

};

module.exports = {
  getAllDeveloperJourneyTutorials,
  getOneDeveloperJourneyTutorial,
  createDeveloperJourneyTutorial,
  updateDeveloperJourneyTutorial,
  deleteDeveloperJourneyTutorial,
}