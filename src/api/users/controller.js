const { StatusCodes } = require('http-status-codes');
const { registerUser, loginUser, refreshAccessToken, deleteRefreshToken } = require('../../services/prisma/users');

const register = async (req, res, next) => {
    try {
        const result = await registerUser(req);
        res.status(StatusCodes.CREATED).json({
            data: result,
            status: StatusCodes.CREATED
        });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const result = await loginUser(req);
        res.status(StatusCodes.CREATED).json({
            data: result,
            status: StatusCodes.CREATED
        });
    } catch (err) {
        next(err);
    }
};

const refresh = async (req, res, next) => {
    try {
        const result = await refreshAccessToken(req);
        res.status(StatusCodes.OK).json({
            data: result,
            status: StatusCodes.OK
        });
    } catch (err) {
        next(err);
    }
};

const logout = async (req, res, next) => {
    try {
        const result = await deleteRefreshToken(req);
        res.status(StatusCodes.OK).json({
            data: result,
            status: StatusCodes.OK
        });
    } catch (err) {
        next(err);
    }
};


module.exports = { register, login, refresh, logout };