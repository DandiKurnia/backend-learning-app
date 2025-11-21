const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { BadRequestError, UnauthenticatedError } = require('../../errors');

const prisma = new PrismaClient();

const generateAccessToken = (user) => {
    return jwt.sign(
        { 
            userId: user.id, 
            email: user.email,
            displayName: user.display_name
        },
        process.env.JWT_SECRET || 'fallback_secret_key',
        { expiresIn: '60m' }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { 
            userId: user.id, 
            email: user.email
        },
        process.env.REFRESH_TOKEN_SECRET || 'fallback_refresh_secret_key',
        { expiresIn: '7d' }
    );
};

const registerUser = async (req) => {
    try {
        const { display_name, name, email, password, phone, user_role } = req.body;
        
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        
        if (existingUser) {
            throw new BadRequestError('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await prisma.user.create({
            data: {
                display_name,
                name,
                email,
                password: hashedPassword,
                phone,
                user_role: parseInt(user_role)
            }
        });
        
        return {
            id: user.id,
            display_name: user.display_name,
            name: user.name,
            email: user.email,
            phone: user.phone,
            user_role: user.user_role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

const loginUser = async (req) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            throw new UnauthenticatedError('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthenticatedError('Invalid credentials');
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // === SIMPAN REFRESH TOKEN KE TABEL AUTHENTICATIONS ===
        await prisma.authentication.create({
            data: {
                token: refreshToken
            }
        });

        return {
            user: {
                id: user.id,
                display_name: user.display_name,
                name: user.name,
                email: user.email,
                phone: user.phone,
                user_role: user.user_role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
            accessToken,
            refreshToken
        };

    } catch (error) {
        console.error('Error logging in user:', error);
        throw error;
    }
};

const refreshAccessToken = async (req) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            throw new BadRequestError('Refresh token is required');
        }

        const storedToken = await prisma.authentication.findUnique({
            where: { token: refreshToken }
        });

        if (!storedToken) {
            throw new BadRequestError('Refresh token not registered');
        }

        let decoded;
        try {
            decoded = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET || 'fallback_refresh_secret_key'
            );
        } catch (err) {
            console.error('Error verifying refresh token:', err);
            throw new BadRequestError('Invalid refresh token');
        }

        // === CARI USER ===
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });

        if (!user) {
            throw new BadRequestError('Invalid refresh token');
        }
        const newAccessToken = generateAccessToken(user);

        return {
            accessToken: newAccessToken
        };

    } catch (error) {
        console.error('Error refreshing access token:', error);
        throw error;
    }
};

const deleteRefreshToken = async (req) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        throw new BadRequestError('Refresh token is required');
    }

    const tokenExists = await prisma.authentication.findUnique({
        where: { token: refreshToken }
    });

    if (!tokenExists) {
        throw new BadRequestError('Refresh token not found');
    }

    await prisma.authentication.delete({
        where: { token: refreshToken }
    });

    return { message: 'Refresh token deleted successfully' };
};



module.exports = { registerUser, loginUser, refreshAccessToken, deleteRefreshToken };
    
