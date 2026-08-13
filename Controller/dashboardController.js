const { UserHobby, UserSkill, PracticeSession } = require('../Models')
const { sendResponse } = require('../Middleware/sendResponse')

/**
 * GET /api/v1/dashboard
 * Fetches the unified dashboard summary for the user's home hub:
 * - Current Stage Stepper & Progress
 * - Main Goal & Target Date Countdown
 * - Weekly Practice Goal Tracker (Target vs Actual)
 * - Quick Stats (Total practice time, sessions completed, overall skill mastery average)
 */
exports.getDashboardSummary = async (req, res) => {
    try {
        const userId = req.userId || req.user?._id || req.user?.uid || req.query?.userId || req.body?.userId
        let { userHobbyId } = req.query

        // 1. Fetch UserHobby (or active default if userHobbyId not specified)
        let userHobby
        if (userHobbyId) {
            userHobby = await UserHobby.findOne({ _id: userHobbyId, userId }).populate('hobbyId', 'name slug capabilities')
        } else {
            userHobby = await UserHobby.findOne({ userId, status: 'active' })
                .sort({ updatedAt: -1 })
                .populate('hobbyId', 'name slug capabilities')
        }

        // Fallback: If no active hobby, look for any user hobby
        if (!userHobby) {
            userHobby = await UserHobby.findOne({ userId })
                .sort({ updatedAt: -1 })
                .populate('hobbyId', 'name slug capabilities')
        }

        if (!userHobby) {
            return sendResponse(res, 200, {
                success: true,
                hasActiveHobby: false,
                message: 'No user hobbies found. Start by choosing or enrolling in a hobby.',
                data: null
            })
        }

        userHobbyId = userHobby._id

        // 2. Stage Progress Calculation
        const allStages = ['onboarding', 'assessment', 'active_learning', 'review', 'completed']
        const currentStageIndex = allStages.indexOf(userHobby.currentStage)
        const validStageIndex = currentStageIndex >= 0 ? currentStageIndex : 0
        const progressPercentage = Math.round(((validStageIndex + 1) / allStages.length) * 100)

        const isOnboardingCompleted = userHobby.currentStage !== 'onboarding' && Boolean(userHobby.goal && userHobby.goal.trim().length > 0)
        const nextOnboardingStep = !isOnboardingCompleted
            ? 'Set Goal & Experience Level'
            : userHobby.currentStage === 'assessment'
            ? 'Complete Assessment Drill'
            : 'Active Learning'

        // 3. Target Date Countdown Calculation
        let daysRemaining = null
        if (userHobby.targetDate) {
            const diffTime = new Date(userHobby.targetDate).getTime() - Date.now()
            daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
        }

        // 4. Practice Stats & Weekly Goal Tracker Aggregation
        const startOfWeek = new Date()
        startOfWeek.setHours(0, 0, 0, 0)
        // Reset to start of week (Sunday)
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())

        const practiceStats = await PracticeSession.aggregate([
            { $match: { userHobbyId, status: 'completed' } },
            {
                $group: {
                    _id: null,
                    totalSeconds: { $sum: '$durationSeconds' },
                    totalSessions: { $sum: 1 },
                    secondsThisWeek: {
                        $sum: {
                            $cond: [{ $gte: ['$createdAt', startOfWeek] }, '$durationSeconds', 0]
                        }
                    }
                }
            }
        ])

        const totalSeconds = practiceStats[0]?.totalSeconds || 0
        const totalSessions = practiceStats[0]?.totalSessions || 0
        const secondsThisWeek = practiceStats[0]?.secondsThisWeek || 0

        const hobbyName = userHobby.hobbyId?.name || 'Hobby'
        const goal = userHobby.goal && userHobby.goal.trim().length > 0 ? userHobby.goal : `Learn & Master ${hobbyName}`
        const experienceLevel = userHobby.experienceLevel && userHobby.experienceLevel.trim().length > 0 ? userHobby.experienceLevel : 'beginner'
        const targetWeeklyMinutes = userHobby.weeklyPracticeMinutes > 0 ? userHobby.weeklyPracticeMinutes : 120

        const practicedThisWeekMinutes = Math.round(secondsThisWeek / 60)
        const weeklyProgressPercentage = targetWeeklyMinutes > 0
            ? Math.min(100, Math.round((practicedThisWeekMinutes / targetWeeklyMinutes) * 100))
            : 0

        // Format total practice time into human-readable text
        const totalMinutes = Math.round(totalSeconds / 60)
        const hours = Math.floor(totalMinutes / 60)
        const remainingMinutes = totalMinutes % 60
        const totalPracticeTimeFormatted = hours > 0
            ? `${hours} hr${hours > 1 ? 's' : ''} ${remainingMinutes} min${remainingMinutes !== 1 ? 's' : ''}`
            : `${remainingMinutes} min${remainingMinutes !== 1 ? 's' : ''}`

        // 5. Overall Skill Mastery Average Calculation
        const skillStats = await UserSkill.aggregate([
            { $match: { userHobbyId } },
            {
                $group: {
                    _id: null,
                    avgScore: { $avg: '$score' },
                    avgConfidence: { $avg: '$confidence' },
                    totalSkills: { $sum: 1 }
                }
            }
        ])

        const overallSkillMasteryScore = Math.round(skillStats[0]?.avgScore || 0)
        const averageConfidence = Number((skillStats[0]?.avgConfidence || 0).toFixed(2))
        const totalSkillsTracked = skillStats[0]?.totalSkills || 0

        // 6. Return Dashboard Response
        return sendResponse(res, 200, {
            success: true,
            hasActiveHobby: true,
            hobbyInfo: {
                userHobbyId: userHobby._id,
                hobbyId: userHobby.hobbyId?._id || userHobby.hobbyId,
                hobbyName,
                hobbySlug: userHobby.hobbyId?.slug || '',
                capabilities: userHobby.hobbyId?.capabilities || ['text'],
                status: userHobby.status
            },
            currentStage: {
                stage: userHobby.currentStage,
                allStages,
                stepNumber: validStageIndex + 1,
                totalSteps: allStages.length,
                progressPercentage,
                isOnboardingCompleted,
                nextOnboardingStep
            },
            goalAndTarget: {
                goal,
                experienceLevel,
                targetDate: userHobby.targetDate || null,
                daysRemaining
            },
            weeklyPracticeTracker: {
                targetWeeklyMinutes,
                practicedThisWeekMinutes,
                progressPercentage: weeklyProgressPercentage
            },
            quickStats: {
                totalPracticeTimeMinutes: totalMinutes,
                totalPracticeTimeFormatted,
                totalSessionsCompleted: totalSessions,
                overallSkillMasteryScore,
                averageConfidence,
                totalSkillsTracked
            }
        })
    } catch (error) {
        console.error('[DashboardController] Error fetching dashboard summary:', error)
        return sendResponse(res, 500, {
            success: false,
            message: 'Failed to fetch dashboard summary.',
            error: error.message
        })
    }
}

/**
 * POST /api/v1/dashboard/settings
 * Updates UserHobby onboarding goals, experience level, weekly target minutes, and target date.
 */
exports.updateHobbySettings = async (req, res) => {
    try {
        const userId = req.userId || req.user?._id || req.user?.uid || req.body?.userId || req.query?.userId
        const { userHobbyId, goal, experienceLevel, weeklyPracticeMinutes, targetDate, currentStage } = req.body

        let userHobby
        if (userHobbyId) {
            userHobby = await UserHobby.findOne({ _id: userHobbyId, userId })
        } else {
            userHobby = await UserHobby.findOne({ userId, status: 'active' }).sort({ updatedAt: -1 })
        }

        if (!userHobby) {
            return sendResponse(res, 404, { success: false, message: 'User hobby record not found.' })
        }

        if (goal !== undefined) userHobby.goal = String(goal).trim()
        if (experienceLevel !== undefined) userHobby.experienceLevel = String(experienceLevel).trim()
        if (weeklyPracticeMinutes !== undefined) userHobby.weeklyPracticeMinutes = Math.max(0, Number(weeklyPracticeMinutes) || 0)
        if (targetDate !== undefined) userHobby.targetDate = targetDate ? new Date(targetDate) : null
        
        if (currentStage !== undefined) {
            userHobby.currentStage = currentStage
        } else if (userHobby.currentStage === 'onboarding') {
            userHobby.currentStage = 'active_learning'
        }

        await userHobby.save()

        // Update User displayName & avatar if provided
        const { User } = require('../Models')
        const userUpdateData = {}
        if (req.body.displayName) userUpdateData.displayName = String(req.body.displayName).trim()
        if (req.body.avatar) userUpdateData.avatar = String(req.body.avatar).trim()
        if (Object.keys(userUpdateData).length > 0) {
            await User.findByIdAndUpdate(userId, userUpdateData).catch(() => {})
        }

        return sendResponse(res, 200, {
            success: true,
            message: 'Hobby settings & goal updated successfully.',
            userHobby
        })
    } catch (error) {
        console.error('[DashboardController] Error updating hobby settings:', error)
        return sendResponse(res, 500, {
            success: false,
            message: 'Failed to update hobby settings.',
            error: error.message
        })
    }
}

/**
 * GET /api/v1/dashboard/hobbies
 * Fetches all user hobbies for the user (to display in hobby switcher modal).
 */
exports.getUserHobbiesList = async (req, res) => {
    try {
        const userId = req.userId || req.user?._id || req.user?.uid || req.query?.userId || req.body?.userId
        const { Hobby } = require('../Models')

        const userHobbies = await UserHobby.find({ userId })
            .sort({ updatedAt: -1 })
            .populate('hobbyId', 'name slug capabilities category')
            .lean()

        // Also fetch global catalog of hobbies for discovery
        const catalogHobbies = await Hobby.find().limit(20).lean()

        return sendResponse(res, 200, {
            success: true,
            userHobbies,
            catalogHobbies
        })
    } catch (error) {
        console.error('[DashboardController] Error fetching user hobbies list:', error)
        return sendResponse(res, 500, {
            success: false,
            message: 'Failed to fetch user hobbies list.',
            error: error.message
        })
    }
}

/**
 * POST /api/v1/dashboard/enroll
 * Enrolls the user in a new hobby or creates a custom hobby.
 */
exports.enrollNewHobby = async (req, res) => {
    try {
        let userId = req.userId || req.user?._id || req.user?.uid || req.body?.userId || req.query?.userId
        const { Hobby, User } = require('../Models')

        if (!userId) {
            const deviceId = req.headers['x-device-id'] || `anon_${Date.now()}`
            let fallbackUser = await User.findOne({ authProviderId: deviceId })
            if (!fallbackUser) {
                const uniqueHash = `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`
                fallbackUser = await User.create({
                    name: 'Learner',
                    displayName: 'Learner',
                    email: `device_${uniqueHash}@app.invictus`,
                    authProvider: 'anonymous',
                    authProviderId: deviceId,
                    avatar: '⚡'
                })
            }
            userId = fallbackUser._id
            req.user = fallbackUser
            req.userId = fallbackUser._id.toString()
        }

        const { hobbyName, goal, experienceLevel, weeklyPracticeMinutes, targetDate } = req.body

        if (!hobbyName || typeof hobbyName !== 'string' || !hobbyName.trim()) {
            return sendResponse(res, 400, { success: false, message: 'hobbyName is required.' })
        }

        const trimmedName = hobbyName.trim()
        const slug = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

        // Find or create global Hobby document
        let hobby = await Hobby.findOne({ slug })
        if (!hobby) {
            hobby = await Hobby.create({
                name: trimmedName,
                slug,
                description: `Learn & master ${trimmedName}`,
                category: 'General',
                capabilities: ['text']
            })
        }

        // Upsert UserHobby enrollment
        let userHobby = await UserHobby.findOne({ userId, hobbyId: hobby._id })
        if (!userHobby) {
            userHobby = await UserHobby.create({
                userId,
                hobbyId: hobby._id,
                goal: goal ? String(goal).trim() : `Learn & Master ${trimmedName}`,
                experienceLevel: experienceLevel ? String(experienceLevel).trim() : 'beginner',
                weeklyPracticeMinutes: Math.max(0, Number(weeklyPracticeMinutes) || 120),
                targetDate: targetDate ? new Date(targetDate) : null,
                status: 'active',
                currentStage: 'active_learning'
            })
        } else {
            userHobby.status = 'active'
            userHobby.currentStage = 'active_learning'
            if (goal) userHobby.goal = String(goal).trim()
            if (experienceLevel) userHobby.experienceLevel = String(experienceLevel).trim()
            if (weeklyPracticeMinutes) userHobby.weeklyPracticeMinutes = Number(weeklyPracticeMinutes)
            await userHobby.save()
        }

        await userHobby.populate('hobbyId', 'name slug capabilities category')

        // Update User displayName & avatar if provided during onboarding
        const userUpdateData = {}
        if (req.body.displayName) userUpdateData.displayName = String(req.body.displayName).trim()
        if (req.body.avatar) userUpdateData.avatar = String(req.body.avatar).trim()
        if (Object.keys(userUpdateData).length > 0) {
            await User.findByIdAndUpdate(userId, userUpdateData).catch(() => {})
        }

        return sendResponse(res, 200, {
            success: true,
            message: `Enrolled in ${trimmedName} successfully.`,
            userHobby
        })
    } catch (error) {
        console.error('[DashboardController] Error enrolling in new hobby:', error)
        return sendResponse(res, 500, {
            success: false,
            message: 'Failed to enroll in new hobby.',
            error: error.message
        })
    }
}


