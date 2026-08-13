const mongoose = require('mongoose')

const UserHobbySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hobbyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hobby',
        required: true
    },
    goal: {
        type: String,
        default: ''
    },
    experienceLevel: {
        type: String,
        default: ''
    },
    targetDate: {
        type: Date,
        default: null
    },
    weeklyPracticeMinutes: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'paused', 'completed', 'archived'],
        default: 'active'
    },
    // FIX #7 — closed enum, not free-form text.
    // If curriculum stages become data-driven later, promote to a
    // CurriculumStage reference — but keep it a closed set since it
    // drives branching logic.
    currentStage: {
        type: String,
        enum: ['onboarding', 'assessment', 'active_learning', 'review', 'completed'],
        default: 'onboarding'
    }
}, {
    timestamps: true,
    versionKey: false
})

// One relationship per user per hobby
UserHobbySchema.index({ userId: 1, hobbyId: 1 }, { unique: true })

module.exports = mongoose.model('UserHobby', UserHobbySchema, 'UserHobbies')
