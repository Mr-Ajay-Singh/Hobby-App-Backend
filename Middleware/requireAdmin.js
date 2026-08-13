// FIX #11 — Admin-only authorization middleware.
// Must be placed AFTER requireAuth in the middleware chain
// since it reads req.userRole which requireAuth sets.

const { sendResponse } = require('./sendResponse')

const requireAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return sendResponse(res, 403, {
            info: 'Admin access required. This endpoint mutates shared global data.'
        })
    }
    next()
}

module.exports = requireAdmin
