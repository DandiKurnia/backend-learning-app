const { StatusCodes } = require("http-status-codes");
const {
    processLearningStyles,
    getLearningStyleByUser,
    getAllLearningStylesByPeriod,
    getLatestLearningStyleByUser
} = require("../../services/prisma/user_learning_styles");

/**
 * Manually trigger learning style processing for a specific period
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
const processManual = async (req, res, next) => {
    try {
        const { period } = req.body;

        if (!period) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusCodes.BAD_REQUEST,
                message: "Period is required"
            });
        }

        // Validate period format (YYYY-MM)
        const periodRegex = /^\d{4}-\d{2}$/;
        if (!periodRegex.test(period)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusCodes.BAD_REQUEST,
                message: "Invalid period format. Expected format: YYYY-MM"
            });
        }

        const result = await processLearningStyles(period);

        res.status(StatusCodes.OK).json({
            data: result,
            status: StatusCodes.OK,
            message: "Learning style processing completed"
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get learning style for the authenticated user
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
const getMyLearningStyle = async (req, res, next) => {
    try {
        // Get user ID from the authenticated user
        const userId = req.user.userId;
        const { period } = req.query;

        const learningStyle = await getLearningStyleByUser(userId, period);

        if (!learningStyle) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: StatusCodes.NOT_FOUND,
                message: "Learning style not found"
            });
        }

        res.status(StatusCodes.OK).json({
            data: learningStyle,
            status: StatusCodes.OK,
            message: "Learning style retrieved successfully"
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get the latest learning style for the authenticated user
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
const getMyLatestLearningStyle = async (req, res, next) => {
    try {
        // Get user ID from the authenticated user
        const userId = req.user.userId;

        const learningStyle = await getLatestLearningStyleByUser(userId);

        if (!learningStyle) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: StatusCodes.NOT_FOUND,
                message: "Learning style not found"
            });
        }

        res.status(StatusCodes.OK).json({
            data: learningStyle,
            status: StatusCodes.OK,
            message: "Latest learning style retrieved successfully"
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get learning style for a specific user (admin only)
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
const getUserLearningStyle = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { period } = req.query;

        if (!userId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusCodes.BAD_REQUEST,
                message: "User ID is required"
            });
        }

        const learningStyle = await getLearningStyleByUser(parseInt(userId), period);

        if (!learningStyle) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: StatusCodes.NOT_FOUND,
                message: "Learning style not found"
            });
        }

        res.status(StatusCodes.OK).json({
            data: learningStyle,
            status: StatusCodes.OK,
            message: "Learning style retrieved successfully"
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all learning styles for a specific period (admin only)
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
const getAllLearningStyles = async (req, res, next) => {
    try {
        const { period } = req.query;

        if (!period) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusCodes.BAD_REQUEST,
                message: "Period is required"
            });
        }

        // Validate period format (YYYY-MM)
        const periodRegex = /^\d{4}-\d{2}$/;
        if (!periodRegex.test(period)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusCodes.BAD_REQUEST,
                message: "Invalid period format. Expected format: YYYY-MM"
            });
        }

        const learningStyles = await getAllLearningStylesByPeriod(period);

        res.status(StatusCodes.OK).json({
            data: learningStyles,
            status: StatusCodes.OK,
            message: "Learning styles retrieved successfully"
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get the latest learning style for a specific user (admin only)
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
const getLatestUserLearningStyle = async (req, res, next) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusCodes.BAD_REQUEST,
                message: "User ID is required"
            });
        }

        const learningStyle = await getLatestLearningStyleByUser(parseInt(userId));

        if (!learningStyle) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: StatusCodes.NOT_FOUND,
                message: "Learning style not found"
            });
        }

        res.status(StatusCodes.OK).json({
            data: learningStyle,
            status: StatusCodes.OK,
            message: "Latest learning style retrieved successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    processManual,
    getMyLearningStyle,
    getMyLatestLearningStyle,
    getUserLearningStyle,
    getAllLearningStyles,
    getLatestUserLearningStyle
};