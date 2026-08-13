const { User } = require('../Models')
const crypto = require('crypto')

/**
 * Middleware: Resolves anonymous device ID or auth token to MongoDB User document.
 * Checks x-device-id header, authorization header, or userId query/body param.
 * If user does not exist in DB, auto-creates a unique User record per device.
 */
exports.resolveUserSession = async (req, res, next) => {
    try {
        let deviceId = req.headers['x-device-id'] ||
                       req.headers['x-user-id'] ||
                       req.body?.userId ||
                       req.query?.userId

        if (!deviceId || deviceId === 'anon_default_device') {
            deviceId = `anon_${crypto.randomBytes(8).toString('hex')}`
        }

        let user = await User.findOne({
            $or: [
                { authProviderId: deviceId },
                { _id: (deviceId.length === 24 && /^[0-9a-fA-F]{24}$/.test(deviceId)) ? deviceId : null }
            ].filter(cond => Object.values(cond)[0] !== null)
        })

        if (!user) {
            const uniqueHash = crypto.createHash('md5').update(deviceId).digest('hex').slice(0, 8)
            user = await User.create({
                name: `Learner ${uniqueHash}`,
                displayName: `Learner ${uniqueHash}`,
                email: `device_${uniqueHash}@app.invictus`,
                authProvider: 'anonymous',
                authProviderId: deviceId,
                avatar: '⚡'
            }).catch(async (e) => {
                console.error('[AuthMiddleware] Error creating anonymous user:', e.message)
                return await User.findOne({ authProviderId: deviceId })
            })
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
