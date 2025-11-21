const { StatusCodes } = require('http-status-codes');

const { getAllDeveloperJourneyTutorials, createDeveloperJourneyTutorial } = require('../../services/prisma/developer_journey_tutorials')

const index = async (req, res, next) => {
    try {
        const result = await getAllDeveloperJourneyTutorials();
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


module.exports = {
    index,
    create,
    
}