const { User } = require('../Models')
const AuthService = require('../Service/AuthService')
const { sendResponse } = require('../Middleware/sendResponse')

// ─── POST /api/auth/register ────────────────────────────────────────────────

/**
 * Register a new user.
 * Creates an internal User record and returns a JWT.
 *
 * Body: { name, email, authProvider?, authProviderId? }
 *
 * Note: authProvider/authProviderId are optional and stored for future Firebase integration.
 * For now, email acts as the unique identifier.
 */
exports.register = async (req, res) => {
    try {
        const { name, email, authProvider, authProviderId } = req.body

        if (!name || !email) {
            return sendResponse(res, 400, { info: 'name and email are required' })
        }

        // Check if user already exists by email
        const existing = await User.findOne({ email }).lean()
        if (existing) {
            return sendResponse(res, 409, { info: 'User with this email already exists. Please login.' })
        }

        // Create user (authProvider/authProviderId stored for future Firebase use)
        const user = await User.create({
            name,
            email,
            authProvider: authProvider || 'email',
            authProviderId: authProviderId || email
        })

        const token = AuthService.generateAuthToken(
            user._id.toString(),
            user.name,
            user.email
        )

        return sendResponse(res, 200, {
            info: 'Registration successful',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        console.error('[Auth] Register error:', error.message)
        return sendResponse(res, 500, { info: 'Registration failed' }, error)
    }
}

// ─── POST /api/auth/login ───────────────────────────────────────────────────

/**
 * Login an existing user by email.
 * Returns an internal JWT.
 *
 * Body: { email }
 */
exports.login = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return sendResponse(res, 400, { info: 'email is required' })
        }

        const user = await User.findOne({ email }).lean()

        if (!user) {
            return sendResponse(res, 404, { info: 'User not found. Please register first.' })
        }

        const token = AuthService.generateAuthToken(
            user._id.toString(),
            user.name,
            user.email
        )

        return sendResponse(res, 200, {
            info: 'Login successful',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        console.error('[Auth] Login error:', error.message)
        return sendResponse(res, 500, { info: 'Login failed' }, error)
    }
}

// ─── POST /api/auth/refresh ─────────────────────────────────────────────────

/**
 * Refresh an internal JWT.
 * Requires a valid (possibly near-expiry) internal JWT.
 */
exports.refresh = async (req, res) => {
    try {
        // req.userId is set by requireAuth middleware
        const user = await User.findById(req.userId).lean()

        if (!user) {
            return sendResponse(res, 404, { info: 'User not found' })
        }

        const token = AuthService.generateAuthToken(
            user._id.toString(),
            user.name,
            user.email
        )

        return sendResponse(res, 200, {
            info: 'Token refreshed',
            token
        })
    } catch (error) {
        console.error('[Auth] Refresh error:', error.message)
        return sendResponse(res, 500, { info: 'Token refresh failed' }, error)
    }
}

// ─── GET /api/auth/me ───────────────────────────────────────────────────────

/**
 * Get the current authenticated user's profile.
 */
exports.me = async (req, res) => {
    try {
        const user = await User.findById(req.userId).lean()

        if (!user) {
            return sendResponse(res, 404, { info: 'User not found' })
        }

        return sendResponse(res, 200, {
            info: 'Success',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        })
    } catch (error) {
        console.error('[Auth] Me error:', error.message)
        return sendResponse(res, 500, { info: 'Failed to fetch user profile' }, error)
    }
}

// ─── POST /api/auth/logout ──────────────────────────────────────────────────

/**
 * Logout. Since we use stateless JWTs, this is a no-op on the server side.
 * The mobile app should discard the token locally.
 */
exports.logout = async (req, res) => {
    return sendResponse(res, 200, { info: 'Logged out successfully' })
}
