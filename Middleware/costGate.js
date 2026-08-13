// FIX #13 — Per-user daily cost ceiling.
// Checks AIRequest.estimatedCost aggregation for the current day.
// On breach: sets req.degradeModelTier = true so the orchestrator
// uses a cheaper model tier rather than hard-blocking.

const { AIRequest } = require('../Models')
const { sendResponse } = require('./sendResponse')

// Default: $2.00 per user per day (adjust via env or config)
const DEFAULT_DAILY_COST_CEILING = parseFloat(process.env.AI_DAILY_COST_CEILING || '2.00')

// Hard block threshold (e.g., 3x the soft ceiling)
const HARD_BLOCK_MULTIPLIER = 3

/**
 * Cost gate middleware.
 * Checks the user's daily AI spend and:
 * - Below ceiling: proceeds normally
 * - Above ceiling but below hard block: sets req.degradeModelTier = true
 * - Above hard block: returns 429
 *
 * Uses a 5-minute cache per user to avoid hammering the aggregation.
 */
const costGate = () => {
    const costCache = new Map()
    const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

    return async (req, res, next) => {
        if (!req.userId) return next()

        const userId = req.userId.toString()
        const now = Date.now()

        // Check cache first
        const cached = costCache.get(userId)
        if (cached && (now - cached.timestamp) < CACHE_TTL) {
            return applyGate(cached.totalCost, req, res, next)
        }

        try {
            // Aggregate today's cost
            const startOfDay = new Date()
            startOfDay.setHours(0, 0, 0, 0)

            const result = await AIRequest.aggregate([
                {
                    $match: {
                        userId: req.userId,
                        createdAt: { $gte: startOfDay }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalCost: { $sum: '$estimatedCost' },
                        requestCount: { $sum: 1 }
                    }
                }
            ])

            const totalCost = result.length > 0 ? result[0].totalCost : 0

            // Cache the result
            costCache.set(userId, { totalCost, timestamp: now })

            return applyGate(totalCost, req, res, next)
        } catch (error) {
            console.error('[CostGate] Aggregation error:', error.message)
            // Don't block on infrastructure failure
            next()
        }
    }

    function applyGate (totalCost, req, res, next) {
        const hardBlockCeiling = DEFAULT_DAILY_COST_CEILING * HARD_BLOCK_MULTIPLIER

        if (totalCost >= hardBlockCeiling) {
            return sendResponse(res, 429, {
                info: 'Daily AI usage limit reached. Please try again tomorrow.',
                dailyCost: totalCost.toFixed(4),
                ceiling: DEFAULT_DAILY_COST_CEILING.toFixed(4)
            })
        }

        if (totalCost >= DEFAULT_DAILY_COST_CEILING) {
            // Soft degradation — orchestrator will use cheaper models
            req.degradeModelTier = true
            console.log(`[CostGate] User ${req.userId} exceeded soft ceiling ($${totalCost.toFixed(4)}/$${DEFAULT_DAILY_COST_CEILING.toFixed(4)}), degrading model tier`)
        }

        next()
    }
}

module.exports = costGate
