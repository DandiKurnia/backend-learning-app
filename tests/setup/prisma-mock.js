/**
 * Mock Prisma Client for testing
 * This creates a mock implementation of PrismaClient that can be used in tests
 */

const mockPrismaClient = {
  developerJourneyTutorial: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },

  developerJourneyTutorialQuestion: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },

  tutorialOption: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },

  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

// Mock the PrismaClient constructor
jest.mock("@prisma/client", () => {
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

module.exports = mockPrismaClient;
