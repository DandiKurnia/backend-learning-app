const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            throw new UnauthenticatedError('Authentication invalid');
        }
        
        const token = authHeader.split(' ')[1];
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
        
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            displayName: decoded.displayName
        };
        
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new UnauthenticatedError('Access token expired');
        }
        if (error.name === 'JsonWebTokenError') {
            throw new UnauthenticatedError('Invalid token');
        }
        throw new UnauthenticatedError('Authentication invalid');
    }
};

module.exports = auth;