const mongoose = require('mongoose')

const UserSkillSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userHobbyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserHobby',
        required: true
    },
    hobbySkillId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HobbySkill',
        required: true
    },
    score: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    confidence: {
        type: Number,
        default: 0,
        min: 0,
        max: 1
    },
    level: {
        type: String,
        default: ''
    },
    strengths: {
        type: [String],
        default: []
    },
    weaknesses: {
        type: [String],
        default: []
    },
    totalPracticeCount: {
        type: Number,
        default: 0
    },
    totalPracticeMinutes: {
        type: Number,
        default: 0
    },
    lastPracticedAt: {
        type: Date,
        default: null
    },
    // ── NEW PACING & STREAK FIELDS ──
    dailyXpEarned: {
        type: Number,
        default: 0
    },
    lastXpDate: {
        type: Date,
        default: Date.now
    },
    streakCount: {
        type: Number,
        default: 0
    },
    lastStreakDate: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    versionKey: false
})

// FIX #3 — One progress record per user per skill.
// Nothing previously stopped duplicate UserSkill docs for the same
// user+skill pair, which breaks the "one progress record per user
// per skill" invariant.
UserSkillSchema.index({ userHobbyId: 1, hobbySkillId: 1 }, { unique: true })

module.exports = mongoose.model('UserSkill', UserSkillSchema, 'UserSkills')
