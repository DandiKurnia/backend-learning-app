const { StatusCodes } = require('http-status-codes');

const { 
  getAllDeveloperJourneyTutorials, 
  getOneDeveloperJourneyTutorial,
  createDeveloperJourneyTutorial,
  updateDeveloperJourneyTutorial,
  deleteDeveloperJourneyTutorial
} = require('../../services/prisma/developer_journey_tutorials')

const index = async (req, res, next) => {
    try {
        const { developerJourneyId } = req.params;
        const result = await getAllDeveloperJourneyTutorials(developerJourneyId);
        res.status(StatusCodes.OK).json({ 
            data: result,
            status: StatusCodes.OK,
            message: 'Data retrieved successfully'
        });
    } catch (err) {
        next(err);
    }
};

const find = async (req, res, next) => {
    try {
        const { developerJourneyId, tutorialId } = req.params;
        const result = await getOneDeveloperJourneyTutorial(developerJourneyId, tutorialId);
        res.status(StatusCodes.OK).json({ 
            data: result,
            status: StatusCodes.OK,
            message: 'Data retrieved successfully'
        });
    } catch (err) {
        next(err);
    }
};

const create = async (req, res, next)  => {
    try {
        const result = await createDeveloperJourneyTutorial(req);
        res.status(StatusCodes.CREATED).json({ 
            data: result,
            status: StatusCodes.CREATED,
            message: 'Created successfully'
        });
    } catch (err) {
        next(err); 
    }
};

const update = async (req, res, next) => {
    try {
        const result = await updateDeveloperJourneyTutorial(req);
        res.status(StatusCodes.OK).json({ 
            data: result,
            status: StatusCodes.OK,
            message: 'Updated successfully'
        });
    } catch (err) {
        next(err);
    }
};

const destroy = async (req, res, next) => {
    try {
        const { developerJourneyId, tutorialId } = req.params;
        const result = await deleteDeveloperJourneyTutorial(developerJourneyId, tutorialId);
        res.status(StatusCodes.OK).json({ 
            data: result,
            status: StatusCodes.OK,
            message: 'Deleted successfully'
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    index,
    find,
    create,
    update,
    destroy
}