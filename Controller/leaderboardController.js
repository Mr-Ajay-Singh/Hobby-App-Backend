const { UserSkill, UserHobby, User } = require('../Models')
const { sendResponse } = require('../Middleware/sendResponse')

// ─── In-Memory Leaderboard Cache (60 Seconds TTL) ───────────────────────────
const LEADERBOARD_CACHE = new Map()
const CACHE_TTL_MS = 60 * 1000 // 60 seconds cache TTL

function getCacheKey(type, userHobbyId, limit) {
    return `${type}_${userHobbyId || 'global'}_${limit}`
}

/**
 * Invalidate leaderboard cache when a user earns XP or updates progress
 */
exports.invalidateLeaderboardCache = () => {
    LEADERBOARD_CACHE.clear()
}

/**
 * GET /api/v1/leaderboard
 * Query params:
 *   - type: 'weekly' | 'alltime' (default: 'weekly')
 *   - userHobbyId: optional ObjectId string to filter by hobby
 *   - limit: number (default 20)
 */
exports.getLeaderboard = async (req, res) => {
    try {
        const userId = req.userId || req.user?._id || req.user?.uid || req.query?.userId || req.body?.userId
        const leaderboardType = req.query.type === 'alltime' ? 'alltime' : 'weekly'
        const userHobbyId = req.query.userHobbyId
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20))

        const cacheKey = getCacheKey(leaderboardType, userHobbyId, limit)
        const cached = LEADERBOARD_CACHE.get(cacheKey)

        let baseLeaderboardItems = []
        let isCacheHit = false

        if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
            // ⚡ CACHE HIT: Instant return without querying database!
            baseLeaderboardItems = cached.leaderboardItems
            isCacheHit = true
        } else {
            // 🐢 CACHE MISS: Execute Database Aggregation
            const queryFilter = {}
            if (userHobbyId) {
                queryFilter.userHobbyId = userHobbyId
            }

            const sortField = leaderboardType === 'alltime' ? { score: -1 } : { dailyXpEarned: -1, score: -1 }

            const allSkills = await UserSkill.find(queryFilter)
                .populate('userId', 'displayName email photoUrl avatar')
                .populate('userHobbyId')
                .sort(sortField)
                .lean()

            // Mock additional competitive users if database has few entries
            const mockCompetitors = [
                { displayName: 'Alex Rivera', score: 94, dailyXpEarned: 18, streakCount: 12, avatar: '⚡' },
                { displayName: 'Sarah Chen', score: 88, dailyXpEarned: 16, streakCount: 9, avatar: '🔥' },
                { displayName: 'David Miller', score: 82, dailyXpEarned: 14, streakCount: 7, avatar: '🎯' },
                { displayName: 'Elena Rostova', score: 76, dailyXpEarned: 12, streakCount: 5, avatar: '🌟' },
                { displayName: 'Marcus Vance', score: 70, dailyXpEarned: 10, streakCount: 4, avatar: '🚀' },
                { displayName: 'Priya Sharma', score: 65, dailyXpEarned: 8, streakCount: 3, avatar: '💎' },
                { displayName: 'Liam O\'Connor', score: 58, dailyXpEarned: 6, streakCount: 2, avatar: '🏆' }
            ]

            baseLeaderboardItems = allSkills.map((item, idx) => ({
                id: item._id.toString(),
                userId: item.userId?._id?.toString() || item.userId?.toString() || `user_${idx}`,
                displayName: item.userId?.displayName || item.userId?.email?.split('@')[0] || 'Learner',
                avatar: item.userId?.photoUrl || '👤',
                score: item.score || 0,
                dailyXpEarned: item.dailyXpEarned || 0,
                level: item.level || 'beginner',
                streakCount: item.streakCount || 3
            }))

            if (baseLeaderboardItems.length < 10) {
                mockCompetitors.forEach((mc, i) => {
                    baseLeaderboardItems.push({
                        id: `mock_${i}`,
                        userId: `mock_user_${i}`,
                        displayName: mc.displayName,
                        avatar: mc.avatar,
                        score: mc.score,
                        dailyXpEarned: mc.dailyXpEarned,
                        level: mc.score > 75 ? 'expert' : mc.score > 50 ? 'advanced' : 'intermediate',
                        streakCount: mc.streakCount
                    })
                })
            }

            baseLeaderboardItems.sort((a, b) => {
                if (leaderboardType === 'weekly') {
                    return (b.dailyXpEarned || b.score) - (a.dailyXpEarned || a.score)
                }
                return b.score - a.score
            })

            baseLeaderboardItems = baseLeaderboardItems.map((item, index) => ({
                ...item,
                rank: index + 1
            }))

            // Save result to cache
            LEADERBOARD_CACHE.set(cacheKey, {
                timestamp: Date.now(),
                leaderboardItems: baseLeaderboardItems
            })
        }

        // Dynamically attach requesting user's isCurrentUser flag
        const formattedItems = baseLeaderboardItems.map(item => ({
            ...item,
            isCurrentUser: item.userId === userId.toString()
        }))

        const podium = formattedItems.slice(0, 3)
        const rankings = formattedItems.slice(3, limit)

        let currentUserRank = formattedItems.find(item => item.isCurrentUser)

        if (!currentUserRank && formattedItems.length > 0) {
            currentUserRank = {
                id: 'me',
                userId,
                displayName: 'You (Learner)',
                avatar: '👤',
                score: 15,
                dailyXpEarned: 4,
                level: 'beginner',
                streakCount: 3,
                rank: formattedItems.length + 1,
                isCurrentUser: true
            }
        }

        let xpNeededToOvertake = 5
        if (currentUserRank && currentUserRank.rank > 1) {
            const userAhead = formattedItems[currentUserRank.rank - 2]
            if (userAhead) {
                const targetScore = leaderboardType === 'weekly' ? (userAhead.dailyXpEarned || userAhead.score) : userAhead.score
                const myScore = leaderboardType === 'weekly' ? (currentUserRank.dailyXpEarned || currentUserRank.score) : currentUserRank.score
                xpNeededToOvertake = Math.max(1, targetScore - myScore + 1)
            }
        }

        return sendResponse(res, 200, {
            success: true,
            type: leaderboardType,
            cached: isCacheHit,
            podium,
            rankings,
            currentUserRank: currentUserRank ? {
                ...currentUserRank,
                xpNeededToOvertake
            } : null
        })
    } catch (err) {
        console.error('[Leaderboard] Error in getLeaderboard:', err)
        return sendResponse(res, 500, { success: false, message: 'Failed to fetch leaderboard.', error: err.message })
    }
}
