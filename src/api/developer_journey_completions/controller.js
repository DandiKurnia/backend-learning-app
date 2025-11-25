const { StatusCodes } = require("http-status-codes");

const { createStudyDuration } = require("../../services/prisma/developer_journey_completions");


const create = async (req, res, next) => {
    try {
        const result = await createStudyDuration(req);
        res.status(StatusCodes.CREATED).json({
            data: result,
            status: StatusCodes.CREATED,
            message: "Created successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { create };
