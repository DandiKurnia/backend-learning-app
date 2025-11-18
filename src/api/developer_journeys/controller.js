const { StatusCodes } = require('http-status-codes');

const { getAllJourneys, createJourney, getOneJourney, updateJourney, deleteJourney } = require('../../services/prisma/developer_journeys');

const index = async (req, res, next) => {
    try {
        const result = await getAllJourneys();
        res.status(StatusCodes.OK).json({
            data: result,
            status: StatusCodes.OK,
            message: 'Retrieved successfully'
        })
    } catch (err) {
        next(err);
    }
}

const create = async (req, res, next) => {
    try {
        const result = await createJourney(req);
        res.status(StatusCodes.CREATED).json({
            data: result,
            status: StatusCodes.CREATED,
            message: 'Created successfully'
        })
    } catch (err) {
        next(err);
    }
}

const find = async (req, res, next) => {
    try {
        const result = await getOneJourney(req);
        res.status(StatusCodes.OK).json({
            data: result,
            status: StatusCodes.OK,
            message: 'Retrieved successfully'
        })
    } catch (err) {
        next(err);
    }
}

const update = async (req, res, next) => {
    try {
        const result = await updateJourney(req);
        res.status(StatusCodes.OK).json({
            data: result,
            status: StatusCodes.OK,
            message: 'Updated successfully'
        })
    } catch (err) {
        next(err);
    }
}

const destroy = async (req, res, next) => {
    try {
        const result = await deleteJourney(req);
        res.status(StatusCodes.OK).json({
            data: result,
            status: StatusCodes.OK,
            message: 'Deleted successfully'
        })
    } catch (err) {
        next(err);
    }
}

module.exports = { index, create, find, update, destroy  }
