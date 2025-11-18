const { PrismaClient } = require('@prisma/client');
const { BadRequestError, NotFoundError } = require('../../errors');

const prisma = new PrismaClient();

const getAllJourneys = async () => {
  try {
    return await prisma.developerJourney.findMany();
  } catch (error) {
    console.error('Error fetching developer journeys:', error);
    throw error;
  }
};

const createJourney = async (req) => {
  try {
    const {
      name,
      summary,
      point,
      required_point,
      xp,
      required_xp,
      status,
      listed,
      dead_line,
    } = req.body;

    // Check duplicate
    const exists = await prisma.developerJourney.findFirst({ where: { name } });
    if (exists) throw new BadRequestError('Journey already exists');

    // Create
    const result = await prisma.developerJourney.create({
      data: {
        name,
        summary,
        point,
        required_point,
        xp,
        required_xp,
        status,
        listed,
        dead_line,
      },
    });

    return result;
  } catch (error) {
    console.error('Error creating developer journey:', error);
    throw error;
  }
};

const getOneJourney = async (req) => {
  try {
    const id = parseInt(req.params.id);

    const result = await prisma.developerJourney.findUnique({ where: { id } });
    if (!result) throw new NotFoundError('Journey not found');

    return result;
  } catch (error) {
    console.error('Error fetching developer journey:', error);
    throw error;
  }
};

const updateJourney = async (req) => {
  try {
    const id = parseInt(req.params.id);
    const {
      name,
      summary,
      point,
      required_point,
      xp,
      required_xp,
      status,
      listed,
      dead_line,
    } = req.body;

    // Check if journey exists
    const existingJourney = await prisma.developerJourney.findUnique({
      where: { id },
    });

    if (!existingJourney) {
      throw new NotFoundError(`Journey with id not found : ${id}`);
    }

    // Check name duplicate (except itself)
    if (name) {
      const duplicate = await prisma.developerJourney.findFirst({
        where: {
          name,
          id: { not: id },
        },
      });

      if (duplicate) {
        throw new BadRequestError('Journey with this name already exists');
      }
    }

    // Update
    const result = await prisma.developerJourney.update({
      where: { id },
      data: {
        name,
        summary,
        point,
        required_point,
        xp,
        required_xp,
        status,
        listed,
        dead_line,
      },
    });

    return result;
  } catch (error) {
    console.error('Error updating developer journey:', error);
    throw error;
  }
};


const deleteJourney = async (req) => {
  try {
    const id = parseInt(req.params.id);

    // Ensure exists first
    const exists = await prisma.developerJourney.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundError(`Journey not found : ${id}`);
    }

    // Delete
    return await prisma.developerJourney.delete({
      where: { id },
    });
  } catch (error) {
    console.error('Error deleting developer journey:', error);
    throw error;
  }
};

module.exports = {
  getAllJourneys,
  createJourney,
  getOneJourney,
  updateJourney,
  deleteJourney,
};
