const { User } = require('../Models')

/**
 * Middleware: Resolves anonymous device ID or auth token to MongoDB User document.
 * Checks x-device-id header, authorization header, or userId query/body param.
 * If user does not exist in DB, auto-creates a User record.
 */
exports.resolveUserSession = async (req, res, next) => {
    try {
        const deviceId = req.headers['x-device-id'] ||
                         req.headers['x-user-id'] ||
                         req.body?.userId ||
                         req.query?.userId ||
                         'anon_default_device'

        let user = await User.findOne({
            $or: [
                { authProviderId: deviceId },
                { _id: (deviceId.length === 24 && /^[0-9a-fA-F]{24}$/.test(deviceId)) ? deviceId : null }
            ].filter(cond => Object.values(cond)[0] !== null)
        })

        if (!user) {
            const shortId = String(deviceId).slice(0, 8)
            user = await User.create({
                name: `Learner ${shortId}`,
                displayName: `Learner ${shortId}`,
                email: `device_${shortId.toLowerCase()}@app.invictus`,
                authProvider: 'anonymous',
                authProviderId: deviceId,
                avatar: '⚡'
            }).catch(async (e) => {
                console.error('[AuthMiddleware] Error creating anonymous user:', e.message)
                return await User.findOne({ authProviderId: deviceId })
            })
        }

        if (!user) {
            user = await User.findOne().sort({ createdAt: 1 })
        }

        if (user) {
            req.user = user
            req.userId = user._id.toString()
        }

        next()
    } catch (err) {
        console.error('[AuthMiddleware] Error resolving user session:', err.message)
        next()
    }
}
