const { StatusCodes } = require('http-status-codes')

const { getAllTutorialQuestions,
    createTutorialQuestion,
    getTutorialQuestionById,
    updateTutorialQuestion,
    destroyTutorialQuestion } = require('../../services/prisma/developer_journey_tutorial_questions')

const index = async (req, res, next) => {
    try {
        const { tutorialId } = req.params;
        const tutorialQuestions = await getAllTutorialQuestions(tutorialId);
        res.status(StatusCodes.OK).json({
            data: tutorialQuestions,
            status: StatusCodes.OK,
            message: 'Data retrieved successfully'
        })
    } catch (err) {
        next(err)
    }
}

const create = async (req, res, next) => {
    try {
        // Pass the entire req object to the service
        const result = await createTutorialQuestion(req);
        res.status(StatusCodes.CREATED).json({
            data: result,
            status: StatusCodes.CREATED,
            message: 'Data created successfully'
        })
    } catch (err) {
        next(err)
    }
}

const find = async (req, res, next) => {
    try {
        const { tutorialId, questionId } = req.params;
        const tutorialQuestion = await getTutorialQuestionById(tutorialId, questionId);
        res.status(StatusCodes.OK).json({
            data: tutorialQuestion,
            status: StatusCodes.OK,
            message: 'Data retrieved successfully'
        })
    } catch (err) {
        next(err)
    }
}

const update = async (req, res, next) => {
    try {
        const result = await updateTutorialQuestion(req);
        res.status(StatusCodes.OK).json({
            data: result,
            status: StatusCodes.OK,
            message: 'Data updated successfully'
        })
    } catch (err) {
        next(err)
    }
}

const destroy = async (req, res, next) => {
    try {
        const result = await destroyTutorialQuestion(req);
        res.status(StatusCodes.OK).json({
            data: result,
            status: StatusCodes.OK,
            message: 'Data deleted successfully'
        })
    } catch (err) {
        next(err)
    }
}


module.exports = { index, create, find, update, destroy}