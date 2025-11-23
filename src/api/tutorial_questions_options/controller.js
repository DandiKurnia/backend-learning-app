const { StatusCodes } = require('http-status-codes');

const {
    getAllTutorialQuestionsOptions,
    createTutorialQuestionOption,
    updateTutorialQuestionOption,
    deleteTutorialQuestionOption,
    
} = require('../../services/prisma/tutorial_questions_options');

const index = async (req, res, next) => {
    try {
        const result = await getAllTutorialQuestionsOptions(req);
        res.status(StatusCodes.OK).json({
            data: result,
            status: StatusCodes.OK,
            message: 'Retrieved successfully'
        });
    } catch (error) {
        next(error);
    }
}

const create = async (req, res, next) => {
    try {
        const result = await createTutorialQuestionOption(req);
        res.status(StatusCodes.CREATED).json({
            data: result,
            status: StatusCodes.CREATED,
            message: 'Created successfully'
        });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const result = await updateTutorialQuestionOption(req);
        res.status(StatusCodes.OK).json({
            data: result,
            status: StatusCodes.OK,
            message: 'Updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

const destroy = async (req, res, next) => {
    try {
        
        const result = await deleteTutorialQuestionOption(req);
        res.status(StatusCodes.OK).json({
            data: result,
            status: StatusCodes.OK,
            message: 'Deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { index, create, update, destroy };
