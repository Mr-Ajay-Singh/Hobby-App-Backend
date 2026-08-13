const mongoose = require('mongoose')

// NOTE — DEFERRED, NOT FIXED:
// Per-user/per-hobby cost dashboards computed by aggregating AIRequest
// directly are fine at low volume. Add a UsageDailyRollup collection
// (userId, hobbyId, date, totalCost, totalTokens, requestCount) once
// either (a) AIRequest exceeds a few million documents, or (b) any
// dashboard query starts taking >1s.

const AIRequestSchema = new mongoose.Schema({
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
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        default: null
    },
    provider: {
        type: String,
        enum: ['openai', 'gemini', 'anthropic', 'deepseek'],
        required: true
    },
    model: {
        type: String,
        required: true
    },
    capability: {
        type: String,
        enum: ['text', 'reasoning', 'vision', 'audio', 'video'],
        required: true
    },
    purpose: {
        type: String,
        enum: ['chat', 'assessment', 'curriculum', 'exercise', 'analysis'],
        required: true
    },
    inputTokens: {
        type: Number,
        default: 0
    },
    outputTokens: {
        type: Number,
        default: 0
    },
    latencyMs: {
        type: Number,
        default: 0
    },
    estimatedCost: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['success', 'failed'],
        default: 'success'
    },
    error: {
        type: String,
        default: null
    }
}, {
    timestamps: true,
    versionKey: false
})

// Per-user cost/usage rollups, most recent first
AIRequestSchema.index({ userId: 1, createdAt: -1 })

module.exports = mongoose.model('AIRequest', AIRequestSchema, 'AIRequests')
