// FIX #13 — Per-user rate limiting using in-memory sliding window.
// Uses the existing CacheService (node-cache) for tracking.

const CacheService = require('../Service/CacheService')
const { sendResponse } = require('./sendResponse')

/**
 * Rate limiter middleware factory.
 *
 * @param {Object} options
 * @param {number} options.maxRequests — Max requests per window (default: 20)
 * @param {number} options.windowSeconds — Sliding window in seconds (default: 60)
 * @param {string} options.keyPrefix — Cache key prefix (default: 'rl')
 * @returns {Function} Express middleware
 */
const rateLimiter = ({ maxRequests = 20, windowSeconds = 60, keyPrefix = 'rl' } = {}) => {
    return (req, res, next) => {
        // Skip rate limiting if no authenticated user (auth middleware hasn't run)
        if (!req.userId) return next()

        const key = `${keyPrefix}:${req.userId}:${Math.floor(Date.now() / (windowSeconds * 1000))}`

        const currentCount = CacheService.get(key) || 0

        if (currentCount >= maxRequests) {
            return sendResponse(res, 429, {
                info: `Rate limit exceeded. Maximum ${maxRequests} requests per ${windowSeconds} seconds.`,
                retryAfterSeconds: windowSeconds
            })
        }

        // Increment counter
        CacheService.set(key, currentCount + 1, windowSeconds)

        // Set rate-limit headers
        res.setHeader('X-RateLimit-Limit', maxRequests)
        res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - currentCount - 1))
        res.setHeader('X-RateLimit-Reset', Math.ceil(Date.now() / 1000) + windowSeconds)

        next()
    }
}

module.exports = rateLimiter
