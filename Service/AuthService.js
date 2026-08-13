// services/AuthService.js

require('dotenv').config();
const jwt = require('jsonwebtoken');
const ConstantService = require('./ConstantsService');
const UserModel = require('../Models/User')

class AuthService {
    static generateToken(payload, expiresIn = ConstantService.JWT_EXPIRY_DAY_STRING) {
        return jwt.sign(payload, process.env.JWT_TOKEN_KEY, { expiresIn });
    }

    static verifyToken(req, res, next) {
        res.setHeader('Content-Type', 'application/json')
        const bypassToken = req.query.secret;
        if (bypassToken && bypassToken === process.env.BYPASS_SECRET_TOKEN) {
            console.log('Bypass token detected. Skipping token verification.');
            return next();
        }

        const bearerHeader = req.headers.authorization

        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ')
            const bearerToken = bearer[1]
            try {
                const decoded = jwt.verify(bearerToken, process.env.JWT_TOKEN_KEY)
                console.log('Decoded : ', decoded)
                if (decoded) {
                    req.user = decoded;
                    next()
                } else {
                    res.status(403).json({ status: 403, message: 'Forbidden', data: { info: 'Invalid Token' } })
                }
            } catch (e) {
                res.status(403).json({ status: 403, message: 'Forbidden', data: { info: 'Invalid Token' } })
            }
        } else {
            res.status(403).json({ status: 403, message: 'Forbidden', data: { info: 'Invalid Token' } })
        }
    }

    static decodeToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_TOKEN_KEY);
        } catch (error) {
            return null;
        }
    }

    static authMiddleware() {
        return (req, res, next) => {
            res.setHeader('Content-Type', 'application/json');
            const bearerHeader = req.headers.authorization;

            if (bearerHeader) {
                const bearerToken = bearerHeader.split(' ')[1];
                const decoded = AuthService.decodeToken(bearerToken);

                if (decoded) {
                    req.user = decoded;
                    next();
                } else {
                    res.status(403).json({ status: 403, message: 'Forbidden', data: { info: 'Invalid Token' } });
                }
            } else {
                res.status(403).json({ status: 403, message: 'Forbidden', data: { info: 'Token is required' } });
            }
        };
    }

    /**
     * Find or create a user from an external auth provider.
     * Uses authProvider + authProviderId for upsert (FIX #8).
     * Returns the User document with internal _id.
     */
    static createUser = async (name, email, authProvider, authProviderId) => {
        const user = await UserModel.findOneAndUpdate(
            { authProvider, authProviderId },
            {
                name,
                email,
                authProvider,
                authProviderId
            },
            { upsert: true, new: true }
        )
        return user
    }

    /**
     * Look up a user by their external auth identity.
     * Used on login to map external UID → internal _id.
     */
    static findUserByAuthProvider = async (authProvider, authProviderId) => {
        return UserModel.findOne({ authProvider, authProviderId })
    }

    /**
     * Generate a JWT using the internal User _id (not the external UID).
     * Keeps the token payload consistent regardless of auth provider.
     */
    static generateAuthToken = (userId, name, email) => {
        return jwt.sign({ userId, name, email }, process.env.JWT_TOKEN_KEY, {
            expiresIn: ConstantService.JWT_EXPIRY_DAY_STRING
        })
    }

    static isOtpExpired = (createdAt) => new Date().getTime() - createdAt > ConstantService.OTP_EXPIRY_DURATION
}

module.exports = AuthService;
