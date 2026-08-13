const mongoose = require('mongoose')

const PracticeSessionSchema = new mongoose.Schema({
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
    type: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        default: ''
    },
    task: {
        type: String,
        default: ''
    },
    inputAssetIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserAsset'
    }],
    // FIX #4 — hoisted out of the result blob so it can be indexed
    // and aggregated directly (e.g. avg score per hobby per month)
    // without unpacking an untyped object.
    score: {
        type: Number,
        default: null,
        min: 0,
        max: 100
    },
    // Feedback, mistakes, strengths, nextRecommendedAction
    // (score removed from here — see above)
    result: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    durationSeconds: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['started', 'completed', 'abandoned'],
        default: 'started'
    }
}, {
    timestamps: true,
    versionKey: false
})

// Session history per hobby, most recent first
PracticeSessionSchema.index({ userHobbyId: 1, createdAt: -1 })

module.exports = mongoose.model('PracticeSession', PracticeSessionSchema, 'PracticeSessions')
