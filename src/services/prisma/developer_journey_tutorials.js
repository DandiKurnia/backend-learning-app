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

  // Tambahkan nama developer journey ke setiap tutorial
  return result.map(tutorial => ({
    ...tutorial,
    developer_journey_name: tutorial.developerJourney.name,
    developer_journey_summary: tutorial.developerJourney.summary
  }));
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
      }
    }
  });

  if (!result) {
    throw new NotFoundError('Tutorial not found');
  }

  return {
    ...result,
    developer_journey_name: result.developerJourney.name,
    developer_journey_summary: result.developerJourney.summary
  };
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

        const result = await prisma.developerJourneyTutorial.update({
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
        const tutorialWithJourney = await prisma.developerJourneyTutorial.findUnique({
            where: {
                id: result.id
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

        return {
            ...tutorialWithJourney,
            developer_journey_name: tutorialWithJourney.developerJourney.name,
            developer_journey_summary: tutorialWithJourney.developerJourney.summary
        };
    } catch (error) {
        console.log('Error updating developer journey tutorial:', error);
        throw error;
    }
};

const deleteDeveloperJourneyTutorial = async (developerJourneyId, tutorialId) => {
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
  const tutorial = await prisma.developerJourneyTutorial.findUnique({
    where: {
      id: parseInt(tutorialId),
      developer_journey_id: parseInt(developerJourneyId)
    }
  });

  if (!tutorial) {
    throw new NotFoundError('Tutorial not found');
  }

  // Delete the tutorial
  await prisma.developerJourneyTutorial.delete({
    where: {
      id: parseInt(tutorialId)
    }
  });

  return result;
};

module.exports = {
  getAllDeveloperJourneyTutorials,
  getOneDeveloperJourneyTutorial,
  createDeveloperJourneyTutorial,
  updateDeveloperJourneyTutorial,
  deleteDeveloperJourneyTutorial,
}